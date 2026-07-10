# Articles — Phase 3 (vendored, built)

Vendored copy of "Living Foundations" (11ty), built. Served at `/articles/*`
(index at `/articles/`, each article at `/articles/videos/<slug>/` — permalinks
were kept AS-IS, not rewritten from `/videos/<slug>/`, per the phase-3 task).
`eleventy.config.js` sets `pathPrefix: "/articles/"` so internal links/assets
resolve under the subpath; output directory structure is unchanged
(`_site/videos/<slug>/`). Relocation into the mega-site's `dist/articles/` is
a copy step — see `INTEGRATION.md` for the exact command (wired into
`build.mjs` by the orchestrator, not by this vendored copy).
See `megasite-SPEC.md` §3/§4/§7 in Vats Business/clients/fitness-coach for the plan.
