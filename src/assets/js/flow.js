// The homepage process strip (.flow in index.njk), run as a pipeline: the
// rail along the top fills step by step, and each step, as it is reached,
// goes white and draws its icon; the steps behind it stay grey, those
// ahead wait. Hovering, focusing or tapping a step holds it (and shows
// the project that proves it); letting go resumes. The loop pauses while
// the strip is off screen or the tab is hidden. Styles: "Process" in
// style.css. With reduced motion none of this runs and the strip stays
// as printed, every icon drawn.
(() => {
  const flow = document.querySelector(".flow");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  if (!flow || still.matches) return;

  const steps = [...flow.querySelectorAll(":scope > li")];
  const DRAW = 1100, HOLD = 1500, REST = 2600;
  let timer = 0;
  let current = 0;       // the step being shown, so the loop resumes where it paused
  let manual = false;    // a reader is holding a step
  let visible = false;

  flow.classList.add("is-live");
  // icons draw on: every stroke is a path of length 1, offset until its step is reached
  steps.forEach((li) => li.querySelectorAll("svg :is(path, circle, rect, ellipse)").forEach((el, i) => {
    el.setAttribute("pathLength", "1");
    el.style.setProperty("--i", i);
  }));

  // steps before i are done, i is shown (or drawn), the rest wait
  function show(i, active) {
    steps.forEach((li, n) => {
      li.classList.toggle("is-done", n < i || (n === i && !active));
      li.classList.toggle("is-active", n === i && active);
    });
  }

  function scrollTo(i) {   // on a phone the strip slides to the step
    if (flow.scrollWidth <= flow.clientWidth) return;
    const li = steps[i];
    flow.scrollTo({ left: li.offsetLeft - (flow.clientWidth - li.offsetWidth) / 2, behavior: "smooth" });
  }

  function go(i) {
    clearTimeout(timer);
    current = i;
    if (manual || !visible || document.hidden) return;
    if (i >= steps.length) {
      timer = setTimeout(() => { show(-1, false); current = 0; timer = setTimeout(() => go(0), 900); }, REST);
      return;
    }
    show(i, true);
    if (!matchMedia("(hover: hover)").matches) scrollTo(i);
    timer = setTimeout(() => go(i + 1), DRAW + HOLD);
  }

  // a held step: the strip goes back to just before it, and it draws again
  function hold(i) {
    manual = true;
    clearTimeout(timer);
    steps.forEach((li, n) => li.classList.toggle("is-held", n === i));
    show(i - 1, false);
    requestAnimationFrame(() => requestAnimationFrame(() => show(i, true)));
  }
  function release() {
    if (!manual) return;
    manual = false;
    steps.forEach((li) => li.classList.remove("is-held"));
    show(-1, false);
    timer = setTimeout(() => go(0), 600);
  }

  steps.forEach((li, i) => {
    li.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hold(i); });
    li.addEventListener("click", () => hold(i));
  });
  flow.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") release(); });
  flow.addEventListener("focusin", (e) => { const li = e.target.closest("li"); if (li) hold(steps.indexOf(li)); });
  flow.addEventListener("focusout", (e) => { if (!flow.contains(e.relatedTarget)) release(); });
  // a tap elsewhere lets a held step go
  document.addEventListener("click", (e) => { if (manual && !flow.contains(e.target)) release(); });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) timer = setTimeout(() => go(current), 400);
    else clearTimeout(timer);
  }, { threshold: 0.5 }).observe(flow);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible && !manual) go(current); else clearTimeout(timer); });

  // the setting changed while the page was open: back to the strip as printed
  still.addEventListener("change", () => {
    if (!still.matches) return;
    clearTimeout(timer);
    manual = true;
    flow.classList.remove("is-live");
    steps.forEach((li) => li.classList.remove("is-done", "is-active", "is-held"));
  });

  show(-1, false);
})();
