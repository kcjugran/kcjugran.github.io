/**
 * prospects-apps-script.gs — backend for the "register your interest" form.
 * Bound to the "Client Prospects" sheet.
 *   doPost  — appends a submission (sanitized against formula injection, honeypot spam-filtered).
 *   doGet   — returns submissions as JSON, but ONLY to callers with the correct ?token=
 *             (so lead PII is not publicly readable even though the /exec URL is in the site JS).
 *
 * SECURITY NOTES:
 *   - ACCESS_TOKEN gates reads. The public form only ever POSTs (no token needed to write).
 *     The coach dashboard (local, non-public) reads with ?token=ACCESS_TOKEN.
 *   - sanitizeCell_() neutralises spreadsheet formula injection (=, +, -, @, |, tab) by
 *     prefixing a single quote, so a malicious "name" can't execute when the sheet is opened.
 *   - A hidden "company" honeypot field silently drops bot submissions.
 */

var SHEET_NAME = "Client Prospects";
var NOTIFY_EMAIL = "KCJugran@gmail.com";
var ACCESS_TOKEN = "kcp_7f3a9d2e1b8c4f60a5d9"; // gates doGet reads. Keep private (dashboard-only).

var HEADERS = [
  "Submitted At", "Name", "Email", "Age", "Gender", "Requirements",
  "Days/Week", "Budget", "Timing", "Source", "Source (other)", "Start When"
];

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { sheet = ss.insertSheet(SHEET_NAME); }
  if (sheet.getLastRow() === 0) { sheet.appendRow(HEADERS); }
  return sheet;
}

// Neutralise CSV/formula injection + cap length. Anything starting with a
// formula trigger gets a leading apostrophe so Sheets treats it as text.
function sanitizeCell_(v) {
  var s = (v == null ? "" : String(v)).slice(0, 500);
  if (/^[=+\-@\t|]/.test(s)) { s = "'" + s; }
  return s;
}

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: "Invalid JSON" });
  }

  // Honeypot: real users never fill "company" (it's hidden). Bots do → drop silently.
  if (data.company) { return json_({ ok: true }); }

  // Minimal validation: require a name + a plausible email.
  var name = String(data.name || "").trim();
  var email = String(data.email || "").trim();
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json_({ ok: false, error: "Missing required fields" });
  }

  var sheet = getOrCreateSheet_();
  var row = [
    sanitizeCell_(data.submitted_at || new Date().toISOString()),
    sanitizeCell_(data.name), sanitizeCell_(data.email), sanitizeCell_(data.age),
    sanitizeCell_(data.gender), sanitizeCell_(data.requirements), sanitizeCell_(data.days_per_week),
    sanitizeCell_(data.budget), sanitizeCell_(data.timing), sanitizeCell_(data.source),
    sanitizeCell_(data.source_other), sanitizeCell_(data.start_when)
  ];
  sheet.appendRow(row);

  try { notifyKc_(data); } catch (err) {}
  return json_({ ok: true });
}

function notifyKc_(data) {
  var subject = "New interest form submission: " + (data.name || "Unknown");
  var body = [
    "New interest registration:", "",
    "Name: " + (data.name || ""),
    "Email: " + (data.email || ""),
    "Age: " + (data.age || ""),
    "Gender: " + (data.gender || ""),
    "Looking for: " + (data.requirements || ""),
    "Days/week: " + (data.days_per_week || ""),
    "Budget: " + (data.budget || ""),
    "Preferred timing: " + (data.timing || ""),
    "Source: " + (data.source || "") + (data.source_other ? " (" + data.source_other + ")" : ""),
    "Start when: " + (data.start_when || ""),
    "Submitted at: " + (data.submitted_at || "")
  ].join("\n");
  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

function doGet(e) {
  // Read is token-gated so lead PII is not publicly readable.
  if (!e || !e.parameter || e.parameter.token !== ACCESS_TOKEN) {
    return json_({ error: "Unauthorized" });
  }
  var sheet = getOrCreateSheet_();
  var values = sheet.getDataRange().getValues();
  var prospects = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    if (r[0] === "Submitted At") { continue; } // skip any stray header row
    prospects.push({
      submittedAt: r[0], name: r[1], email: r[2], age: r[3], gender: r[4],
      requirements: r[5], daysPerWeek: r[6], budget: r[7], timing: r[8],
      source: r[9], sourceOther: r[10], startWhen: r[11]
    });
  }
  return json_({ prospects: prospects });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
