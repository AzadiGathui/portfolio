// Craft experiment: image reels (CV). Images are cut off at the frame's
// edge to show there's more; with a mouse, a reel can also be grabbed and
// dragged sideways (touch and trackpads already scroll it). On every
// screen, previous / next buttons in the reel's bottom right corner step
// one image at a time (they are the scroll bar: there is no other), and on
// a phone each image snaps into place. Added here, so without JS a reel
// still scrolls by touch.
(() => {
  const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const arrow = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;

  for (const track of document.querySelectorAll(".reel__track")) {
    const items = [...track.children];
    const label = track.getAttribute("aria-label")?.split(":")[0] || "images";
    const [prev, next] = [["Previous", "M15 6l-6 6 6 6"], ["Next", "M9 6l6 6-6 6"]].map(([word, d]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `reel__btn reel__btn--${word.toLowerCase()}`;
      b.setAttribute("aria-label", `${word} image: ${label}`);
      b.innerHTML = arrow(d);
      track.after(b);
      return b;
    });

    // The next image whose left edge is past the snap line (the padding),
    // or the last one before it: one image per press
    function go(direction) {
      const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const lefts = items.map((el) => el.offsetLeft - pad);   // the track is their offsetParent
      const now = track.scrollLeft;
      const to = direction > 0 ? lefts.find((x) => x > now + 2) : [...lefts].reverse().find((x) => x < now - 2);
      track.scrollTo({ left: to ?? (direction > 0 ? track.scrollWidth : 0), behavior: smooth ? "smooth" : "auto" });
    }
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      track.classList.toggle("is-grabbable", max > 1);
      prev.hidden = next.hidden = max <= 1;   // everything fits: nothing to step through
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= max - 1;
    };
    track.addEventListener("scroll", update, { passive: true });
    new ResizeObserver(update).observe(track);
    // images arriving change the scroll width
    track.querySelectorAll("img").forEach((img) => img.addEventListener("load", update));
    update();

    // Grab-to-scroll, mouse only
    let start = null;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button > 0 || !track.classList.contains("is-grabbable")) return;
      start = { x: e.clientX, left: track.scrollLeft, moved: false };
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      if (Math.abs(dx) > 4) {
        start.moved = true;
        track.classList.add("is-grabbing");
      }
      track.scrollLeft = start.left - dx;
    });
    const end = () => {
      if (!start) return;
      const moved = start.moved;
      start = null;
      track.classList.remove("is-grabbing");
      if (!moved) return;
      // a drag across a linked image shouldn't open it: swallow the click
      // that follows pointerup (it arrives before this timeout)
      const block = (e) => e.preventDefault();
      track.addEventListener("click", block, { capture: true });
      setTimeout(() => track.removeEventListener("click", block, { capture: true }));
    };
    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
  }
})();
