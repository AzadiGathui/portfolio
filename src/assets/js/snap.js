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
  const spreads = [...content.querySelectorAll(".spread-grid")];
  function alignSpreads(cell) {
    const origin = content.getBoundingClientRect().top; // the content's top is a grid line
    for (const spread of spreads) {
      spread.style.marginTop = "";
      const past = (spread.getBoundingClientRect().top - origin) % cell;
      const extra = past < 0.5 || cell - past < 0.5 ? 0 : cell - past;
      if (extra) spread.style.marginTop = `${parseFloat(getComputedStyle(spread).marginTop) + extra}px`;
    }
  }

  function snap() {
    const cell = parseFloat(getComputedStyle(content).gridAutoRows);
    if (!cell) return;
    sizeSheets(cell);
    // Collages line up once the blocks above them have their final heights;
    // then the blocks holding them are sized again
    if (spreads.length) {
      alignSpreads(cell);
      sizeSheets(cell);
    }
  }

  function sizeSheets(cell) {
    for (const sheet of sheets) {
      const isEntry = sheet.classList.contains("entry");
      // A CV entry's last image reel takes up what rounding the entry up to
      // whole cells leaves over, so the padding stays the same all round
      const reel = isEntry ? [...sheet.querySelectorAll(".reel")].pop() : null;
      reel?.style.removeProperty("--reel-extra");
      if (isEntry) sheet.style.removeProperty("--slack");
      sheet.style.gridRow = "span 1"; // let it shrink before measuring (the whole
      // shorthand: CSS "span N" lives in grid-row-start, so setting only the end is ignored)
      const pad = getComputedStyle(sheet);
      let height = sheet.scrollHeight;
      if (isEntry) {
        const { bottom } = contentBox(sheet);
        // padding-top is the start of the content, so content bottom + padding-bottom is the whole box
        if (bottom > -Infinity) height = Math.max(height, bottom - sheet.getBoundingClientRect().top + parseFloat(pad.paddingBottom));
      }
      const rows = Math.max(1, Math.ceil(height / cell));
      sheet.style.gridRow = `span ${rows}`;
      // No image to take the slack (a folded entry on a phone): split it between the
      // top and bottom padding, so the two stay equal
      if (isEntry && !reel?.offsetParent) sheet.style.setProperty("--slack", `${Math.max(0, (rows * cell - height) / 2)}px`);
      if (reel?.offsetParent) {
        // measured to the bottom of the body (the right-hand column; below the title on a
        // phone): the reel grows until the body fills the box, whichever column is taller
        const bottom = sheet.querySelector(":scope > .entry__body").getBoundingClientRect().bottom;
        const top = sheet.getBoundingClientRect().top + parseFloat(pad.paddingTop);
        const extra = sheet.clientHeight - parseFloat(pad.paddingTop) - parseFloat(pad.paddingBottom) - (bottom - top);
        if (extra > 0.5) reel.style.setProperty("--reel-extra", `${extra}px`);
      }
    }
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
  // Opening or closing a <details> ("More about this role") changes its height
  content.addEventListener("toggle", snap, true);
  // So does an image arriving without its size known in advance (a remote
  // one, an embed): once per frame, however many load together
  let queued = false;
  content.addEventListener("load", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; snap(); });
  }, true);
})();
