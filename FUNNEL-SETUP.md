# Interest form setup

The application page (`/apply/`) is a simple single-page "register your
interest" form now — not a qualification funnel. The long multi-step
qualification questionnaire (scoring, auto-disqualifiers, ₹199 deposit,
Calendly booking, 6-month cooldown) is **shelved**, not deleted — its
logic lives in git history (`sites/coaching/assets/js/application.js`
prior to this change, and `sites/coaching/assets/js/apps-script.gs` on
disk, unused) and can come back later if needed.

## Setup (one-time)

1. Create a new Google Sheet (any name).
2. Extensions -> Apps Script.
3. Paste in the contents of
   `sites/coaching/assets/js/prospects-apps-script.gs`.
4. In the script, set `NOTIFY_EMAIL` to KC's real email address.
5. Deploy -> New deployment -> Web app:
   - Execute as: Me
   - Who has access: Anyone
6. Copy the deployment's `/exec` URL.
7. Paste that URL into `CONFIG.APPS_SCRIPT_URL` in
   `sites/coaching/assets/js/application.js`.

That's it. Submissions land in a sheet tab named **"Client Prospects"**
(auto-created on first submission) and KC gets an email per submission.
The coach-dashboard can later read prospects via the same deployment's
`doGet` endpoint (`{ prospects: [...] }`).
