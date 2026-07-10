/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Runs after `vite build`. Generates AI-crawler-friendly artifacts from the same
// chaptersData.ts that powers the live app: llms.txt / llms-full.txt, a sitemap,
// and — critically — a real static HTML page per chapter (dist/chapters/<id>/index.html),
// each with its own prerendered content, meta tags, and Article structured data.
//
// Why this exists: the site is a client-side-rendered React SPA. Google's crawler
// executes JS, but most AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
// CCBot, etc.) fetch raw HTML only, and answer engines cite a specific URL, not "the
// whole site." Without this step every one of them saw one empty <div id="root"></div>
// and had nothing to cite for any specific chapter. This script bakes real, chapter-
// specific text and its own URL into the HTML so AI systems can read, cite, and link
// to an exact chapter. React still fully takes over and re-renders the interactive
// app on load for real visitors (createRoot wipes and replaces #root; confirmed live
// that this doesn't affect normal browsing).

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chapters, type Chapter, type ContentBlock, type ChapterSection } from '../src/data/chaptersData';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
// Megasite Phase 2: canonical URLs now live under the unified site's /course/
// path instead of the old standalone-repo path.
const SITE_URL = process.env.MEGASITE ? 'https://kcjugran.github.io/course' : 'https://kcjugran.github.io/personal-training-foundations';
const AUTHOR = 'KC Jugran';
const TITLE = 'Personal Training Foundations';
const SUBTITLE = 'A Practical Manual for Coaches, Trainers & Fitness Enthusiasts';
const DESCRIPTION =
  'A practical, no-fluff coaching manual covering stacking and bracing, squat and hinge technique, ' +
  'breathing mechanics, a full exercise technique library, diet and nutrition, programme design, ' +
  'cardio, the 1-2-3-4 framework for holistic health, breathwork, injury management (MEAT protocol), ' +
  'client coaching philosophy, and group vs. individual training. Written by KC Jugran, CHEK Holistic ' +
  'Lifestyle Coach and founder of Living Foundations.';

function chapterUrl(chapterId: string): string {
  return chapterId === 'front-matter' ? `${SITE_URL}/` : `${SITE_URL}/chapters/${chapterId}/`;
}

function stripMarkup(text: string): string {
  // Strip the site's **bold** / *italic* / ==highlight== inline markup down to plain text.
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/==(.+?)==/g, '$1').replace(/\*(.+?)\*/g, '$1');
}

function blockToPlainLines(block: ContentBlock): string[] {
  if (block.type === 'paragraph' && block.text) {
    const prefix = block.label ? `${stripMarkup(block.label)}: ` : '';
    return [prefix + stripMarkup(block.text)];
  }
  if (block.type === 'list' && block.items) {
    return block.items.map((item) => `- ${stripMarkup(item)}`);
  }
  return [];
}

