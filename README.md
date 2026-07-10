# kcjugran.github.io — the mega-site

One domain, four sites, preserved as-is. This repo is a monorepo container:
each existing site keeps its own exact code/look/function; a Node build
script (`build.mjs`) assembles them into one `dist/` tree with a shared
top nav, and a GitHub Action deploys `dist/` to GitHub Pages.

Full plan: `megasite-SPEC.md` in the `Vats Business/clients/fitness-coach`
repo (architecture, URL map, phase list, build facts).

## Structure

```
sites/            vendored copies of each source site (never edit the originals)
  coaching/       copy of the hire-me funnel (Phase 1)
  clarity/        copy of the Clarity guide (Phase 1)
  course/         Personal Training Foundations — Phase 2, not built yet
  articles/       Living Foundations — Phase 3, not built yet
src/
  brand-hub/      the one NEW page — the homepage at /
  shared/         shared umbrella nav (snippet + css), injected into every page
build.mjs         assembles dist/ from the above (see comments — this is the
                  whole system: no framework, no bundler, just Node fs)
.github/workflows/deploy.yml   builds + deploys dist/ to GitHub Pages on push to main
```

## URL map (Phase 1)

| Path | Source |
|---|---|
| `/` | `src/brand-hub/` (new) |
| `/coaching/` | `sites/coaching/index.html` |
| `/apply/` | `sites/coaching/apply.html` |
| `/seminars/` | `sites/coaching/seminar.html` |
| `/coaching-assets/` | `sites/coaching/assets/` (rewritten to an absolute path — see build.mjs §4) |
| `/clarity/` | `sites/clarity/index.html` |
| `/clarity/<slug>/` | `sites/clarity/<slug>.html` (goals, ikigai, how-to-journal, shadow-work, values) |
| `/course/*` | not built — Phase 2 |
| `/articles/*` | not built — Phase 3 |

## Build & run locally

```
node build.mjs
python -m http.server 8080 --directory dist
```

Then visit `http://localhost:8080/`.

## Phase status

- [x] Phase 1 — scaffold, brand hub, assembly system, coaching + clarity (static sites)
- [ ] Phase 2 — course (Vite, `base: '/course/'`)
- [ ] Phase 3 — articles (11ty, `pathPrefix: '/articles/'`)
- [ ] SEO regeneration (sitemaps, llms.txt, JSON-LD) for the unified domain
- [ ] Old-repo redirect stubs (only after KC signs off on the unified preview)

## Rules this repo follows

- **Preserve, don't rewrite.** Sites under `sites/` are vendored copies — the
  only edits build.mjs makes are asset-path fixes and shared-nav injection.
- **Never touch the original source repos** (`hire-me`, `clarity`, etc.) —
  they stay live and unmodified; this repo only ever copies FROM them.
- **Free/static only.** GitHub Pages, no paid services.
