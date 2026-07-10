#!/usr/bin/env node
/**
 * build.mjs — assembles dist/ from the vendored sites + the new brand hub.
 *
 * Preserve-as-is architecture: each site under sites/ keeps its exact HTML/
 * CSS/JS. The only edits made here are (a) rewriting relative asset/link
 * paths so pages resolve correctly once flattened into a shared dist/ tree,
 * and (b) injecting the shared umbrella nav at the top of <body>.
 *
 * Run: node build.mjs
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const BUILD_V = Date.now().toString(36);

// ---------------------------------------------------------------------------
// small fs helpers
// ---------------------------------------------------------------------------

function rmrf(p) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch (err) {
    // Windows can hold a directory handle open (e.g. a `python -m http.server
    // --directory dist` left running from a previous preview) even after its
    // contents are deletable. Fall back to clearing everything *inside* the
    // directory and leaving the (now-empty) directory itself in place —
    // mkdirp() right after this is a no-op on an existing dir either way.
    if (fs.existsSync(p)) {
      for (const entry of fs.readdirSync(p)) {
        fs.rmSync(path.join(p, entry), { recursive: true, force: true });
      }
    } else {
      throw err;
    }
  }
}

function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  mkdirp(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  mkdirp(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function writeHtml(destPath, html) {
  mkdirp(path.dirname(destPath));
  fs.writeFileSync(destPath, html, "utf8");
}

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

// ---------------------------------------------------------------------------
// umbrella nav — REMOVED (rejected by KC as an ugly stacked dark header).
// Cross-section links now live natively inside each section's own nav
// instead. injectNav()/injectCourseNav() are kept as no-ops so call sites
// below don't need to be ripped out one by one.
// ---------------------------------------------------------------------------

/** No-op: previously injected the umbrella nav. Left as a pass-through. */
function injectNav(html, _currentSection) {
  return html;
}

/** Replace every literal occurrence of `from` with `to` in a string. */
function replaceAll(str, from, to) {
  return str.split(from).join(to);
}

/**
 * Course-specific nav injection. The course is a React 19 SPA (createRoot
 * mounts only into <div id="root">, per src/main.tsx) — inserting the nav as
 * a sibling *before* #root is safe, React never touches it, same technique
 * as injectNav() above.
 *
 * BUT the course's own React header (src/App.tsx `#main-header`) is itself
 * `sticky top-0`, and its mobile tab bar / sidebar are `sticky top-16`
 * hard-coded to sit exactly one header-height (4rem) below it. Reusing the
 * umbrella nav's normal `position: sticky; top: 0` here would stack two
 * sticky bars fighting for the same top-0 slot and break those top-16
 * offsets. Safest fix that keeps full app function: inject the same visual
 * nav (consistency with the rest of the site) but force it to
 * `position: static` for this page only, via a scoped inline override, so
 * it scrolls away normally and the app's own sticky header still becomes
 * the thing pinned to the real viewport top once scrolled past.
 */
function injectCourseNav(html) {
  return html;
}

