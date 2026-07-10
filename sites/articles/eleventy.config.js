const path = require("path");
const fs = require("fs");

// Order matters only for CSS specificity between files (there's minimal
// cross-file overlap, but keep base first and component files after).
const CSS_FILES = [
  "base.css",
  "header.css",
  "hero.css",
  "featured.css",
  "cards.css",
  "search.css",
  "article.css",
  "social.css",
  "footer.css",
];

function bundleCss() {
  const cssDir = path.join(__dirname, "src/assets/css");
  const combined = CSS_FILES.map((f) =>
    fs.readFileSync(path.join(cssDir, f), "utf-8")
  ).join("\n");

  // Light minification: strip comments and collapse whitespace. Keeps the
  // source files themselves readable/separated for maintenance; only the
  // build output is compacted.
  const minified = combined
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

  fs.writeFileSync(path.join(cssDir, "bundle.css"), minified, "utf-8");
}

module.exports = function (eleventyConfig) {
  bundleCss();
  eleventyConfig.on("eleventy.before", bundleCss);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addCollection("videos", (collectionApi) =>
    collectionApi.getFilteredByGlob("./src/videos/*.md")
  );

  // Plain-text excerpt for homepage cards — pulled from the first <p>,
  // so it doesn't repeat the H1 title shown right above it on the card.
  const decodeEntities = (str) =>
    str
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");

  const excerptText = (html, maxLen = 130) => {
    const firstParagraph = String(html).match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const source = firstParagraph ? firstParagraph[1] : String(html);
    const text = decodeEntities(
      source.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    );
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
  };

  eleventyConfig.addFilter("excerpt", excerptText);

  // Splits rendered article HTML at the last "takeaways/action steps"
  // heading so it can be styled as a distinct highlighted card.
  eleventyConfig.addFilter("splitTakeaways", (html) => {
    const str = String(html);
    const headingRe = /<h[23][^>]*>((?:(?!<\/h[23]>)[\s\S])*)<\/h[23]>/gi;
    let match;
    let lastMatch = null;
    while ((match = headingRe.exec(str)) !== null) {
      if (/takeaway|action step/i.test(match[1])) {
        lastMatch = match;
      }
    }
    if (!lastMatch) return { main: str, takeaways: null };
    return {
      main: str.slice(0, lastMatch.index),
      takeaways: str.slice(lastMatch.index),
    };
  });

  return {
    // Rewrites internal links (the `url` filter) and asset refs so they
    // resolve correctly once this site is relocated under /articles/ in
    // the mega-site's shared dist/. Does NOT change the output directory
    // structure — output still lands in _site/videos/<slug>/ as before;
    // relocation to dist/articles/ happens via a copy step (see
    // sites/articles/INTEGRATION.md), giving a final served path of
    // /articles/videos/<slug>/.
    pathPrefix: "/articles/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
