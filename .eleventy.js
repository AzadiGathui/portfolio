const markdownIt = require("markdown-it");
const md = markdownIt({ html: true }); // required: allows raw HTML (Tableau embeds, etc.) in .md files

// async so we can import @11ty/eleventy-img, which is an ES module
module.exports = async function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  // ------------------------------------------------------------------
  // IMAGES — optimised at build time (nothing extra is sent to visitors)
  // ------------------------------------------------------------------
  const { default: Image, eleventyImageTransformPlugin } = await import("@11ty/eleventy-img");

  // Rewrites every <img> in the finished HTML (templates AND markdown) into a
  // <picture> with AVIF + WebP files at several widths. The browser downloads
  // only the size it needs, so a phone never pays for a 4000px original.
  // It also adds width/height, so the page doesn't jump while images load.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "svg"], // AVIF is smallest; WebP is the fallback every current browser supports; "svg" lets SVGs pass through (below)
    widths: [400, 800, 1200, 1600], // never upscales: originals smaller than a width are kept at their own size
    svgShortCircuit: true, // SVGs are already tiny and sharp; leave them as they are
    htmlOptions: {
      imgAttributes: {
        loading: "lazy", // off-screen images wait until the visitor scrolls near them
        decoding: "async",
        // `sizes` tells the browser how wide the image will be SHOWN, so it can pick
        // the right file before layout. Default = the 960px content column.
        // Templates override this where a layout differs (lab grid, resume reels…).
        sizes: "(max-width: 960px) 100vw, 960px",
      },
    },
  });

  // CSS background images (project covers, lab header) aren't <img> tags, so the
  // transform above can't see them. This filter makes one resized WebP instead:
  //   style="background: url('{{ coverImage | bgImage }}') …"
  eleventyConfig.addAsyncFilter("bgImage", async (src, width = 1920) => {
    // leave SVGs and remote URLs untouched
    if (!src || src.endsWith(".svg") || /^https?:/.test(src)) return src;
    const meta = await Image("src" + src, {
      widths: [width],
      formats: ["webp"],
      // the real output folder (usually _site), read when the filter runs,
      // so a build to another folder still gets its cover images
      outputDir: require("node:path").join(eleventyConfig.directories.output, "img"),
      urlPath: "/img/",
    });
    return meta.webp[0].url;
  });

  // Passthrough copies — files Eleventy should serve as-is, without processing
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("CNAME"); // critical: preserves azadi.design custom domain on every deploy

  // Projects collection — reads all .md files in src/projects/, sorted by front matter `order`
  eleventyConfig.addCollection("projects", (api) =>
    api
      .getFilteredByGlob("src/projects/*.md")
      .filter((p) => p.data.published !== false) // exclude drafts
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );

  // Returns the index of a page in a collection — used for prev/next project navigation
  eleventyConfig.addFilter("getProjectIndex", (collection, url) =>
    collection.findIndex((p) => p.url === url)
  );

  // Returns the current 4-digit year — used in footer copyright line
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());

  // Extracts h2 headings with id attributes from rendered HTML — used for sticky TOC
  eleventyConfig.addFilter("tocEntries", (content) => {
    const matches = [...content.matchAll(/<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/gi)];
    return matches.map(([, id, html]) => ({
      id,
      text: html.replace(/<[^>]+>/g, "").trim(),
    }));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk", // allows {{ variable }} syntax inside .md files
    htmlTemplateEngine: "njk",
  };
};