/** Recursively collect every .html file under a directory. */
function collectHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectHtmlFiles(p));
    } else if (entry.name.endsWith(".html")) {
      out.push(p);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// 1. clean dist/
// ---------------------------------------------------------------------------

console.log("[build] cleaning dist/");
rmrf(DIST);
mkdirp(DIST);

// ---------------------------------------------------------------------------
// 2. brand hub -> dist/ root
// ---------------------------------------------------------------------------

console.log("[build] brand hub -> /");
{
  const hubDir = path.join(ROOT, "src", "brand-hub");
  let html = readText(path.join(hubDir, "index.html"));
  html = injectNav(html, null); // no single "current" section on the hub
  html = replaceAll(html, 'href="/styles.css"', `href="/styles.css?v=${BUILD_V}"`);
  writeHtml(path.join(DIST, "index.html"), html);
  copyFile(path.join(hubDir, "styles.css"), path.join(DIST, "styles.css"));
  // Branded OG share card, served from the dist root so the same absolute
  // https://kcjugran.github.io/og-card.png URL works from every section.
  copyFile(path.join(hubDir, "og-card.png"), path.join(DIST, "og-card.png"));
}

// ---------------------------------------------------------------------------
// 4. coaching (hire-me) -> /coaching/, /apply/, /seminars/
//
//    Problem: index.html / apply.html / seminar.html all reference their
//    assets as relative "assets/...", and land at three different depths
//    in dist/ (/coaching/, /apply/, /seminars/). A single relative
//    "assets/" folder can't serve all three without breaking.
//
//    Solution: vendor the assets once to an absolute top-level folder,
//    /coaching-assets/, and rewrite every assets/ reference in the copied
//    HTML to the absolute path. Also rewrite the pages' own cross-links
//    (index.html <-> apply.html <-> seminar.html) to the new absolute
//    routes so navigation between them keeps working post-move.
// ---------------------------------------------------------------------------

console.log("[build] coaching -> /coaching/, /apply/, /seminars/, /coaching-assets/");
{
  const coachingDir = path.join(ROOT, "sites", "coaching");
  copyDir(path.join(coachingDir, "assets"), path.join(DIST, "coaching-assets"));

  // SEO base fixes (Phase 4): the vendored pages still carry canonical/OG/
  // JSON-LD URLs pointing at the old standalone-repo path (/hire-me/...).
  // canonicalUrl is this page's real served URL under the mega-site.
  function transformCoachingHtml(html, canonicalUrl, srcFile) {
    let out = html;
    // No umbrella nav anymore — coaching's own cream site-nav header
    // (index.html) and the apply/seminar wordmark stay intact as-is.
    // assets/css/..., assets/js/..., assets/img/... -> /coaching-assets/...
    out = replaceAll(out, 'href="assets/', 'href="/coaching-assets/');
    out = replaceAll(out, 'src="assets/', 'src="/coaching-assets/');
    // og:image / twitter:image use content="assets/..." (not href=/src=), so
    // the rewrite above doesn't touch them — fix separately, to an absolute URL.
    out = replaceAll(out, 'content="assets/', 'content="/coaching-assets/');
    // cross-page links between the three coaching pages
    out = replaceAll(out, 'href="index.html"', 'href="/coaching/"');
    out = replaceAll(out, 'href="apply.html"', 'href="/apply/"');
    out = replaceAll(out, 'href="seminar.html"', 'href="/seminars/"');
    // stale "domain not finalized" note — domain is finalized now.
    out = out.replace(
      /\s*<!-- Domain not finalized yet \(PLAN\.md open item #1\)[^>]*-->\n?/,
      "\n"
    );
    // canonical / og:url -> this page's real URL
    out = out.replace(
      /(<link rel="canonical" href=")https:\/\/kcjugran\.github\.io\/hire-me\/[^"]*(")/,
      `$1${canonicalUrl}$2`
    );
    out = out.replace(
      /(<meta property="og:url" content=")https:\/\/kcjugran\.github\.io\/hire-me\/[^"]*(")/,
      `$1${canonicalUrl}$2`
    );
    // JSON-LD Person/Service urls -> new mega-site paths
    out = replaceAll(
      out,
      '"url": "https://kcjugran.github.io/hire-me/"',
      '"url": "https://kcjugran.github.io/coaching/"'
    );
    out = replaceAll(
      out,
      '"url": "https://kcjugran.github.io/hire-me/apply.html"',
      '"url": "https://kcjugran.github.io/apply/"'
    );
    out = replaceAll(
      out,
      '"url": "https://kcjugran.github.io/hire-me/seminar.html"',
      '"url": "https://kcjugran.github.io/seminars/"'
    );
    // resource cards ("Not ready to work together?") still point at "#"
    out = replaceAll(
      out,
      '<a class="resource-card" href="#" style="--stagger:0">',
      '<a class="resource-card" href="/clarity/" style="--stagger:0">'
    );
    out = replaceAll(
      out,
      '<a class="resource-card" href="#" style="--stagger:1">',
      '<a class="resource-card" href="/course/" style="--stagger:1">'
    );
    out = replaceAll(
      out,
      '<a class="resource-card" href="#" style="--stagger:2">',
      '<a class="resource-card" href="/articles/" style="--stagger:2">'
    );
    // cache-busting for coaching stylesheets + scripts (bitten twice by stale
    // cached CSS/JS)
    out = replaceAll(
      out,
      'href="/coaching-assets/css/styles.css"',
      `href="/coaching-assets/css/styles.css?v=${BUILD_V}"`
    );
    out = replaceAll(
      out,
      'href="/coaching-assets/css/application.css"',
      `href="/coaching-assets/css/application.css?v=${BUILD_V}"`
    );
    out = replaceAll(
      out,
      'src="/coaching-assets/js/application.js"',
      `src="/coaching-assets/js/application.js?v=${BUILD_V}"`
    );
    out = replaceAll(
      out,
      'src="/coaching-assets/js/main.js"',
      `src="/coaching-assets/js/main.js?v=${BUILD_V}"`
    );
    return out;
  }

  const pages = [
    { src: "index.html", dest: "coaching/index.html", section: "coaching", canonicalUrl: "https://kcjugran.github.io/coaching/" },
    { src: "apply.html", dest: "apply/index.html", section: "coaching", canonicalUrl: "https://kcjugran.github.io/apply/" },
    { src: "seminar.html", dest: "seminars/index.html", section: "coaching", canonicalUrl: "https://kcjugran.github.io/seminars/" },
  ];

  for (const p of pages) {
    let html = readText(path.join(coachingDir, p.src));
    html = transformCoachingHtml(html, p.canonicalUrl, p.src);
    html = injectNav(html, p.section);
    writeHtml(path.join(DIST, p.dest), html);
  }
}

// ---------------------------------------------------------------------------
// 5. clarity -> /clarity/, /clarity/<slug>/
//
//    Problem: clarity's sub-pages (goals.html, ikigai.html, ...) reference
//    article.css / logo.jpg and each other via same-directory relative
//    paths. Once each becomes its own dist/clarity/<slug>/index.html
//    (one directory deeper than the source), those relative refs need a
//    "../" prefix, and cross-links need to become the new pretty-URL
//    slugs.
//
//    Solution: keep article.css + logo.jpg once at dist/clarity/ (the
//    parent of every slug folder) and rewrite each sub-page's refs to
//    "../article.css", "../logo.jpg", "../<slug>/", and "../" for the
//    clarity home link. The clarity home page itself (index.html) stays
//    at dist/clarity/index.html, so its own same-dir refs are untouched
//    except its nav links to the sub-pages, which become "<slug>/".
// ---------------------------------------------------------------------------

console.log("[build] clarity -> /clarity/, /clarity/<slug>/");
{
  const clarityDir = path.join(ROOT, "sites", "clarity");
  const slugs = ["goals", "ikigai", "how-to-journal", "shadow-work", "values"];

  copyFile(path.join(clarityDir, "article.css"), path.join(DIST, "clarity", "article.css"));
  copyFile(path.join(clarityDir, "logo.jpg"), path.join(DIST, "clarity", "logo.jpg"));

  // Stale schema reference shared by every clarity page's Person "sameAs" ->
  // the course now lives at /course/, not the old standalone-repo path.
  function fixClaritySchema(html) {
    return replaceAll(
      html,
      "https://kcjugran.github.io/personal-training-foundations/",
      "https://kcjugran.github.io/course/"
    );
  }

  // Coaching cross-reference (task: point every content section back at the
  // 1:1 offer). Sub-pages already have a `.cta`/`.btn` pattern (see the
  // "Build your goal breakdown" block) — reuse it so the added block matches
  // existing style exactly, just before the closing </footer>.
  function injectClaritySubpageCta(html) {
    return html.replace(
      /\s*<\/footer>/,
      `\n  <div class="cta">
    <h2>Want 1:1 guidance instead of going it alone?</h2>
    <p>Work with KC directly — private coaching for the same clarity and goal work, tailored to you.</p>
    <a class="btn" href="/coaching/">Work with KC 1:1 &rarr;</a>
  </div>
\n</footer>`
    );
  }

  // Small on-brand cross-section links near the logo/header — NOT the
  // internal Clarity content tabs (those stay untouched). Subpages: added
  // into the .topbar, right after the brand link, reusing the topbar nav's
  // own link color/size (see article.css ".topbar nav a").
  function injectClaritySubpageHeaderLinks(html) {
    return html.replace(
      /(<a class="brand" href="\.\.\/">[\s\S]*?<\/a>)(\s*<nav>)/,
      `$1
    <div style="margin-left:1.25rem;display:flex;align-items:center;gap:0.9rem;font-family:system-ui,sans-serif;font-size:12px;flex-shrink:0">
      <a href="/coaching/" style="color:rgba(247,243,236,0.62);text-decoration:none;white-space:nowrap">Personal Coaching &rarr;</a>
    </div>$2`
    );
  }

  // index.html sidebar app: small link group under the "Living Foundations"
  // tagline, above the internal content-tab nav (<nav class="nav">, left
  // untouched).
  function injectClarityIndexHeaderLinks(html) {
    return html.replace(
      /(<p>Living Foundations<\/p>\s*<\/div>)(\s*<nav class="nav">)/,
      `$1
    <div style="display:flex;flex-direction:column;gap:0.35rem;margin:0.75rem 0 0;padding:0 0 0.75rem;border-bottom:1px solid rgba(255,255,255,0.08)">
      <a href="/coaching/" style="font-size:12px;color:#7A9E7E;text-decoration:none">Personal Coaching &rarr;</a>
      <a href="/course/" style="font-size:12px;color:rgba(247,243,236,0.55);text-decoration:none">Course</a>
      <a href="/articles/" style="font-size:12px;color:rgba(247,243,236,0.55);text-decoration:none">Articles</a>
    </div>$2`
    );
  }

  // index.html has no <footer> (it's a single-page sidebar app) — add a
  // small matching link at the bottom of the sidebar's bonus nav instead.
  function injectClaritySidebarCta(html) {
    return html.replace(
      /(<div class="nav-bonus">[\s\S]*?<\/div>)(\s*<\/aside>)/,
      `$1\n    <div class="nav-bonus" style="margin-top:0.5rem;border-top:1px solid rgba(122,158,126,0.25);padding-top:0.75rem">
      <a href="/coaching/" style="display:flex;align-items:center;gap:8px;padding:0.6rem 0.9rem;font-size:0.85rem;color:#F7F3EC;text-decoration:none">Work with KC 1:1 &rarr;</a>
    </div>$2`
    );
  }

  // Clarity home page: same directory as article.css/logo.jpg, only the
  // nav links to sub-pages need to become pretty-URL folders.
  {
    let html = readText(path.join(clarityDir, "index.html"));
    for (const slug of slugs) {
      html = replaceAll(html, `href="${slug}.html"`, `href="${slug}/"`);
    }
    html = fixClaritySchema(html);
    html = injectClarityIndexHeaderLinks(html);
    html = injectClaritySidebarCta(html);
    html = injectNav(html, "clarity");
    writeHtml(path.join(DIST, "clarity", "index.html"), html);
  }

  // Sub-pages: one directory deeper, so same-dir refs need "../".
  for (const slug of slugs) {
    let html = readText(path.join(clarityDir, `${slug}.html`));
    html = replaceAll(html, 'href="article.css"', 'href="../article.css"');
    html = replaceAll(html, 'src="logo.jpg"', 'src="../logo.jpg"');
    html = replaceAll(html, 'href="logo.jpg"', 'href="../logo.jpg"');
    html = replaceAll(html, 'href="index.html"', 'href="../"');
    for (const other of slugs) {
      if (other === slug) continue;
      html = replaceAll(html, `href="${other}.html"`, `href="../${other}/"`);
    }
    // canonical/og:url/mainEntityOfPage/breadcrumb still use the flat
    // "<slug>.html" filename; the real served URL is the pretty "<slug>/".
    html = replaceAll(
      html,
      `https://kcjugran.github.io/clarity/${slug}.html`,
      `https://kcjugran.github.io/clarity/${slug}/`
    );
    html = fixClaritySchema(html);
    html = injectClaritySubpageHeaderLinks(html);
    html = injectClaritySubpageCta(html);
    html = injectNav(html, "clarity");
    writeHtml(path.join(DIST, "clarity", slug, "index.html"), html);
  }
}

// ---------------------------------------------------------------------------
// 6. course (React 19 + Vite + TS, vendored copy of Personal Training
//    Foundations) -> /course/*
//
//    The vendored copy in sites/course/ has its Vite `base` wired to
//    `/course/` whenever MEGASITE=1 is set (see sites/course/vite.config.ts),
//    which also drives its runtime withBase()/chapterUrl() helpers and the
//    generate-seo.ts canonical URLs — one env var relocates the whole app.
//
//    Build strategy: if sites/course/dist/ already exists, trust it and just
//    copy (fast path — lets you `npm run build:megasite` once in
//    sites/course/ and re-run `node build.mjs` freely without rebuilding
//    every time). If it's missing, build.mjs shells out and builds it here
//    so a clean checkout + `node build.mjs` still works standalone (and so
//    CI can do the same, see deploy.yml).
// ---------------------------------------------------------------------------

console.log("[build] course -> /course/");
{
  const courseDir = path.join(ROOT, "sites", "course");
  const courseDist = path.join(courseDir, "dist");

  if (!fs.existsSync(courseDist)) {
    console.log("[build]   sites/course/dist missing — building course now (npm install + build:megasite)");
    if (!fs.existsSync(path.join(courseDir, "node_modules"))) {
      execSync("npm install", { cwd: courseDir, stdio: "inherit" });
    }
    execSync("npm run build:megasite", {
      cwd: courseDir,
      stdio: "inherit",
      env: { ...process.env, MEGASITE: "1" },
    });
  } else {
    console.log("[build]   using existing sites/course/dist (delete it to force a rebuild)");
  }

  const courseOut = path.join(DIST, "course");
  copyDir(courseDist, courseOut);

  // Inject the umbrella nav into every prerendered HTML page (front matter +
  // one per chapter from generate-seo.ts). See injectCourseNav() above for
  // why this uses a static (non-sticky) variant instead of the standard one.
  for (const htmlFile of collectHtmlFiles(courseOut)) {
    let html = readText(htmlFile);
    html = injectCourseNav(html);
    fs.writeFileSync(htmlFile, html, "utf8");
  }
}

// ---------------------------------------------------------------------------
// 7. articles (11ty, vendored copy of Living Foundations) -> /articles/*
//
//    The vendored copy in sites/articles/ has `pathPrefix: "/articles/"` set
//    in its eleventy.config.js, so every internal link/asset/canonical is
//    already baked with the /articles/ prefix at 11ty build time. Permalinks
//    are kept as the source's `/videos/<slug>/`, so the served path once
//    copied under dist/articles/ is /articles/videos/<slug>/.
//
//    The umbrella nav is ALSO already baked in at 11ty build time (injected
//    into sites/articles/src/_includes/base.njk), so — unlike coaching/
//    clarity/course — we do NOT call injectNav() here; just copy the tree.
//
//    Build strategy mirrors the course: if sites/articles/_site exists, copy
//    it (fast path); if missing, shell out and build it so a clean checkout +
//    `node build.mjs` works standalone (and CI, see deploy.yml).
// ---------------------------------------------------------------------------

console.log("[build] articles -> /articles/");
{
  const articlesDir = path.join(ROOT, "sites", "articles");
  const articlesOut = path.join(articlesDir, "_site");

  if (!fs.existsSync(articlesOut)) {
    console.log("[build]   sites/articles/_site missing — building articles now (npm install + eleventy)");
    if (!fs.existsSync(path.join(articlesDir, "node_modules"))) {
      execSync("npm install", { cwd: articlesDir, stdio: "inherit" });
    }
    execSync("npx @11ty/eleventy", { cwd: articlesDir, stdio: "inherit" });
  } else {
    console.log("[build]   using existing sites/articles/_site (delete it to force a rebuild)");
  }

  // Copy as-is — pathPrefix + nav are already baked into the 11ty output.
  copyDir(articlesOut, path.join(DIST, "articles"));
}

// ---------------------------------------------------------------------------
// 8. root-level discovery files: robots.txt, sitemap.xml (index),
//    sitemap-pages.xml (static pages), llms.txt (master AI index).
//
//    Sub-site sitemaps already exist in their own build output
//    (course/sitemap.xml, articles/sitemap.xml) and are just referenced here,
//    not regenerated. sitemap-pages.xml covers the static pages assembled
//    directly by this script (brand hub, coaching, clarity).
// ---------------------------------------------------------------------------

console.log("[build] root discovery files -> /robots.txt, /sitemap.xml, /sitemap-pages.xml, /llms.txt");
{
  const BASE = "https://kcjugran.github.io";

  // -- robots.txt --------------------------------------------------------
  const robotsTxt = `User-agent: *
Allow: /

# AI crawlers / answer-engine bots — explicitly welcomed, not blocked.
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: DuckAssistBot
Allow: /

Sitemap: ${BASE}/sitemap.xml
`;
  writeHtml(path.join(DIST, "robots.txt"), robotsTxt);

  // -- sitemap-pages.xml (static pages assembled by this script) ---------
  const claritySlugs = ["goals", "ikigai", "how-to-journal", "shadow-work", "values"];
  const staticPageUrls = [
    `${BASE}/`,
    `${BASE}/coaching/`,
    `${BASE}/apply/`,
    `${BASE}/seminars/`,
    `${BASE}/clarity/`,
    ...claritySlugs.map((slug) => `${BASE}/clarity/${slug}/`),
  ];
  const sitemapPagesXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticPageUrls
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
    .join("\n")}\n</urlset>\n`;
  writeHtml(path.join(DIST, "sitemap-pages.xml"), sitemapPagesXml);

  // -- sitemap.xml (index, references sub-site sitemaps + sitemap-pages.xml) --
  // Only reference a sub-sitemap if it actually landed in dist/ (defensive —
  // if a sub-site's build output is ever missing/renamed, don't 404 from the index).
  const candidateSitemaps = [
    `${BASE}/sitemap-pages.xml`,
    fs.existsSync(path.join(DIST, "course", "sitemap.xml")) ? `${BASE}/course/sitemap.xml` : null,
    fs.existsSync(path.join(DIST, "articles", "sitemap.xml")) ? `${BASE}/articles/sitemap.xml` : null,
  ].filter(Boolean);
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${candidateSitemaps
    .map((loc) => `  <sitemap>\n    <loc>${loc}</loc>\n  </sitemap>`)
    .join("\n")}\n</sitemapindex>\n`;
  writeHtml(path.join(DIST, "sitemap.xml"), sitemapIndexXml);

  // -- llms.txt (master AI-readable index) --------------------------------
  const llmsTxt = `# KC Jugran

> Premium holistic coach — body, breath, and mind. Sessions in Hindi or English. Private 1:1 coaching, seminars, a free practical-training course, companion articles, and a free life-clarity guide — all under one roof.

## Coaching

- [Coaching](${BASE}/coaching/): Private 1:1 holistic coaching — body, breath, and mind, one system built for the long term. Sessions in Hindi or English. By application only.
- [Apply](${BASE}/apply/): Application for the private coaching roster.
- [Seminars](${BASE}/seminars/): Live seminars and workshops for gyms, teams, and events.

## Course

- [Personal Training Foundations](${BASE}/course/): A free, practical coaching manual — technique, programming, nutrition, injury management. Also has its own AI index at ${BASE}/course/llms.txt (full text: ${BASE}/course/llms-full.txt).

## Articles

- [Living Foundations Articles](${BASE}/articles/): Practical, no-jargon video companion articles on training, recovery, and mindset. Also has its own AI index at ${BASE}/articles/llms.txt.

## Clarity

- [Clarity](${BASE}/clarity/): A free guide to cutting through the noise — Ikigai, values, goal-setting, shadow work, and journaling.
`;
  writeHtml(path.join(DIST, "llms.txt"), llmsTxt);
}

// ---------------------------------------------------------------------------
// 9. branded 404 page -> dist/404.html
//
//    GitHub Pages auto-serves /404.html for any unknown path on a user site.
//    Self-contained: reuses the brand hub's own tokens/styles (/styles.css)
//    plus the umbrella nav, so no new design system is introduced.
// ---------------------------------------------------------------------------

console.log("[build] 404 page -> /404.html");
{
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page not found — KC Jugran</title>
<meta name="robots" content="noindex, follow">
<link rel="icon" href="/coaching-assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Playfair+Display:wght@600;700&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<style>
  .not-found-hero {
    max-width: 720px;
    margin: 0 auto;
    padding: 6rem 1.5rem 3rem;
    text-align: center;
  }
  .not-found-hero .eyebrow { justify-content: center; }
  .not-found-hero h1 { font-size: clamp(2rem, 3.5vw + 1rem, 3rem); }
  .not-found-hero p.lede {
    color: var(--sand-dark);
    font-size: 1.05rem;
    max-width: 44ch;
    margin: 0 auto 2.5rem;
  }
</style>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>

<main id="main">
  <section class="not-found-hero">
    <p class="eyebrow">404</p>
    <h1>This page moved, or doesn't exist.</h1>
    <p class="lede">Whatever you were looking for isn't here anymore — but everything else on the site still is. Pick a section below.</p>
  </section>

  <section class="route-grid">
    <a class="route-card route-primary" href="/coaching/" style="--stagger:0">
      <span class="video-card-tag">Most Popular</span>
      <h2>Coaching</h2>
      <p>Private 1:1 holistic coaching. By application.</p>
      <span class="route-cta">Explore coaching</span>
    </a>
    <a class="route-card" href="/course/" style="--stagger:1">
      <span class="video-card-tag">Free</span>
      <h2>Course</h2>
      <p>Personal Training Foundations — the practical manual.</p>
      <span class="route-cta">Start the course</span>
    </a>
    <a class="route-card" href="/articles/" style="--stagger:2">
      <span class="video-card-tag">Free</span>
      <h2>Articles</h2>
      <p>Practical writing on training, recovery, and mind.</p>
      <span class="route-cta">Read articles</span>
    </a>
    <a class="route-card" href="/clarity/" style="--stagger:3">
      <span class="video-card-tag">Free</span>
      <h2>Clarity</h2>
      <p>A free guide to cutting through the noise.</p>
      <span class="route-cta">Open Clarity</span>
    </a>
  </section>

  <p style="text-align:center;padding-bottom:4rem">
    <a href="/" style="color:var(--sage);font-weight:600;text-decoration:none">&larr; Back to the home hub</a>
  </p>
</main>
</body>
</html>
`;
  writeHtml(path.join(DIST, "404.html"), html);
}

console.log("[build] done -> dist/");
