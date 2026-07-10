/* ==========================================================================
   apps-script.gs — Google Apps Script backend for the PT application form.

   WHAT THIS DOES
   Every submission from application.js (qualified, disqualified, and
   declined) is POSTed here as JSON. This script appends one row to a
   Google Sheet and emails KC a readable summary per application.

   HOW TO DEPLOY (KC — do this once)
   1. Create a new Google Sheet (or open an existing one you want to log to).
   2. Extensions -> Apps Script.
   3. Delete the default Code.gs contents, paste this whole file in.
   4. Update NOTIFY_EMAIL below to your real inbox.
   5. Click Deploy -> New deployment.
      - Type: "Web app"
      - Execute as: "Me"
      - Who has access: "Anyone"
   6. Click Deploy, authorize the permissions Google asks for.
   7. Copy the Web app URL it gives you.
   8. Paste that URL into CONFIG.APPS_SCRIPT_URL in
      assets/js/application.js on the site.

   Re-deploy (Deploy -> Manage deployments -> Edit -> New version) any
   time you edit this file — the URL stays the same.
   ========================================================================== */

var NOTIFY_EMAIL = "hello@kcjugran.com"; // <-- replace with KC's real inbox
var SHEET_NAME = "PT Applications";

// Column order for the sheet. Everything after the fixed columns is
// flattened from `answers` (one column per question id, q1..q18) plus
// the two "other" free-text fields for multi-selects.
var FIXED_COLUMNS = [
  "timestamp", "name", "email", "phone", "outcome", "score",
  "recommendedPlan", "budgetBracketUSD", "declineReason", "declineOther",
  "comfortableInvestment", "newsletter"
];

var QUESTION_COLUMNS = [
  "qLang", "q1_selected", "q1_other", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9",
  "q10", "q11", "q12", "q13", "q14", "q15_selected", "q16", "q17", "q18"
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    appendRow(data);
    sendNotification(data);
  } catch (err) {
    // Swallow errors — a broken log call must never surface to the
    // applicant. Check the Apps Script execution log if rows go missing.
    console.error(err);
  }
  return ContentService.createTextOutput("ok");
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(FIXED_COLUMNS.concat(QUESTION_COLUMNS));
  }
  return sheet;
}

function appendRow(data) {
  var sheet = getSheet();
  var answers = data.answers || {};

  function answerValue(qid) {
    var v = answers[qid];
    if (v == null) return "";
    if (typeof v === "object" && v.selected) {
      return v.selected.join(", ");
    }
    return v;
  }

  var row = [
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.email || "",
    data.phone || "",
    data.outcome || "",
    data.score != null ? data.score : "",
    data.recommendedPlan || "",
    answerValue("q16"),
    data.declineReason || "",
    data.declineOther || "",
    data.declineBudgetAnswer || "",
    data.newsletter ? "yes" : "no",
    answerValue("qLang"),
    answerValue("q1") && answers.q1 && answers.q1.selected ? answers.q1.selected.join(", ") : "",
    answers.q1 && answers.q1.other ? answers.q1.other : "",
    answerValue("q2"),
    answerValue("q3"),
    answerValue("q4"),
    answerValue("q5"),
    answerValue("q6"),
    answerValue("q7"),
    answerValue("q8"),
    answerValue("q9"),
    answerValue("q10"),
    answerValue("q11"),
    answerValue("q12"),
    answerValue("q13"),
    answerValue("q14"),
    answers.q15 && answers.q15.selected ? answers.q15.selected.join(", ") : "",
    answerValue("q16"),
    answerValue("q17"),
    answerValue("q18")
  ];

  sheet.appendRow(row);
}

function sendNotification(data) {
  var outcomeLabel = {
    qualified: "QUALIFIED",
    disqualified: "DISQUALIFIED (waitlisted)",
    declined: "DECLINED BY APPLICANT"
  }[data.outcome] || data.outcome;

  var subject = "PT Application — " + outcomeLabel + " — " + (data.name || "Unknown");
  var lines = [];

  lines.push("Outcome: " + outcomeLabel);
  lines.push("Score (internal only): " + (data.score != null ? data.score : "n/a"));
  if (data.recommendedPlan) lines.push("Recommended plan: " + data.recommendedPlan);
  lines.push("");
  lines.push("Name: " + (data.name || ""));
  lines.push("Email: " + (data.email || ""));
  lines.push("Phone: " + (data.phone || ""));
  lines.push("Newsletter opt-in: " + (data.newsletter ? "yes" : "no"));
  lines.push("");

  if (data.outcome === "declined") {
    lines.push("Decline reason: " + (data.declineReason || ""));
    if (data.declineOther) lines.push("Decline other: " + data.declineOther);
    if (data.declineBudgetAnswer) lines.push("Comfortable investment (market research): " + data.declineBudgetAnswer);
    lines.push("");
  }

  lines.push("--- Full answers ---");
  var answers = data.answers || {};
  Object.keys(answers).sort().forEach(function (key) {
    var v = answers[key];
    if (v && typeof v === "object" && v.selected) {
      lines.push(key + ": " + v.selected.join(", ") + (v.other ? " (other: " + v.other + ")" : ""));
    } else {
      lines.push(key + ": " + v);
    }
  });

  MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join("\n"));
}
