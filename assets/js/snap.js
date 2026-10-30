// Sizes each [data-snap] sheet to a whole number of mat
// cells, so a sheet's bottom edge always sits on a grid line however much
// text it holds or however narrow the screen is. Without JS, sheets keep
// the height in cells set in the HTML (--h).
(() => {
  const content = document.querySelector(".mat__content");
  if (!content) return;
  // Reversed, so a block nested inside another is sized before its parent measures it
  const sheets = [...content.querySelectorAll("[data-snap]")].reverse();

  // The bottom of a CV entry's content, measured from its children: scrollHeight
  // can leave out the entry's bottom padding (when it is laid out as a block, on a
  // phone), which then comes up short or missing
  function contentBox(sheet) {
    let top = Infinity, bottom = -Infinity;
    for (const child of sheet.children) {
      const box = child.getBoundingClientRect();
      if (!box.height || getComputedStyle(child).position === "absolute") continue;
      top = Math.min(top, box.top);
      bottom = Math.max(bottom, box.bottom);
    }
    return { top, bottom };
  }

  // Publication collages (.spread-grid): each starts on a grid line, one empty
  // cell (its CSS margin) or a little more after what is above it. In page
  // order: moving one moves every collage below it.
  const spreads = [...content.querySelectorAll(".spread-grid")].filter((spread) => !spread.closest(".prose")); // a case study's own: keepRhythm
  function alignSpreads(cell) {
    const origin = content.getBoundingClientRect().top; // the content's top is a grid line
    for (const spread of spreads) {
      spread.style.marginTop = "";
      const past = (spread.getBoundingClientRect().top - origin) % cell;
      const extra = past < 0.5 || cell - past < 0.5 ? 0 : cell - past;
      if (extra) spread.style.marginTop = `${parseFloat(getComputedStyle(spread).marginTop) + extra}px`;
    }
  }

  // Case studies: running text on the 24px line (--rhythm). Paragraphs and
  // headings keep it by their own sizes (style.css), but a figure, table,
  // reel or embed is as tall as it is, so whatever follows one is moved down
  // to the next line: every block starts a whole number of lines below the
  // top of the text. A collage starts on a mat line instead (whole squares),
  // as it does anywhere else. One pass, top to bottom: moving one block
  // moves every block after it.
  function keepRhythm(cell) {
    const line = parseFloat(getComputedStyle(content).getPropertyValue("--rhythm")) || 24;
    const matTop = content.getBoundingClientRect().top; // a mat line
    for (const prose of content.querySelectorAll(".prose")) {
      const box = prose.querySelector(":scope > .article-body") || prose;
      const blocks = [...box.children].filter((el) => getComputedStyle(el).position !== "absolute");
      for (const el of blocks) el.style.removeProperty("margin-top");
      const top = box.getBoundingClientRect().top + parseFloat(getComputedStyle(box).paddingTop);
      blocks.forEach((el, i) => {
        if (i === 0 || !el.offsetHeight) return;
        const style = getComputedStyle(el);
        // where the block's box is, without the baseline nudge (style.css) moving its text
        const nudge = style.translate === "none" ? 0 : parseFloat(style.translate.split(" ")[1]) || 0;
        const isSpread = el.classList.contains("spread-grid");
        const step = isSpread ? cell : line;
        const past = ((el.getBoundingClientRect().top - nudge - (isSpread ? matTop : top)) % step + step) % step;
        if (past > 0.5 && step - past > 0.5) el.style.marginTop = `${parseFloat(style.marginTop) + step - past}px`;
      });
    }
  }

  // Baselines (style.css, "Baselines on the unit"): CSS moves each block of
  // text by its line's own offset, which is enough when the block's top is
  // on the unit. A block centred in a square, or below something of an odd
  // height, starts part-way into a unit; this tells CSS by how much
  // (--top-off), so its baselines still land on the unit. Read everything
  // first, then write: one layout.
  const TEXT = "h1, h2, h3, h4, p, li, dt, dd, figcaption, blockquote, .label, .caption, .row__date, .entry__date, .tl__name, .tl__year, .facts > div";
  function settleBaselines() {
    const unit = parseFloat(getComputedStyle(content).getPropertyValue("--unit")) || 4;
    const origin = content.getBoundingClientRect().top;
    const moved = [...content.querySelectorAll(TEXT)].filter((el) => getComputedStyle(el).translate !== "none");
    for (const el of moved) el.style.removeProperty("--top-off");
    const offsets = moved.map((el) => {
      const nudge = parseFloat(getComputedStyle(el).translate.split(" ")[1]) || 0;
      return (((el.getBoundingClientRect().top - nudge - origin) % unit) + unit) % unit;
    });
    moved.forEach((el, i) => {
      if (offsets[i] > 0.05 && unit - offsets[i] > 0.05) el.style.setProperty("--top-off", `${offsets[i].toFixed(2)}px`);
    });
  }

  function snap() {
    const cell = parseFloat(getComputedStyle(content).gridAutoRows);
    if (!cell) return;
    sizeSheets(cell);
    keepRhythm(cell);
    // Collages line up once the blocks above them have their final heights;
    // then the blocks holding them are sized again
    if (spreads.length) {
      alignSpreads(cell);
      sizeSheets(cell);
    }
    settleBaselines(); // last: everything is where it will stay
  }

  // Blocks marked [data-cells] (a CV card's details, a row's line, an open
  // row's text, the CV's intro) end on a mat line, so the next thing starts
  // on one. Measured at their own height first, top to bottom.
  // An open row's line isn't rounded: its text follows straight on (rounding
  // both left a band of up to a square between a title and its story), and
  // the text then ends on a mat line, measured from where it starts. Offsets
  // are measured from the card (whose own top is a mat line), so a card
  // still sliding into view doesn't upset them.
  function roundCells(scope, cell) {
    const cells = [...scope.querySelectorAll("[data-cells]")];
    for (const el of cells) el.style.minHeight = "";
    for (const el of cells) {
      const height = el.offsetHeight;   // 0 inside a closed row: left alone
      if (!height) continue;
      if (el.matches("details[open] > summary")) continue;
      const from = (el.closest(".entry") || content).getBoundingClientRect().top;
      const into = ((el.getBoundingClientRect().top - from) % cell + cell) % cell;
      const start = into < 0.5 || cell - into < 0.5 ? 0 : into;
      el.style.minHeight = `${Math.ceil((start + height) / cell - 0.01) * cell - start}px`;
    }
  }

  function sizeSheet(sheet, cell) {
    roundCells(sheet, cell);
    const isEntry = sheet.classList.contains("entry");
    if (isEntry) sheet.style.removeProperty("--slack");
    sheet.style.gridRow = "span 1"; // let it shrink before measuring (the whole
    // shorthand: CSS "span N" lives in grid-row-start, so setting only the end is ignored)
    const pad = getComputedStyle(sheet);
    let height = sheet.scrollHeight;
    if (isEntry) {
      const { bottom } = contentBox(sheet);
      // padding-top is the start of the content, so content bottom + padding-bottom is the whole box.
      // Not scrollHeight: a closed row's hidden contents still count towards it
      if (bottom > -Infinity) height = bottom - sheet.getBoundingClientRect().top + parseFloat(pad.paddingBottom);
    }
    const rows = Math.max(1, Math.ceil(height / cell));
    sheet.style.gridRow = `span ${rows}`;
    // A CV card: what rounding up to whole cells leaves over goes below
    // its content, never above, so its title doesn't move when a row
    // opens or closes (style.css adds --slack to the bottom padding)
    if (isEntry) sheet.style.setProperty("--slack", `${Math.max(0, rows * cell - height)}px`);
  }

  function sizeSheets(cell) {
    for (const sheet of sheets) sizeSheet(sheet, cell);
    // A case study's contents box: a whole number of squares tall (+1px: its bottom border on the next line)
    for (const list of content.querySelectorAll(".toc ol")) {
      list.style.height = "";
      if (list.offsetHeight) list.style.height = `${Math.ceil(list.offsetHeight / cell) * cell + 1}px`;
    }
  }

  // Width changes (rotating a phone, resizing) change line breaks; so do fonts
  // loading. Height is ignored: snapping changes it, and would re-trigger itself.
  let width = 0;
  new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === width) return;
    width = entry.contentRect.width;
    snap();
  }).observe(content);
  document.fonts?.ready.then(snap);
  window.matSnap = snap; // grid.js runs it again before measuring
  // Opening or closing a <details> (a CV row) changes its card's height:
  // at once (cv.js dispatches "toggle" when it opens many), and then
  // every frame while the row animates, re-sizing only that card
  content.addEventListener("toggle", snap, true);
  const growing = new Set();
  const rowsWatch = new ResizeObserver((changed) => {
    for (const { target } of changed) growing.add(target.closest(".entry"));
    requestAnimationFrame(() => {
      const cell = parseFloat(getComputedStyle(content).gridAutoRows);
      if (cell) growing.forEach((sheet) => sheet && sizeSheet(sheet, cell));
      growing.clear();
    });
  });
  content.querySelectorAll(".entry__rows").forEach((rows) => rowsWatch.observe(rows));
  // So does an image arriving without its size known in advance (a remote
  // one, an embed): once per frame, however many load together
  let queued = false;
  content.addEventListener("load", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; snap(); });
  }, true);
})();
