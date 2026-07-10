# SPEC — Personal Training Foundations (client site)

## 1. What this is
A client website for **KC Jugran**, a solo personal trainer / CHEK Holistic
Lifestyle Coach and founder of "Living Foundations." Built by Karan's agency
(Vats Business). The site publishes his coaching manual, *Personal Training
Foundations — A Practical Manual for Coaches, Trainers & Fitness
Enthusiasts*, as an interactive 15-chapter web book (stacking/bracing, squat
and hinge technique, exercise library, nutrition, programme design, injury
management, client coaching, etc.), plus a downloadable .docx version.

Live at: `https://kcjugran.github.io/personal-training-foundations/`
Repo: `kcjugran/personal-training-foundations` (public, GitHub).

## 2. Status
**Live and deployed.** `master` is in sync with `origin/master`, auto-deploys
to GitHub Pages on every push (`.github/workflows/deploy.yml`). Working tree
is clean — no uncommitted changes.

Built and working:
- Full 15-chapter book content (front matter + 14 chapters + appendix),
  ported from an earlier static (v1) build into the current React app.
- Sidebar nav, global search, exercise cards with cues, quizzes
  (`ChapterQuiz`, `KnowledgeTest`), interactive worksheets/assessments
  (`InteractiveAssessments`).
- Per-chapter real URLs + prerendered SEO/AI-answer-engine content
  (`llms.txt`, `llms-full.txt`, JSON-LD, sitemap) — optimized for
  GPTBot/ClaudeBot/Perplexity crawlers.
- Downloadable book as `.docx`, generated from the same live chapter data.
- Image compression pass done for load speed.

Explicitly removed (not half-done, deliberately cut):
- **Gemini-powered "AI Practice Coach" tab** — built in the original Google
  AI Studio scaffold, then removed in commit `d97372f` ("Merge full book
  content into Google framework, remove AI Coach") "per request." No Gemini
  code, dependency, or API call remains anywhere in `src/` or `server.ts`.

## 3. Architecture & key files
- **Stack**: React 19 + TypeScript, Vite 6, Tailwind CSS 4, Express (dev/prod
  server), esbuild (bundles `server.ts` → `dist/server.cjs` for `npm start`).
- **Entry points**: `index.html` → `src/main.tsx` → `src/App.tsx` (841 lines;
  routing, tabs, layout, search).
- **Content**: `src/data/chaptersData.ts` (1726 lines — all chapter body
  text/figures) and `src/data/quizData.ts`.
- **Components**: `src/components/ChapterQuiz.tsx`, `KnowledgeTest.tsx`,
  `InteractiveAssessments.tsx` (1702 lines), `FigureVideoButton.tsx`.
- **Build scripts**: `scripts/generate-docx.ts` (renders the .docx from
  `chaptersData.ts`), `scripts/generate-seo.ts` (writes prerendered HTML per
  chapter, sitemap, llms.txt).
- **Dev/prod server**: `server.ts` — Vite middleware in dev, static file
  serving from `dist/` in production (`npm run build && npm start`).
- **Gemini integration: currently none.** `metadata.json` still declares
  `"majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]` and
  `README.md` still carries AI-Studio boilerplate ("Set the `GEMINI_API_KEY`
  in `.env.local`") — both are stale leftovers from the original AI Studio
  export and no longer match what the app does. No `.env.example` file
  exists in the current tree; it was deleted in the same commit that removed
  the AI Coach feature. No `@google/genai` (or similar) dependency in
  `package.json`.

## 4. Constraints & decisions
- **Client work** — quality bar and brand (Living Foundations / KC Jugran)
  must be respected; this is not an internal/experimental project.
- **Free-first hosting** — deployed via GitHub Pages (free), triggered by
  GitHub Actions on push to `master`. No paid infra in use.
- **API key security** — if Gemini (or any) API integration is ever
  reintroduced, the key must stay server-side/env-only (`process.env`),
  never bundled into client JS. Currently moot since no Gemini calls exist,
  but the stale `metadata.json` capability flag and README instructions
  should not mislead a future contributor into wiring a client-side key —
  clean these up before any AI feature work resumes.
- Content is authored in `src/data/chaptersData.ts` as the single source of
  truth; the .docx download and SEO/llms.txt output are both generated from
  it, not maintained separately.

## 5. How to extend
- **New chapter/content**: add/edit entries in `src/data/chaptersData.ts`;
  rerun `npm run build` to regenerate `.docx` and SEO output automatically
  (both scripts run as part of `build`).
- **New quiz/assessment**: extend `src/data/quizData.ts` and the relevant
  component in `src/components/`.
- **New page/route**: add within `src/App.tsx`'s existing tab/routing
  structure; keep the sidebar nav and chapter-URL scheme consistent since
  SEO metadata (JSON-LD, sitemap, canonical URLs) is generated per chapter.
- **Reintroducing AI features**: would need a new server-side endpoint in
  `server.ts` (or a serverless function, since GitHub Pages is static-only
  and can't run server code) — GitHub Pages cannot execute `server.ts` in
  production, so any live Gemini call needs a separate always-on host or an
  edge/serverless function, not just an env var.

## 6. Open questions
- TBD — confirm with Karan: is the stale `GEMINI_API_KEY` / AI Studio
  README/metadata.json language meant to be cleaned up, or intentionally
  left as-is (e.g. in case AI Coach is revived)?
- TBD — confirm with Karan: is this the final launched state the client
  has approved, or is further review/sign-off still pending?
- TBD — confirm with Karan: any plans to reintroduce an AI-powered feature
  (coach, chatbot), and if so, what hosting (GitHub Pages can't run a
  server-side API key safely)?
