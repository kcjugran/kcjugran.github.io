# Hire-Me Site — Build Plan

> Execution plan for KC Jugran's client-facing hiring site. Written 2026-07-09 by the planning session; built to be executed cold by another Claude session/model. Strategy source of truth: `E:\Softwarew\Git Repo\Living Foundations\business-strategy.md` (read the "Client acquisition funnel", "Qualifying process", and "Billing/pricing" sections before changing anything about the funnel behavior).

## 1. Purpose
One simple site with one job: convert interest into applications. Two hire paths:
1. **Personal Training** (primary — highest priority revenue engine per strategy doc)
2. **Seminars & Workshops** (KC speaks/teaches at your gym, event, or organization)

Everything funnels to "Work With Me" → application. No browsing depth, no blog, no course content here — free content lives on his other properties (Clarity, PT course site, Living Foundations articles) and this site links out to them.

## 2. Non-negotiable rules (from business-strategy.md — violating these is a build failure)
- **NO prices anywhere on the site.** Not for PT, not for seminars. Price is revealed only on the strategy call. (Reference site holisticfitnessheather.com shows $100/hr — we deliberately do NOT copy that.)
- **PT lane is application-gated**: Work With Me → questionnaire → (qualified: Calendly booking / disqualified: waitlist message). The questionnaire itself is being built in a separate session — this site only provides the entry point and an embed slot (see §6).
- **Results-first, not credentials-first** copy. Demonstrated transformation over certificate lists. Brief qualifications mention is fine; never a wall of certs.
- **Scarcity framing is allowed and intended**: "limited client roster", "application only", waitlist language. Never fake numbers — just don't disclose volume.
- **Seminar lane is NOT gated by the PT questionnaire.** A gym owner booking a seminar is a different buyer — short inquiry form instead (see §5).

## 3. Page structure (adapted from holisticfitnessheather.com, single landing page + one apply page per lane)

### index.html (top to bottom)
1. **Nav** — wordmark left; anchor links (About · Personal Training · Seminars · Results); one pill button right: **Work With Me** (scrolls to offers). Sticky, cream bg, hairline bottom border.
2. **Hero** — full-viewport-ish. Playfair display headline, KC's positioning in one line (working copy: "Simple answers for a stronger body and a clearer mind." — refine to his voice at build time). Sub-line: "Online personal training & live seminars — by application." Single CTA button: **Work With Me**. Subtle radial cream/sand gradient bg (match LF hero.css pattern), optional right-side headshot.
3. **Meet KC** — 2-col: photo + short results-first bio (3–4 sentences max). One line of qualification, the rest is what he does for people. "I'm not here to lecture you with jargon — I give you the version you can use."
4. **Offer cards (the fork)** — two cards side by side (stack on mobile), equal visual weight but PT listed first:
   - **1-on-1 Personal Training** — "A small, private client roster. Expensive, personal, and built around your life. By application only." Bullets: what they get (direct access, personal programming, accountability app, 3+ days/week commitment expected). CTA: **Apply for Personal Training** → `apply.html`.
   - **Seminars & Workshops** — "Bring me to your gym, team, or event. Live, practical, no-jargon teaching that people actually use." Bullets: formats (1–2 day workshops, talks, staff training). CTA: **Book a Seminar** → `seminar.html`.
5. **How it works** — 3 numbered steps, PT-lane focused: ① Apply (10–15 min questionnaire) → ② Strategy call (if selected) → ③ Begin. Explicitly states "I take on a limited number of clients. If no slot is open, qualified applicants join the waitlist."
6. **Results** — testimonial cards. NOTE: real testimonials are being documented during 2026; build the section to render from a small JSON/array so new ones drop in without redesign. Launch with 1–3 real ones if available from his 3 current clients (anonymized per consent rules — blurred/no-name is acceptable); if zero are ready, ship the section hidden behind a comment flag, not with fakes. **Never fabricate testimonials.**
7. **Free resources strip** — 3 small cards linking out: Clarity guide · PT basics course · Living Foundations articles. Framing: "Not ready to work together? Start with the free stuff — it's genuinely free, no email wall."
8. **Final CTA band** — sage bg, cream text, one line + Work With Me button.
9. **Footer** — minimal: nav links, social links, © year. No newsletter yet (future item per his notes).

