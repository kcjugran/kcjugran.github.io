# INTEGRATION.md — Articles (Living Foundations, 11ty)

Vendored, configured, built, and verified. This doc tells the orchestrator
exactly what to wire into `build.mjs` and `.github/workflows/deploy.yml` —
I did not touch either file (lane rule).

## What's here

`sites/articles/` = a vendored copy of `Living Foundations/site` (11ty v3):
`src/`, `eleventy.config.js`, `package.json`, `package-lock.json`. Excluded:
`_site/`, `node_modules/`, the Python pipeline (`scripts/`), drafts, outbox,
and any media (`*.mp4/.mov/.webm` — none existed under `site/` anyway; videos
are YouTube embeds only).

Two deliberate edits to the vendored copy (everything else preserved as-is):
1. `eleventy.config.js` — added `pathPrefix: "/articles/"` to the returned
   config object.
2. `src/_includes/base.njk` — injected the umbrella nav markup + a
   `<link rel="stylesheet" href="/shared/nav.css">` right after the opening
   `<body>` tag (applies to every page: index, videos-index, all 110
   articles, 404, since they all extend `base.njk`).

## Build command

```
cd sites/articles
npm install
npx @11ty/eleventy
```

Output lands in `sites/articles/_site/` (unchanged output dir — `pathPrefix`
only rewrites internal links/asset refs via the `url` filter, it does NOT
move the output tree). Structure:

```
_site/
  index.html                 -> /articles/
  videos/index.html          -> /articles/videos/   (full listing)
  videos/<slug>/index.html   -> /articles/videos/<slug>/   (110 articles)
  assets/...                 -> /articles/assets/...
  404.html, robots.txt, sitemap.xml, llms.txt
```

**Permalinks were kept exactly as they are in the source repo**
(`/videos/<slug>/`) — not rewritten to `/<slug>/`. Net served path once
copied under `dist/articles/` is `/articles/videos/<slug>/`. (Note: the
placeholder README this replaced described rewriting permalinks to
`/<slug>/` — that was never done; the task instructions explicitly said
keep `/videos/<slug>/` intact, so that's what's built and verified.)

## Copy step (what the orchestrator needs to add to `build.mjs`)

After the 11ty build runs (in CI or locally), copy the entire `_site/`
output into `dist/articles/`:

```js
console.log("[build] articles -> /articles/");
copyDir(
  path.join(ROOT, "sites", "articles", "_site"),
  path.join(DIST, "articles")
);
```

That's it — no HTML rewriting needed at copy time (unlike coaching/clarity),
because `pathPrefix` already baked the correct `/articles/...` links into
every generated page at 11ty build time. This mirrors the existing TODO
comment already in `build.mjs` for Phase 3, except the permalink segment
stays `/videos/<slug>/` (not rewritten to `/<slug>/` as that TODO comment
speculated).

The umbrella nav is NOT injected by `build.mjs` for this site (unlike
coaching/clarity) — it's already baked into `base.njk` at 11ty build time
(see above), so every page in `_site/` already has it. `build.mjs` should
skip calling `injectNav()` on articles output; just copy the tree as-is.

`dist/shared/nav.css` is already produced unconditionally by the existing
step 3 in `build.mjs` (`shared/ -> dist/shared/nav.css`), so the articles'
absolute `/shared/nav.css` reference resolves without any new work there.

## Deploy workflow (what needs adding to `deploy.yml`)

Before the assemble/copy step runs, install + build articles:

```yaml
- name: Install articles deps
  run: npm install
  working-directory: sites/articles

- name: Build articles (11ty)
  run: npx @11ty/eleventy
  working-directory: sites/articles
```

Then the existing `node build.mjs` step (once it includes the copy step
above) picks up `sites/articles/_site/` and places it at `dist/articles/`.

## Verification performed

Built locally (`npx @11ty/eleventy` in `sites/articles/`) — 115 files
written, 110 of them `videos/<slug>/index.html`. Copied `_site/*` into a
temp dir at `<tmp>/articles/` (sibling `<tmp>/shared/nav.css` too, mirroring
the real `dist/` layout) and served `<tmp>/` with `python -m http.server`.
Checked:

- `GET /articles/` → 200, umbrella nav present (`<div class="umbrella-nav"
  data-umbrella-nav>`), Articles link has `aria-current="page"`, homepage
  cards link to `/articles/videos/<slug>/` (not bare `/videos/`).
- `GET /shared/nav.css` → 200 (nav styling resolves).
- `GET /articles/assets/css/bundle.css` → 200, `GET /articles/assets/logo.jpg`
  → 200.
- Three article pages checked individually — `don-t-exercise-before-learning-this`,
  `know-your-dark-side-basics-of-shadow-work`, `why-your-always-tired` — all
  200, each has the umbrella nav, the YouTube iframe embed pointed at the
  correct video ID, breadcrumb + "Video Articles" links resolving to
  `/articles/videos/`, and JSON-LD `embedUrl` pointing at the right YouTube
  video.
- `grep -r 'href="/videos/\|src="/videos/'` across the whole `_site/` output
  → zero matches (no link anywhere points at the old bare `/videos/` path;
  everything is correctly prefixed `/articles/videos/`).
- `GET /articles/sitemap.xml` → 200.

## Known issue to flag (not fixed — out of this task's explicit scope)

`src/_includes/base.njk` still hardcodes `siteUrl =
"https://kcjugran.github.io/living-foundations"` for canonical URLs, OG
tags, and JSON-LD (`Person`/`WebSite`/`Article`/`VideoObject`/`BreadcrumbList`
schema). Once served at `kcjugran.github.io/articles/...`, these will point
at the old standalone-repo domain/path instead of the new one. The megasite
SPEC (§4) calls SEO regeneration "the #1 risk" for this exact reason. My
task instructions were "don't change how it looks or functions" and didn't
call out SEO/canonical regen, so I left it as-is rather than silently
changing behavior. Recommend a follow-up pass (Phase 6 in the SPEC —
"shared nav injected across all; SEO regenerated") updates `siteUrl` in
`base.njk` to `https://kcjugran.github.io/articles` before the SEO/sitemap
regeneration pass, or a dedicated task addresses it deliberately.
