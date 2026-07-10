# PT Application Funnel — Setup Checklist

Before the "Apply for Personal Training" flow goes fully live, do these:

## 1. Deploy the logging backend (Google Apps Script)
1. Create/open a Google Sheet to log applications to.
2. Extensions → Apps Script → paste in `assets/js/apps-script.gs`.
3. Edit `NOTIFY_EMAIL` at the top of that file to your real inbox.
4. Deploy → New deployment → Web app → Execute as **Me** → Who has access **Anyone**.
5. Copy the Web app URL.
6. Paste it into `CONFIG.APPS_SCRIPT_URL` near the top of `assets/js/application.js`.

Until you do this, the form works fine standalone — it just doesn't log
anywhere or email you. `APPS_SCRIPT_URL` defaults to an empty string,
which skips the network call silently.

## 2. Deposit payment link (strategy session reservation)
The deposit is intentionally small and symbolic — it's a commitment
filter, not real revenue, so it stays in rupees (₹199) even though the
coaching investment itself is quoted in USD. Razorpay/UPI works fine
for this even for NRI clients paying the deposit from abroad.
1. Create a ₹199 payment link (Razorpay or UPI).
2. Paste the URL into `CONFIG.DEPOSIT_LINK` in `assets/js/application.js`
   (currently `#deposit-link-here`).
3. `CONFIG.DEPOSIT_LABEL` is already set to `₹199` — only change it if
   the amount changes.

## 3. Calendly booking link
1. Set up a Calendly event for the strategy session.
2. Paste the URL into `CONFIG.CALENDLY_URL` in `assets/js/application.js`
   (currently `#calendly-link-here`).

## 4. Tune the scoring, if needed
Everything scoring-related lives in one place: `SCORING_CONFIG` near the
top of `assets/js/application.js`. You can adjust without touching any
other logic:
- `qualificationThreshold` — score out of 100 needed to qualify (default 65).
- `weights` — how much each section counts.
- `autoDisqualifiers` — the four auto-reject answers (can't afford
  minimum sessions, budget below the floor, refuses documentation,
  needs English-only coaching).
- `recommendPlan` — how many sessions/week gets recommended.

## 5. Flag: the budget cutoff is a placeholder
Question 16's lowest bracket ("Under $1,500/month") is set as an
auto-disqualifier — that number assumes a ~$1,560/mo minimum coaching
plan and was a placeholder decision made without your direct sign-off
on the exact figure. Confirm it's the right floor before this goes
live — change the option value/label in `QUESTION_DEFS.q16` in
`assets/js/application.js` if not.

Related: the Hindi-language fit question (asked right after Contact,
before Section A) auto-disqualifies "No, I'd need English-only" —
coaching is delivered in Hindi (with English support), which is the
core differentiator for this ICP (affluent Hindi-speaking Indians and
NRIs). It's framed as a fit question, never as gatekeeping.

## 6. Known limitation: the 6-month cooldown is client-side only
The "don't let someone reapply within 180 days" check is stored in the
applicant's own browser `localStorage`. It works for the common case
(same device, same browser, didn't clear data) but isn't a hard
guarantee — clearing browser storage or using a different device/browser
resets it. A server-side cooldown (keyed by email, checked against the
Google Sheet) would be needed to close this gap; out of scope for v1.

## 7. What's already done, no action needed
- No prices shown anywhere except the deposit amount on the strategy-
  session reservation button (explicitly framed as a commitment filter,
  not a fee — see `CONFIG.DEPOSIT_LABEL`).
- Auto-qualification runs entirely client-side, instantly, no delay.
- Newsletter opt-in is unchecked by default, explicit consent copy.
- Progress autosaves to localStorage — refreshing mid-application doesn't
  lose answers.