### apply.html (PT lane)
- Short header restating the deal: limited roster, application first, no obligation.
- **Questionnaire embed slot**: `<div id="pt-application"></div>` + a clearly-commented integration contract (see §6). Until the real form lands, show a graceful placeholder: "Applications open soon" + optional mailto.
- No nav distractions — logo + back link only (momentum: don't give an applicant exits).

### seminar.html (seminar lane)
- Short pitch header (who it's for: gyms, teams, events, coach groups).
- Simple inquiry form (name, organization, city, audience type/size, preferred dates, what you want covered). Static-site-friendly submission: Formspree free tier / Google Form embed / mailto fallback — executor picks the free option that works, no paid services.
- These leads go to KC directly; no auto-qualification.

## 4. Design spec (extracted from his three live properties — this is the brand, don't invent a new one)
- **Palette** (CSS custom properties):
  - `--cream: #F9F8F6` (page bg) · `--cream-alt: #F2EFE9` · `--sand: #E5E1DA` (borders/dividers)
  - `--charcoal: #2C2C2C` (body text) · `--ink: #1A1A1A` (headings)
  - `--sage: #3A4A3E` (THE accent — buttons, links, final CTA band) · `--sage-light: #4A5D4E` (hover)
  - Optional warm secondary from Clarity, used sparingly (one callout max): `--clay: #B5613A`
  - ONE committed accent (sage). Do not use five colors.
- **Type**: Playfair Display (headings, 600–700, clamp()-scaled) + Inter (body, 400/500/600). Google Fonts, subset/trimmed payload (match what LF did: only needed weights).
- **Components**: cards radius 14px (24px for hero container), soft shadows `0 1px 2px rgba(26,26,26,.05), 0 6px 16px -12px rgba(26,26,26,.18)`, pill buttons with hover lift, easing `cubic-bezier(0.23,1,0.32,1)`, staggered card entrance (~40ms steps) — all lifted from LF's cards.css/hero.css patterns.
- **Vibe target**: editorial, warm, premium-minimal. If it could be a template, it failed.

## 5. Tech & deploy
- **Plain static HTML/CSS/vanilla JS** — no framework, no build step (matches LF philosophy; this is a 3-page site). One bundled+minified CSS file.
- Mobile-responsive, tested at both viewports before showing KC.
- SEO/share layer is part of done: title/meta/OG/Twitter tags, semantic HTML, JSON-LD `Person` + `Service` schema, alt text on all images.
- **Deploy: GitHub Pages, free** (his standing default). Private repo is fine — Pages still serves. Repo: this folder (`hire-me`), rename if KC prefers.
- Performance: lazy-load images, no CDN JS dependencies, font payload trimmed.

## 6. Questionnaire integration contract (for the other session that builds the form)
- The PT application form mounts into `#pt-application` on `apply.html`.
- Expected behavior (from strategy doc, already decided — do not re-litigate): 10–15 min questionnaire → instant auto-decision → **qualified: immediately show Calendly booking** (no delay, no "check your email") → **disqualified: immediate waitlist confirmation**, email logged to sheet, 6-month re-application cooldown.
- The site itself stays dumb: it hosts the mount point and matches the form's visual tokens (§4). All logic lives with the form.

## 7. Execution routing (orchestration note)
- Build = mechanical from this spec → **sonnet subagent** (or a sonnet session). Design judgment is already encoded here + in `~/.claude/expertise/design-dna.md` (executor: read it).
- Run the standard design chain at build time: refero-design (light — direction is already locked) → frontend-design build → emil-design-eng polish pass on hover/scroll/entrance motion.
- Verify before delivery: both viewports, Lighthouse-ish sanity (no huge fonts/images), all links, form fallback.

## 8. Open items for KC (need answers before/at build time — none block starting)
1. **Domain**: GitHub Pages subdomain fine to start, or does he have a domain to point? (kcjugran.com / livingfoundations.* ?)
2. **Photos**: which headshot/training photos to use (real ones, no stock).
3. **Copy voice pass**: hero line + bio need his approval before ship.
4. **Site name/wordmark**: "KC Jugran" vs "Living Foundations — Work With Me"? (Recommendation: his name — this is the personal-brand property; LF stays the content brand.)
5. Calendly account/link existence (needed by the form session, not by this site directly).
