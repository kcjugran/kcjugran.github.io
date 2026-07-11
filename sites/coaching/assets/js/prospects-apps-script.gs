/**
 * prospects-apps-script.gs — backend for the "register your interest" form.
 *
 * DEPLOY STEPS (KC does this):
 *   1. Create a new Google Sheet (any name).
 *   2. Extensions -> Apps Script.
 *   3. Delete the default Code.gs contents, paste this whole file in.
 *   4. Set NOTIFY_EMAIL below to the address that should get submission alerts.
 *   5. Deploy -> New deployment -> type: Web app.
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   6. Copy the deployment's /exec URL.
 *   7. Paste that URL into CONFIG.APPS_SCRIPT_URL in
 *      sites/coaching/assets/js/application.js.
 *
 * The sheet tab used is named "Client Prospects" — this script creates it
 * (with a header row) automatically on first submission if it's missing.
 */

var SHEET_NAME = "Client Prospects";
var NOTIFY_EMAIL = "kc@example.com"; // <-- KC: replace with your real email

var HEADERS = [
  "Submitted At",
  "Name",
  "Email",
  "Age",
  "Gender",
  "Requirements",
  "Days/Week",
  "Budget",
  "Timing",
  "Source",
  "Source (other)",
  "Start When"
];

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function doPost(e) {
  var sheet = getOrCreateSheet_();
  var data = {};

  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Invalid JSON" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var row = [
    data.submitted_at || new Date().toISOString(),
    data.name || "",
    data.email || "",
    data.age || "",
    data.gender || "",
    data.requirements || "",
    data.days_per_week || "",
    data.budget || "",
    data.timing || "",
    data.source || "",
    data.source_other || "",
    data.start_when || ""
  ];

  sheet.appendRow(row);

  try {
    notifyKc_(data);
  } catch (err) {
    // don't fail the submission just because email failed
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function notifyKc_(data) {
  var subject = "New interest form submission: " + (data.name || "Unknown");
  var body = [
    "New interest registration:",
    "",
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
  var sheet = getOrCreateSheet_();
  var values = sheet.getDataRange().getValues();
  var prospects = [];

  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    prospects.push({
      submittedAt: r[0],
      name: r[1],
      email: r[2],
      age: r[3],
      gender: r[4],
      requirements: r[5],
      daysPerWeek: r[6],
      budget: r[7],
      timing: r[8],
      source: r[9],
      sourceOther: r[10],
      startWhen: r[11]
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ prospects: prospects }))
    .setMimeType(ContentService.MimeType.JSON);
}
