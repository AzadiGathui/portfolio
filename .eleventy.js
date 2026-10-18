const markdownIt = require("markdown-it");
const md = markdownIt({ html: true }); // required: allows raw HTML (Tableau embeds, etc.) in .md files

// async so we can import @11ty/eleventy-img, which is an ES module
module.exports = async function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  // ------------------------------------------------------------------
  // IMAGES: optimised at build time (nothing extra is sent to visitors)
  // ------------------------------------------------------------------
  const { default: Image, eleventyImageTransformPlugin } = await import("@11ty/eleventy-img");

  // Rewrites every <img> in the finished HTML (templates AND markdown) into a
  // <picture> with AVIF + WebP files at several widths. The browser downloads
  // only the size it needs, so a phone never pays for a 4000px original.
  // It also adds width/height, so the page doesn't jump while images load.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "svg"], // AVIF is smallest; WebP is the fallback every current browser supports; "svg" lets SVGs pass through (below)
    widths: [400, 800, 1200], // never upscales: originals smaller than a width are kept at their own size. Capped at 1200 so no print-size copy is published
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

  // Social preview images (og:image) are read by Facebook, LinkedIn etc., which
  // don't all accept AVIF/WebP, so this makes one 1200px JPEG instead.
  eleventyConfig.addAsyncFilter("ogImage", async (src) => {
    if (!src || src.endsWith(".svg") || /^https?:/.test(src)) return src;
    const meta = await Image("src" + src, {
      widths: [1200],
      formats: ["jpeg"],
      outputDir: require("node:path").join(eleventyConfig.directories.output, "img"),
      urlPath: "/img/",
    });
    return meta.jpeg[0].url;
  });

  // Passthrough copies: files Eleventy should serve as-is, without processing.
  // Full-size originals in src/assets/images are NOT copied: pages only get the
  // resized files in /img/ above, so the originals never become public URLs.
  // Only images that must stay as raw files are copied:
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images/branding"); // favicons, apple-touch-icon
  eleventyConfig.addPassthroughCopy("src/assets/images/home"); // hero <video> files and their posters
  eleventyConfig.addPassthroughCopy("src/assets/images/**/*.svg"); // vector logos are served as-is
  eleventyConfig.addPassthroughCopy("src/assets/images/experiment");
  eleventyConfig.addPassthroughCopy("src/assets/files"); // downloads, e.g. the CV PDF (npm run cv:pdf) // /experiment/ pages: already resized WebPs, skipped by the image transform (eleventy:ignore)
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("CNAME"); // critical: preserves azadi.design custom domain on every deploy

  // Projects collection: reads all .md files in src/projects/, sorted by front matter `order`
  const publishedProjects = (api) =>
    api
      .getFilteredByGlob("src/projects/*.md")
      .filter((p) => p.data.published !== false) // exclude drafts
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99));
  eleventyConfig.addCollection("projects", publishedProjects);
  // The projects that also have a page in the /craft/ experiment (front matter `craftPage: true`)
  eleventyConfig.addCollection("craftProjects", (api) =>
    publishedProjects(api).filter((p) => p.data.craftPage)
  );

  // Each project thumbnail's real pixel width, by project URL. The experimental
  // homepage caps every thumbnail at this width, so a small mockup is shown at
  // its own size instead of being stretched (and blurred) to fill its frame.
  eleventyConfig.addCollection("thumbWidths", async (api) => {
    const sharp = require("sharp");
    const widths = {};
    for (const p of publishedProjects(api)) {
      const src = p.data.thumbnail;
      if (!src || /^https?:/.test(src)) continue;
      widths[p.url] = (await sharp("src" + src).metadata()).width;
    }
    return widths;
  });

  // Returns the index of a page in a collection, used for prev/next project navigation
  eleventyConfig.addFilter("getProjectIndex", (collection, url) =>
    collection.findIndex((p) => p.url === url)
  );

  // Returns the current 4-digit year, used in footer copyright line
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());

  // Extracts h2 headings with id attributes from rendered HTML, used for sticky TOC
  eleventyConfig.addFilter("tocEntries", (content) => {
    const matches = [...content.matchAll(/<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/gi)];
    return matches.map(([, id, html]) => ({
      id,
      text: html.replace(/<[^>]+>/g, "").trim(),
    }));
  });

  // Craft case studies (src/craft/projects.njk): the {% phones %} rows below are
  // rendered for the live site; here each becomes the craft reel, the same
  // component the CV uses (phone mockup around each screen, buttons in the
  // corner). Each screen keeps its step / title / caption, beside its phone.
  eleventyConfig.addFilter("craftReels", (html) =>
    html.replace(
      /<div class="phone-reel"[^>]*?aria-label="([^"]*)"[^>]*>((?:<figure class="phone[\s\S]*?<\/figure>)+)<\/div>/g,
      (whole, label, figures) => {
        const screens = [...figures.matchAll(/<figure class="phone[^>]*>[\s\S]*?<img class="phone__screen" src="([^"]*)" alt="([^"]*)"[^>]*>[\s\S]*?(?:<figcaption>([\s\S]*?)<\/figcaption>)?<\/figure>/g)];
        if (!screens.length) return whole;
        const items = screens
          .map(([, src, alt, caption]) => {
            const phone = `<span class="phone-frame"><img src="${src}" sizes="(max-width: 720px) 30vw, 160px" alt="${alt}" loading="lazy"></span>`;
            const text = caption ? `<figcaption>${caption.replace("label label--accent", "label")}</figcaption>` : "";
            return `<figure class="reel__item">${phone}${text}</figure>`;
          })
          .join("");
        return `<div class="sheet frame reel"><div class="reel__track" tabindex="0" role="region" aria-label="${label}: ${screens.length} images, scroll sideways">${items}</div></div>`;
      }
    )
  );

  // ------------------------------------------------------------------
  // PHONE SCREENS: a mobile screen in a device frame, for any project that
  // shows phone layouts (Jireh, Leja, …). Styles: "PHONE SCREENS" in style.css.
  //
  //   {% phones "Fast Track screens" %}
  //     {% phone { src: "/assets/images/projects/jh/code.png", alt: "…", step: "Step 1", title: "Find the counter", caption: "…" } %}
  //     {% phone { title: "Invoice and patient", caption: "…" } %}
  //   {% endphones %}
  //
  // Leave out `src` and the phone is an empty frame labelled with its title,
  // ready for the screen to be added later. A screenshot keeps its own shape;
  // `ratio` (width / height, e.g. "9 / 16") forces one, and sets the empty frame's
  // shape (default 1 / 2). `priority: true` loads
  // the screen straight away (the project cover's mockup: front matter `mockupFrame: phone`).
  // ------------------------------------------------------------------
  const escapeAttr = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  eleventyConfig.addShortcode("phone", ({ src, alt = "", step, title, caption, ratio, priority } = {}) => {
    const style = ratio ? ` class="phone phone--ratio" style="--phone-ratio: ${escapeAttr(ratio)}"` : ` class="phone"`;
    const loading = priority ? ` loading="eager" fetchpriority="high"` : "";
    // Shown at most ~15rem wide, so the browser picks a small file, not the 960px column default
    const screen = src
      ? `<img class="phone__screen" src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" sizes="(max-width: 768px) 60vw, 15rem"${loading}>`
      : `<div class="phone__screen phone__screen--empty" aria-hidden="true"><span class="label">${title || "Screen"}</span></div>`;
    const text = [
      step && `<span class="label label--accent">${step}</span>`,
      title && `<strong>${title}</strong>`,
      caption,
    ].filter(Boolean).join(" ");
    return `<figure${style}><div class="phone__frame">${screen}</div>${text ? `<figcaption>${text}</figcaption>` : ""}</figure>`;
  });

  // A sideways-scrolling row of phones. Output goes on one line: markdown ends a
  // raw HTML block at the first blank line, which would break the row apart.
  eleventyConfig.addPairedShortcode("phones", (content, label = "Screens") => {
    const phones = content.split("\n").map((line) => line.trim()).filter(Boolean).join("");
    // tabindex: a scrolling region must be reachable by keyboard to be scrolled
    return `<div class="phone-reel" role="region" tabindex="0" aria-label="${escapeAttr(label)}">${phones}</div>`;
  });

  // ------------------------------------------------------------------
  // TABLES: every bare <table> (the ones written in the case studies; a table
  // with a class is part of a layout, like the project details) is wrapped so a
  // wide one scrolls sideways inside its own box on a phone, not the whole page.
  // tabindex + role make the box reachable by keyboard; its label is the
  // table's column headings. Styles: "TABLES" in style.css.
  // ------------------------------------------------------------------
  eleventyConfig.addTransform("scrollable-tables", function (content) {
    const out = this.page && this.page.outputPath;
    if (typeof out !== "string" || !out.endsWith(".html")) return content;
    return content.replace(/<table>([\s\S]*?)<\/table>/g, (table, inner) => {
      const heads = [...inner.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)]
        .map(([, h]) => h.replace(/<[^>]+>/g, "").trim())
        .filter(Boolean);
      const label = heads.length ? `Table: ${heads.join(", ")}` : "Table";
      return `<div class="table-scroll" role="region" tabindex="0" aria-label="${escapeAttr(label)}">${table}</div>`;
    });
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
