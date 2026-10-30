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
  eleventyConfig.addPassthroughCopy("src/assets/images/**/*.svg"); // vector logos are served as-is
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("CNAME"); // critical: preserves azadi.design custom domain on every deploy

  // Projects collection: reads all .md files in src/projects/, sorted by front matter `order`
  eleventyConfig.addCollection("projects", (api) =>
    api
      .getFilteredByGlob("src/projects/*.md")
      .filter((p) => p.data.published !== false) // exclude drafts
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );

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

  // ------------------------------------------------------------------
  // PHONE SCREENS: a row of mobile screens, each in the phone mockup with
  // its step, title and caption beside it, in a reel (styles: "Reel" and
  // "Phone mockup" in style.css; previous / next buttons: reels.js).
  //
  //   {% phones "Fast Track screens" %}
  //     {% phone { src: "/assets/images/projects/jh/code.png", alt: "…", step: "Step 1", title: "Find the counter", caption: "…" } %}
  //   {% endphones %}
  // ------------------------------------------------------------------
  const escapeAttr = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  eleventyConfig.addShortcode("phone", ({ src, alt = "", step, title, caption } = {}) => {
    const text = [
      step && `<span class="label">${step}</span>`,
      title && `<strong>${title}</strong>`,
      caption,
    ].filter(Boolean).join(" ");
    return `<figure class="reel__item"><span class="phone-frame"><img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" sizes="(max-width: 720px) 30vw, 160px" loading="lazy"></span>${text ? `<figcaption>${text}</figcaption>` : ""}</figure>`;
  });

  // Output goes on one line: markdown ends a raw HTML block at the first
  // blank line, which would break the reel apart.
  eleventyConfig.addPairedShortcode("phones", (content, label = "Screens") => {
    const phones = content.split("\n").map((line) => line.trim()).filter(Boolean);
    // tabindex: a scrolling region must be reachable by keyboard to be scrolled
    return `<div class="sheet frame reel"><div class="reel__track" tabindex="0" role="region" aria-label="${escapeAttr(label)}: ${phones.length} images, scroll sideways">${phones.join("")}</div></div>`;
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

  // ------------------------------------------------------------------
  // CV: every file in src/cv/ is one entry on /resume/ (see src/cv/README.md).
  // The page is built from these files, so editing the CV means editing them.
  // Dates are written once, as YYYY-MM, and everything else comes from them:
  // the "Feb ’22 – Jun ’25" label, the words a screen reader hears, and
  // where the bar sits on the timeline.
  // ------------------------------------------------------------------
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

  // "2022-02" → { y: 2022, m: 2 }. YAML reads a full date (2022-02-01) as a
  // Date, so that works too.
  const ym = (v) => {
    if (v instanceof Date) return { y: v.getUTCFullYear(), m: v.getUTCMonth() + 1 };
    const [y, m = 1] = String(v).split("-").map(Number);
    return { y, m };
  };
  const isPresent = (end) => String(end).toLowerCase() === "present";
  const sameMonth = (a, b) => a.y === b.y && a.m === b.m;

  // Newest first by start date; entries without dates go last; `order`
  // breaks ties (and orders the projects inside a group, which have no dates)
  const byStart = (a, b) => {
    const ka = a.data.start ? ym(a.data.start) : null;
    const kb = b.data.start ? ym(b.data.start) : null;
    if (ka && kb && !sameMonth(ka, kb)) return kb.y * 12 + kb.m - (ka.y * 12 + ka.m);
    if (ka && !kb) return -1;
    if (kb && !ka) return 1;
    return (a.data.order || 0) - (b.data.order || 0);
  };

  eleventyConfig.ignores.add("src/cv/README.md"); // the editing guide, not an entry

  eleventyConfig.addCollection("cv", (api) =>
    api
      .getFilteredByGlob("src/cv/*.md")
      .filter((e) => e.data.published !== false)
      .sort(byStart)
  );

  // Every experience is a CARD: a header, then one or more ROWS (roles, or
  // projects). A file with no `parent` is a card; files whose `parent` is
  // its file name are its rows. A card nobody names as a parent is a card
  // with one row: itself.
  const ymString = ({ y, m }) => `${y}-${String(m).padStart(2, "0")}`;
  const nowYM = () => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() + 1 }; };
  const toMonth = ({ y, m }) => y * 12 + m;
  const lastMonth = (d) => (isPresent(d.end) ? nowYM() : ym(d.end || d.start));
  const rowsOf = (entries, id) => entries.filter((e) => e.data.parent === id);

  // A card's dates: its own, or from the first start to the last end of its rows
  const cardSpan = (card, rows) => {
    if (card.data.start) return { start: card.data.start, end: card.data.end };
    // a card's `roles` (Leja's) count as dated rows too
    const dated = [...rows, ...(card.data.roles || []).map((data) => ({ data }))].filter((r) => r.data.start);
    if (!dated.length) return {};
    const start = ymString(dated.map((r) => ym(r.data.start)).reduce((a, b) => (toMonth(a) <= toMonth(b) ? a : b)));
    if (dated.some((r) => isPresent(r.data.end))) return { start, end: "present" };
    const end = ymString(dated.map((r) => lastMonth(r.data)).reduce((a, b) => (toMonth(a) >= toMonth(b) ? a : b)));
    return { start, end };
  };

  // "1 yr 6 mos", counting both the first and the last month
  const duration = (start, end) => {
    if (!start) return "";
    const n = toMonth(lastMonth({ start, end })) - toMonth(ym(start)) + 1;
    const yrs = Math.floor(n / 12), mos = n % 12;
    return [yrs && `${yrs} yr${yrs > 1 ? "s" : ""}`, mos && `${mos} mo${mos > 1 ? "s" : ""}`].filter(Boolean).join(" ");
  };

  // The cards in one section of the CV (`section: education`; experience
  // when left out), the most recent first: by when they ended, then started
  eleventyConfig.addFilter("cvCards", (entries, section = "experience") =>
    entries
      .filter((e) => !e.data.parent && (e.data.section || "experience") === section)
      .map((card) => ({ card, span: cardSpan(card, rowsOf(entries, card.page.fileSlug)) }))
      .sort((a, b) => {
        const ea = a.span.start ? toMonth(lastMonth(a.span)) : 0;
        const eb = b.span.start ? toMonth(lastMonth(b.span)) : 0;
        if (ea !== eb) return eb - ea;
        return byStart(a.card, b.card);
      })
      .map(({ card }) => card)
  );

  // Everything the card template needs, worked out once:
  //   title     its own, else its newest `roles` entry, else its newest row's `role`
  //   start/end its own, or the span of its roles and rows
  //   duration  "3 yrs 5 mo" (not for a roll-up: its projects aren't one stretch)
  //   rows      what was made, newest first (then by `order`); a roll-up
  //             keeps a client's projects together. A row without dates
  //             shows the card's (not in a roll-up). A card with no row files is its own one row.
  // Each row is one line when folded: a thumbnail (`thumb:`, or its first
  // image), what was made (`title`), and its years.
  // A thumbnail is one image; phone work shows its first three screens
  // side by side (one phone is too small to read in one square)
  const thumbOf = (d) => {
    if (d.thumb) return { src: d.thumb, phone: !!d.thumbPhone, phones: d.thumbPhone ? [d.thumb] : null };
    const images = d.images || [];
    const first = images[0];
    if (!first) return null;
    const phones = first.phone ? images.filter((i) => i.phone).slice(0, 3).map((i) => i.src) : null;
    return { src: first.src, phone: !!first.phone, phones };
  };
  const nameOf = (d) => d.short || d.org || d.title;

  eleventyConfig.addFilter("cvCard", (card, entries) => {
    const d = card.data;
    const id = card.page.fileSlug;
    let rows = rowsOf(entries, id); // already newest first (the collection's order)
    const { start, end } = cardSpan(card, rows);
    if (d.rollup) {
      const firstSeen = new Map();
      rows.forEach((r, i) => { const k = nameOf(r.data); if (!firstSeen.has(k)) firstSeen.set(k, i); });
      rows = [...rows].sort((a, b) => firstSeen.get(nameOf(a.data)) - firstSeen.get(nameOf(b.data)) || rows.indexOf(a) - rows.indexOf(b));
    }
    // rows without dates show the card's, except in a roll-up, whose span isn't any one project's
    const span = start && !d.rollup ? { start, end } : null;
    const lines = rows.length
      ? rows.map((r) => ({
          entry: r,
          id: r.page.fileSlug,
          dates: r.data.start ? { start: r.data.start, end: r.data.end } : span,
          thumb: thumbOf(r.data),
        }))
      : [{ entry: card, id: `${id}-work`, self: true, dates: span, thumb: thumbOf(d) }];
    return {
      id,
      title: d.title || (d.roles && d.roles[0] && d.roles[0].title) || (rows[0] && (rows[0].data.role || rows[0].data.title)) || "",
      start,
      end,
      duration: d.rollup ? "" : duration(start, end),
      rollup: !!d.rollup,
      rows: lines,
    };
  });

  // The parts that are there, joined: ["Editorial Designer", "", "Volunteer"] → "Editorial Designer · Volunteer"
  eleventyConfig.addFilter("cvJoin", (parts, sep = " · ") => parts.filter(Boolean).join(sep));

  // Years only, for rows and the details: "2024", "2021–22", "2022–25", "2025 – present"
  // (an open "2025–" reads as a typo, and wraps after its dash)
  eleventyConfig.addFilter("cvYears", (start, end) => {
    if (!start) return "";
    const a = ym(start).y;
    if (isPresent(end)) return `${a} – present`;
    const b = end ? ym(end).y : a;
    if (a === b) return String(a);
    return `${a}–${String(b).slice(String(a).slice(0, 2) === String(b).slice(0, 2) ? 2 : 0)}`;
  });

  // The latest year alone, for a folded row: "2022–25" → "2025", "2025 – present" → "Present"
  eleventyConfig.addFilter("cvLatest", (start, end) => {
    if (!start) return "";
    if (isPresent(end)) return "Present";
    return String(end ? ym(end).y : ym(start).y);
  });

  // "Feb ’22 – Jun ’25", "Feb – Oct ’22", "Jun ’24", "Aug ’25 – Present"
  eleventyConfig.addFilter("cvDates", (start, end) => {
    if (!start) return "";
    const a = ym(start);
    const short = ({ y, m }) => `${MONTHS[m - 1].slice(0, 3)} ’${String(y).slice(2)}`;
    if (isPresent(end)) return `${short(a)} – Present`;
    const b = end ? ym(end) : a;
    if (sameMonth(a, b)) return short(a);
    if (a.y === b.y) return `${MONTHS[a.m - 1].slice(0, 3)} – ${short(b)}`;
    return `${short(a)} – ${short(b)}`;
  });

  // The same, in words, for screen readers: "February 2022 to June 2025"
  const spokenDates = (start, end) => {
    const a = ym(start);
    const long = ({ y, m }) => `${MONTHS[m - 1]} ${y}`;
    if (isPresent(end)) return `${long(a)} to now`;
    const b = end ? ym(end) : a;
    if (sameMonth(a, b)) return long(a);
    if (a.y === b.y) return `${MONTHS[a.m - 1]} to ${long(b)}`;
    return `${long(a)} to ${long(b)}`;
  };

  // The timeline: one lane per entry in `lanes` (the resume page's front
  // matter). Cards and rows alike join it with a `timeline:` line; a card
  // without dates spans its rows. Bar positions are months from January of
  // the first year (--s, --e), as style.css expects.
  // Bars are stacked in a lane automatically: each goes on the highest row
  // where neither it nor its label would touch the bar before it
  // (`timeline: { row: 2 }` overrides). A bar is MAJOR (heavier) unless it
  // is a project inside a roll-up (the freelance work).
  eleventyConfig.addFilter("cvTimeline", (entries, lanes, firstYear) => {
    const month = ({ y, m }) => (y - firstYear) * 12 + m;
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const today = month({ y: now.getFullYear(), m: now.getMonth() + 1 }) + (now.getDate() - 1) / daysInMonth;
    const round = (n) => Math.round(n * 10) / 10;
    const bySlug = new Map(entries.map((e) => [e.page.fileSlug, e]));
    // a label's width in months, roughly: one small capital is ~0.85 of a month's width on a wide
    // screen and up to ~1.3 on a tablet, so a bar on the next row is never under a label
    const labelMonths = (label) => label.length * 1.3 + 1.5;

    const years = [];
    for (let yr = firstYear; yr <= now.getFullYear(); yr++) years.push(yr);
    const totalMonths = years.length * 12;
    const dates = eleventyConfig.getFilter("cvDates");
    const yearsOf = eleventyConfig.getFilter("cvYears");

    // What the preview panel under the chart shows for an entry (a card, or
    // a project in the freelance roll-up): the same facts as its card, short
    const preview = (e, start, end) => {
      const d = e.data;
      const rows = rowsOf(entries, e.page.fileSlug);
      const ongoing = isPresent(end);
      const thumbs = [...new Set([...rows.map((r) => r.data), d].map(thumbOf).filter(Boolean).map((t) => t.src))].slice(0, 3);
      const link = d.link || (rows.find((r) => r.data.link) || { data: {} }).data.link;
      return {
        start, end, ongoing,
        title: d.title || (d.roles && d.roles[0] && d.roles[0].title) || (rows[0] && (rows[0].data.role || rows[0].data.title)) || "",
        org: d.org || "",
        about: d.about || "",
        tags: d.tags || [],
        thumbs,
        caseStudy: link || "",
        dates: dates(start, end),
        years: yearsOf(start, end),
        duration: d.rollup || !end ? "" : duration(start, end),
        spoken: spokenDates(start, end),
      };
    };

    // Two lines per lane band on a phone: its name above the bars (--yp, --rp)
    let y = 2; // row 1 is the years
    let yPhone = 2;
    const out = lanes.map((lane) => {
      const items = entries
        .filter((e) => e.data.timeline && e.data.timeline.lane === lane.key)
        .map((e) => ({ e, ...cardSpan(e, rowsOf(entries, e.page.fileSlug)) }))
        .filter((i) => i.start)
        .map(({ e, start, end }) => {
          const ongoing = isPresent(end);
          const parent = e.data.parent && bySlug.get(e.data.parent);
          const s = month(ym(start));
          return {
            id: e.page.fileSlug,
            label: nameOf(e.data),
            s,
            e: ongoing ? round(today) : month(end ? ym(end) : ym(start)) + 1,
            fixedRow: e.data.timeline.row,
            major: !(parent && parent.data.rollup),
            parent: e.data.parent,
            late: totalMonths - s < 24, // its label won't fit to the right of its start on a phone
            kind: e.data.type === "Volunteer" ? "Volunteer project" : parent && parent.data.rollup ? "Freelance project" : e.data.type || "Role",
            ...preview(e, start, end),
          };
        })
        .sort((a, b) => a.s - b.s || b.e - a.e);

      // A roll-up's projects are short and scattered; labelled one by one they
      // collide. Two or more in a lane become ONE bar ("Freelance ×11") with a
      // tick at each project's own dates, so gaps stay gaps. The projects are
      // listed in the preview panel.
      let shown = items;
      const small = items.filter((i) => !i.major);
      if (small.length > 1) {
        const parentCard = bySlug.get(small[0].parent);
        const first = small.reduce((a, b) => (a.s <= b.s ? a : b));
        const lastOne = small.reduce((a, b) => (a.e >= b.e ? a : b));
        const last = { ...lastOne, end: lastOne.end || lastOne.start }; // a one-month project has no end
        const group = {
          id: `group-${lane.key}`,
          group: true,
          label: `Freelance ×${small.length}`,
          s: first.s,
          e: last.e,
          major: false,
          late: false,
          open: small[0].parent,
          kind: (parentCard && parentCard.data.type) || "Freelance",
          title: `${small.length} projects`,
          org: "",
          about: (parentCard && parentCard.data.about) || "",
          tags: [],
          thumbs: [],
          caseStudy: "",
          start: first.start,
          end: last.end,
          dates: yearsOf(first.start, last.end),
          years: yearsOf(first.start, last.end),
          duration: "",
          spoken: spokenDates(first.start, last.end),
          members: small.map((m) => ({ ...m, back: `group-${lane.key}` })),
        };
        shown = [...items.filter((i) => i.major), group].sort((a, b) => a.s - b.s || b.e - a.e);
      }

      const ends = []; // per row: where its last bar or label ends
      for (const item of shown) {
        const reach = Math.max(item.e, item.s + labelMonths(item.label));
        let row = item.fixedRow && !item.group ? item.fixedRow - 1 : ends.findIndex((at) => at <= item.s);
        if (row < 0) row = ends.length;
        ends[row] = Math.max(ends[row] || 0, reach);
        item.row = row + 1;
      }
      const rows = Math.max(1, ends.length);
      const result = { key: lane.key, name: lane.name, y, rows, yp: yPhone, rp: rows + 1, items: shown };
      y += rows;
      yPhone += rows + 1;
      return result;
    });

    // The panel starts on the job you're in now
    const current = out.flatMap((l) => l.items).find((i) => i.ongoing);
    return { years, today: round(today), lanes: out, current: current ? current.id : "" };
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
