// Things that arrive as they are scrolled to, once, and then stay (case
// studies; styles: "Scroll reveals" in style.css):
//   .annot__region   its handwritten note appears beside the screen (Home)
//   [data-reveal]    fades up into place (collage pieces, the dashed lines)
//   .pj-row[data-count]   the figures count up to their values (Results)
//
// One IntersectionObserver per kind. When something has been shown it is
// unobserved, which is what makes it stay: scrolling back up never hides it
// again. The line is 20% above the bottom of the screen, so a piece appears
// when it is comfortably in view, not as its first pixel peeks in.
//
// A piece that was scrolled past without ever being seen (the page opened
// halfway down, or an address with #home) would never "intersect", so its
// note would stay hidden for good. The first report therefore shows
// everything that is already above the screen, and so does a check after
// each scroll comes to rest (a jump to #home skips what is in between).
//
// The CSS hides these pieces only with scripts running and motion allowed
// (html.js, no "reduce motion", not in print), so without this file, or with
// it switched off, everything is simply there.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const pending = new Set();   // everything not yet shown, for the scroll-rest check

  // Show each of `els` once it comes into view
  function watch(els, show) {
    if (!els.length) return;
    let first = true;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const above = entry.boundingClientRect.bottom <= 0;
        if (entry.isIntersecting || (first && above)) entry.target._reveal();
      }
      first = false;
    }, { rootMargin: "0px 0px -20% 0px" });
    for (const el of els) {
      el._reveal = () => {   // shown once; unobserving is what keeps it shown
        pending.delete(el);
        io.unobserve(el);
        show(el);
      };
      pending.add(el);
      io.observe(el);
    }
  }

  const mark = (cls) => (el) => el.classList.add(cls);

  watch([...document.querySelectorAll(".annot__region")], mark("is-shown"));
  watch([...document.querySelectorAll("[data-reveal]")], mark("is-shown"));
  watch([...document.querySelectorAll(".pj-row[data-count]")], (row) => {
    row.classList.add("is-shown");
    row.querySelectorAll(".stat-card__value").forEach(countUp);
  });

  // After a scroll comes to rest: whatever is now above the screen and still
  // unseen is shown (it was jumped over)
  let timer;
  addEventListener("scroll", () => {
    if (!pending.size) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      for (const el of [...pending]) {
        if (el.getBoundingClientRect().bottom <= 0) el._reveal();
      }
    }, 150);
  }, { passive: true });

  // A figure's numbers run up from 0 to what is printed. The printed text
  // (with every number in it, so the unit and arrows stay put) is kept for
  // screen readers and put back at the end; digits are tabular, so the width
  // hardly changes while they run.
  const NUMBER = /\d[\d,]*(?:\.\d+)?/g;
  function countUp(el) {
    const final = el.textContent;
    if (!/\d/.test(final)) return;
    const spoken = Object.assign(document.createElement("span"), { className: "visually-hidden", textContent: final });
    const moving = document.createElement("span");
    moving.setAttribute("aria-hidden", "true");
    el.textContent = "";
    el.append(spoken, moving);

    const start = performance.now();
    const DURATION = 1100;
    const frame = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - (1 - t) ** 3;   // fast, then settling, like --ease-out
      moving.textContent = final.replace(NUMBER, (printed) => {
        const places = (printed.split(".")[1] || "").length;
        return (parseFloat(printed.replace(/,/g, "")) * eased).toLocaleString("en-US", { minimumFractionDigits: places, maximumFractionDigits: places });
      });
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = final;
    };
    frame(start);
    requestAnimationFrame(frame);
  }
})();
