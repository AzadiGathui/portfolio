// The grid check. Loaded only when the address has ?grid (layouts/base.njk);
// scripts/check-grid.mjs runs the same check on every page at three widths.
//
// Draws the 4px unit and the 24px line over the mat (style.css, "Grid
// overlay"), then measures the page and outlines, in magenta, anything off
// the grid:
//   - a block (a direct child of the content, or of an area) whose top is
//     not on a mat line
//   - a block of text whose first baseline is not on the 4px unit
// Objects lying on the mat at an angle (the process strip, notes, tools,
// polaroids), the keys and the reading bar are left out: they sit on the
// mat, not in its grid.
//
// window.gridAudit() returns { cell, unit, checked, problems } and logs the
// problems as a table.
(() => {
  const html = document.documentElement;
  html.classList.add("show-grid");

  const TOLERANCE = 0.6; // px: browsers round line positions to device pixels
  const TEXT = "h1, h2, h3, h4, p, :is(.prose, .entry__text, .entry__roles, .team, .toc) li, dt, dd, figcaption, blockquote, .label, .caption, .row__date, .entry__date, .tl__name, .tl__year";
  const LEFT_OUT = ".toc, .flow, .note, .tool, .frame--polaroid, .key, .toc-pill, .to-top, .reading-bar, .mat__keys, .mat__tools, .tl__track, button, .visually-hidden, [aria-hidden='true']";

  // Half the font's ascent less its descent, as in style.css (--k)
  const offsetOf = (style) => /JetBrains/.test(style.fontFamily) ? 0.36 : /Caveat/.test(style.fontFamily) ? 0.33 : 0.4;
  const off = (value, step) => {
    const past = ((value % step) + step) % step;
    return Math.min(past, step - past);
  };
  const describe = (el) => {
    const classes = [...el.classList].filter((c) => !c.startsWith("grid-")).slice(0, 2).join(".");
    const words = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
    return `${el.tagName.toLowerCase()}${classes ? "." + classes : ""} "${words}"`;
  };
  const shown = (el) => el.offsetParent !== null && el.getBoundingClientRect().height > 0 && !el.closest(LEFT_OUT);

  function audit() {
    html.classList.add("grid-audit"); // no motion while measuring
    window.matSnap?.();
    for (const el of document.querySelectorAll(".grid-off")) el.classList.remove("grid-off");

    const content = document.querySelector(".mat__content");
    if (!content) return { problems: [] };
    const cell = parseFloat(getComputedStyle(content).gridAutoRows);
    const unit = parseFloat(getComputedStyle(content).getPropertyValue("--unit")) || 4;
    const origin = content.getBoundingClientRect().top; // a mat line
    const problems = [];
    let checked = 0;

    // Blocks start on a mat line
    for (const el of content.querySelectorAll(":scope > *, :scope > .area > *")) {
      const style = getComputedStyle(el);
      if (!shown(el) || el.matches(TEXT) || style.position === "absolute" || style.position === "sticky" || style.display === "contents") continue;   // text is checked by its baseline, below
      checked++;
      const by = off(el.getBoundingClientRect().top - origin, cell);
      if (by > TOLERANCE) problems.push({ kind: "block", by: +by.toFixed(1), what: describe(el), el });
    }

    // Text: each block of text's first baseline on the unit. Only blocks
    // that hold their own lines (not a list item that holds paragraphs);
    // inline elements share their block's lines.
    for (const el of content.querySelectorAll(TEXT)) {
      const style = getComputedStyle(el);
      if (!shown(el) || style.display.startsWith("inline") || style.position === "sticky") continue;
      if ([...el.querySelectorAll(TEXT)].some((inner) => !getComputedStyle(inner).display.startsWith("inline"))) continue;   // a holder of other blocks: they are checked
      checked++;
      const lineHeight = parseFloat(style.lineHeight);
      const baseline = el.getBoundingClientRect().top + parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth) + lineHeight / 2 + offsetOf(style) * parseFloat(style.fontSize);
      const by = off(baseline - origin, unit);
      if (by > TOLERANCE) problems.push({ kind: "baseline", by: +by.toFixed(1), what: describe(el), el });
      if (lineHeight % unit > 0.01) problems.push({ kind: "line height", by: +(lineHeight % unit).toFixed(1), what: describe(el), el });
    }

    for (const { el } of problems) el.classList.add("grid-off");
    html.classList.remove("grid-audit");
    const report = problems.map(({ kind, by, what }) => ({ kind, by, what }));
    if (report.length) console.table(report);
    else console.info(`Grid check: ${checked} blocks and lines, all on the grid (square ${cell}px, unit ${unit}px).`);
    return { cell, unit, checked, problems: report };
  }

  window.gridAudit = audit;
  const run = () => requestAnimationFrame(() => requestAnimationFrame(audit));
  (document.fonts?.ready || Promise.resolve()).then(run);
  let timer;
  addEventListener("resize", () => { clearTimeout(timer); timer = setTimeout(run, 300); });
})();
