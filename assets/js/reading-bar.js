// Case studies on a phone: the reading bar
// (partials/reading-bar.njk). The pill shows the section being read
// and opens the contents as a sheet; the up arrow is beside it. Both appear
// once the reader is into the story and hide at its end, so they never
// cover the links there. They sit on the mat's own columns, the same
// squares as the keys at the top: fit() measures those keys and hands the
// bar their left edge, the number of columns and the square.
// Styles: "Reading bar" in style.css.
(() => {
  const pill = document.querySelector(".toc-pill");
  const toTop = document.querySelector(".to-top");
  const story = document.querySelector(".study");
  const end = document.querySelector(".pager") || document.querySelector(".foot");
  if (!toTop || !story) return;

  const sheet = document.getElementById("toc-sheet");
  const sheetLinks = sheet ? [...sheet.querySelectorAll('a[href^="#"]')] : [];
  const headings = sheetLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const section = pill?.querySelector(".toc-pill__section");
  const count = pill?.querySelector(".toc-pill__count");
  const keys = document.querySelector(".keys");
  const content = document.querySelector(".mat__content");
  const bar = document.querySelector(".reading-bar");

  function fit() {
    if (!keys || !content || !bar) return;
    const cell = parseFloat(getComputedStyle(content).gridAutoRows);   // the same square snap.js uses
    const box = keys.getBoundingClientRect();
    if (!cell || !box.width) return;
    bar.style.setProperty("--rb-left", `${box.left}px`);
    bar.style.setProperty("--rb-cell", `${cell}px`);
    bar.style.setProperty("--rb-cols", String(Math.round(box.width / cell)));
  }

  function update() {
    // the section whose heading has passed the top quarter of the screen
    const line = innerHeight * 0.25;
    let index = -1;
    headings.forEach((h, i) => { if (h.getBoundingClientRect().top <= line) index = i; });
    sheetLinks.forEach((a, i) => {
      if (i === index) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });

    const inStory = story.getBoundingClientRect().top < innerHeight * 0.6;
    const atEnd = end && end.getBoundingClientRect().top < innerHeight;
    toTop.classList.toggle("is-visible", inStory && !atEnd);
    if (!pill) return;
    section.textContent = index >= 0 ? sheetLinks[index].textContent : "Contents";
    count.textContent = index >= 0 ? `${index + 1}/${headings.length}` : "";
    pill.classList.toggle("is-visible", inStory && !atEnd);
  }

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", () => { fit(); update(); }, { passive: true });
  document.fonts?.ready.then(fit);
  fit();
  update();

  // The contents sheet: a modal <dialog>, so focus stays inside it and Esc
  // (or the Android back gesture) closes it
  if (!pill || !sheet) return;
  pill.addEventListener("click", () => sheet.showModal());
  sheet.querySelector(".toc-sheet__close").addEventListener("click", () => sheet.close());
  // picking a section closes the sheet; the link then scrolls as normal
  sheetLinks.forEach((a) => a.addEventListener("click", () => sheet.close()));
  // a tap on the dimmed backdrop, outside the sheet, closes it too
  sheet.addEventListener("click", (e) => {
    if (e.target !== sheet) return;
    const r = sheet.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom || e.clientX < r.left || e.clientX > r.right) sheet.close();
  });
})();
