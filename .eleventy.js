const markdownIt = require("markdown-it");
const md = markdownIt({ html: true }); // required: allows raw HTML (Tableau embeds, etc.) in .md files

module.exports = function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

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

  // Resources collection — articles, prototypes, and live tools in src/resources/
  eleventyConfig.addCollection("resources", (api) =>
    api
      .getFilteredByGlob("src/resources/*.md")
      .filter((p) => p.data.published !== false)
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );

  // Returns the index of a page in a collection — used for prev/next navigation
  eleventyConfig.addFilter("getCollectionIndex", (collection, url) =>
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