function blockToHtml(block: ContentBlock): string {
  if (block.type === 'paragraph' && block.text) {
    const prefix = block.label ? `<strong>${escapeHtml(stripMarkup(block.label))}</strong> — ` : '';
    return `<p>${prefix}${escapeHtml(stripMarkup(block.text))}</p>`;
  }
  if (block.type === 'list' && block.items) {
    return `<ul>${block.items.map((item) => `<li>${escapeHtml(stripMarkup(item))}</li>`).join('')}</ul>`;
  }
  if (block.type === 'figure' && block.caption) {
    return `<figure><figcaption>${escapeHtml(stripMarkup(block.caption))}</figcaption></figure>`;
  }
  return '';
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sectionToPlain(section: ChapterSection): string {
  const heading = section.headingLevel === 'h2' ? `## ${section.title}` : `### ${section.title}`;
  const body = section.content.flatMap(blockToPlainLines).join('\n');
  return section.title ? `${heading}\n${body}` : body;
}

function sectionToHtml(section: ChapterSection): string {
  const tag = section.headingLevel === 'h2' ? 'h3' : 'h4';
  const heading = section.title ? `<${tag}>${escapeHtml(section.title)}</${tag}>` : '';
  const body = section.content.map(blockToHtml).join('\n');
  return `${heading}\n${body}`;
}

function chapterToPlainText(ch: Chapter): string {
  const lines: string[] = [];
  lines.push(`# Chapter ${ch.number}: ${ch.title}`);
  lines.push(`_${ch.subtitle}_`);
  lines.push('');
  lines.push(ch.summary);
  lines.push('');
  for (const section of ch.sections) {
    lines.push(sectionToPlain(section));
    lines.push('');
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// llms.txt — concise structured index, per the llmstxt.org convention. Links to the
// real per-chapter URLs so an AI system can fetch exactly the section it needs.
// ---------------------------------------------------------------------------
function generateLlmsTxt(): string {
  const lines: string[] = [];
  lines.push(`# ${TITLE}`);
  lines.push('');
  lines.push(`> ${DESCRIPTION}`);
  lines.push('');
  lines.push(`Author: ${AUTHOR}, CHEK Holistic Lifestyle Coach, founder of Living Foundations.`);
  lines.push(`Full text (single fetch): ${SITE_URL}/llms-full.txt`);
  lines.push(`Site: ${SITE_URL}/`);
  lines.push('');
  lines.push('## Chapters');
  lines.push('');
  for (const ch of chapters) {
    lines.push(`- [${ch.number}. ${ch.title}](${chapterUrl(ch.id)}) — ${ch.summary}`);
  }
  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// llms-full.txt — the entire book as clean plain text/markdown, one fetch.
// ---------------------------------------------------------------------------
function generateLlmsFullTxt(): string {
  const lines: string[] = [];
  lines.push(`# ${TITLE}`);
  lines.push(`## ${SUBTITLE}`);
  lines.push('');
  lines.push(`By ${AUTHOR} — CHEK Holistic Lifestyle Coach, founder of Living Foundations.`);
  lines.push('');
  lines.push(DESCRIPTION);
  lines.push('');
  for (const ch of chapters) {
    lines.push('---');
    lines.push('');
    lines.push(`(${chapterUrl(ch.id)})`);
    lines.push('');
    lines.push(chapterToPlainText(ch));
    lines.push('');
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// sitemap.xml — every chapter is its own URL.
// ---------------------------------------------------------------------------
function generateSitemap(): string {
  const urls = chapters
    .map(
      (ch) => `  <url>
    <loc>${chapterUrl(ch.id)}</loc>
    <changefreq>monthly</changefreq>
    <priority>${ch.id === 'front-matter' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// ---------------------------------------------------------------------------
// Prerendered semantic HTML for a single chapter page.
// ---------------------------------------------------------------------------
function generateChapterArticleHtml(ch: Chapter): string {
  const sections = ch.sections.map(sectionToHtml).join('\n');
  const otherChapters = chapters.filter((c) => c.id !== ch.id);
  return `<article itemscope itemtype="https://schema.org/Article">
    <p><a href="${SITE_URL}/">${escapeHtml(TITLE)}</a> — Chapter ${escapeHtml(ch.number)}</p>
    <h1 itemprop="headline">${escapeHtml(ch.title)}</h1>
    <p><em>${escapeHtml(ch.subtitle)}</em></p>
    <p itemprop="description">${escapeHtml(ch.summary)}</p>
    <p>By <span itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">${escapeHtml(AUTHOR)}</span></span> — CHEK Holistic Lifestyle Coach, founder of Living Foundations. Part of <span itemprop="isPartOf">${escapeHtml(TITLE)}</span>.</p>
    <div itemprop="articleBody">
    ${sections}
    </div>
    <nav aria-label="Other chapters">
      <h2>Other chapters in this book</h2>
      <ol>
        ${otherChapters.map((c) => `<li><a href="${chapterUrl(c.id)}">${escapeHtml(c.number)}. ${escapeHtml(c.title)}</a></li>`).join('')}
      </ol>
    </nav>
  </article>`;
}

// ---------------------------------------------------------------------------
// Prerendered semantic HTML for the home page — full book overview + links out to
// every chapter's own page.
// ---------------------------------------------------------------------------
function generateHomeHtml(): string {
  const chapterHtml = chapters
    .map(
      (ch) => `<section id="chapter-${ch.id}" aria-labelledby="chapter-${ch.id}-title">
        <h2 id="chapter-${ch.id}-title"><a href="${chapterUrl(ch.id)}">Chapter ${escapeHtml(ch.number)}: ${escapeHtml(ch.title)}</a></h2>
        <p><em>${escapeHtml(ch.subtitle)}</em></p>
        <p>${escapeHtml(ch.summary)}</p>
      </section>`
    )
    .join('\n');

  return `<article itemscope itemtype="https://schema.org/Book">
    <h1 itemprop="name">${escapeHtml(TITLE)}</h1>
    <p itemprop="description">${escapeHtml(SUBTITLE)}</p>
    <p>By <span itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">${escapeHtml(AUTHOR)}</span></span> — CHEK Holistic Lifestyle Coach, founder of Living Foundations.</p>
    <p>${escapeHtml(DESCRIPTION)}</p>
    <nav aria-label="Table of contents">
      <ol>
        ${chapters.map((ch) => `<li><a href="${chapterUrl(ch.id)}">${escapeHtml(ch.number)}. ${escapeHtml(ch.title)}</a></li>`).join('')}
      </ol>
    </nav>
    ${chapterHtml}
  </article>`;
}

// ---------------------------------------------------------------------------
// JSON-LD structured data.
// ---------------------------------------------------------------------------
const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: AUTHOR,
  jobTitle: 'CHEK Holistic Lifestyle Coach',
  worksFor: { '@type': 'Organization', name: 'Living Foundations' },
  url: SITE_URL + '/',
};

function generateHomeJsonLd(): string {
  const bookLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: TITLE,
    alternateName: SUBTITLE,
    description: DESCRIPTION,
    author: {
      '@type': 'Person',
      name: AUTHOR,
      jobTitle: 'CHEK Holistic Lifestyle Coach',
      affiliation: { '@type': 'Organization', name: 'Living Foundations' },
    },
    publisher: { '@type': 'Organization', name: 'Living Foundations Press' },
    url: SITE_URL + '/',
    inLanguage: 'en',
    numberOfPages: chapters.length,
    genre: 'Personal Training / Fitness Coaching',
    hasPart: chapters
      .filter((c) => c.id !== 'front-matter')
      .map((c) => ({ '@type': 'CreativeWork', name: c.title, url: chapterUrl(c.id) })),
  };

  // Pull the front-matter FAQ chapter (Who is it for / not for / prior experience / etc.)
  // into real FAQPage schema — a strong AI-answer-engine signal.
  const frontMatter = chapters.find((c) => c.id === 'front-matter');
  const faqSections = (frontMatter?.sections || []).filter(
    (s) => s.headingLevel === 'h3' && s.title?.trim().endsWith('?')
  );
  const faqLd =
    faqSections.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqSections.map((s) => ({
            '@type': 'Question',
            name: s.title,
            acceptedAnswer: {
              '@type': 'Answer',
              text: stripMarkup(s.content.flatMap(blockToPlainLines).join(' ')),
            },
          })),
        }
      : null;

  const blocks = [bookLd, personLd, faqLd].filter(Boolean);
  return blocks.map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`).join('\n    ');
}

function generateChapterJsonLd(ch: Chapter): string {
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: ch.title,
    description: ch.summary,
    author: { '@type': 'Person', name: AUTHOR, url: SITE_URL + '/' },
    publisher: { '@type': 'Organization', name: 'Living Foundations Press' },
    url: chapterUrl(ch.id),
    isPartOf: { '@type': 'Book', name: TITLE, url: SITE_URL + '/' },
    inLanguage: 'en',
  };
  return [articleLd, personLd]
    .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
    .join('\n    ');
}

// ---------------------------------------------------------------------------
// Page assembly — injects meta tags + JSON-LD + prerendered content into a copy of
// the built index.html template (which already has the correct script/css tags).
// ---------------------------------------------------------------------------
function buildPage(opts: {
  template: string;
  title: string;
  description: string;
  canonical: string;
  jsonLd: string;
  content: string;
}): string {
  let html = opts.template;
  const extraMeta = `
    <link rel="canonical" href="${opts.canonical}" />
    <meta name="author" content="${AUTHOR}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(opts.title)}" />
    <meta property="og:description" content="${escapeHtml(opts.description)}" />
    <meta property="og:url" content="${opts.canonical}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(opts.title)}" />
    <meta name="twitter:description" content="${escapeHtml(opts.description)}" />
    <link rel="alternate" type="text/plain" href="${SITE_URL}/llms.txt" title="llms.txt" />
    ${opts.jsonLd}`;

  html = html.replace('<title>Personal Training Foundations — KC Jugran</title>', `<title>${escapeHtml(opts.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(opts.description)}" />`
  );
  html = html.replace('</head>', `${extraMeta}\n  </head>`);
  // The prerendered content has none of the app's real CSS classes (it's plain semantic
  // HTML for crawlers to read), so if left visible it flashes as unstyled black-on-white
  // text for a moment before React hydrates and replaces it — jarring for real visitors.
  // Hide it with an inline style (applied instantly, no external CSS needed) using the
  // standard visually-hidden-but-present accessibility pattern: still full text in the DOM
  // for any crawler that reads raw HTML (none of them render CSS), invisible to human eyes.
  const hiddenContent = `<div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">${opts.content}</div>`;
  html = html.replace('<div id="root"></div>', `<div id="root">${hiddenContent}</div>`);
  return html;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
writeFileSync(join(DIST, 'llms.txt'), generateLlmsTxt(), 'utf-8');
writeFileSync(join(DIST, 'llms-full.txt'), generateLlmsFullTxt(), 'utf-8');
writeFileSync(join(DIST, 'sitemap.xml'), generateSitemap(), 'utf-8');
console.log('Wrote dist/llms.txt, dist/llms-full.txt, dist/sitemap.xml');

const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

// Home page (front-matter) — overwrite dist/index.html in place.
const homeHtml = buildPage({
  template,
  title: `${TITLE} — ${AUTHOR}`,
  description: DESCRIPTION,
  canonical: SITE_URL + '/',
  jsonLd: generateHomeJsonLd(),
  content: generateHomeHtml(),
});
writeFileSync(join(DIST, 'index.html'), homeHtml, 'utf-8');

// One real static page per chapter (skip front-matter — that's the home page).
for (const ch of chapters) {
  if (ch.id === 'front-matter') continue;
  const chapterHtml = buildPage({
    template,
    title: `${ch.title} — ${TITLE} — ${AUTHOR}`,
    description: ch.summary,
    canonical: chapterUrl(ch.id),
    jsonLd: generateChapterJsonLd(ch),
    content: generateChapterArticleHtml(ch),
  });
  const dir = join(DIST, 'chapters', ch.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), chapterHtml, 'utf-8');
}

console.log(`Wrote dist/index.html + ${chapters.length - 1} chapter pages under dist/chapters/<id>/`);
