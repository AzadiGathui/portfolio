// The homepage process strip (.flow in index.njk), played once as a pipeline,
// with the headline in step. A line (.flow__trace, an <svg> built over the
// strip in pixels) crosses the square to a step, then runs round that step's
// outline in both directions at once, from where it came in to where it
// leaves, and goes on into the next square. The step it has reached lights
// and draws its icon, and so does its clause in the headline (.hl, one per
// step); the steps behind stay a little grey, those ahead wait. When the
// last has been shown the line fades, leaving the printed hairlines: every
// step drawn, the headline all in the text colour, nothing lit, and it does
// not play again. It starts when the strip is on screen. Styles: "Process"
// in style.css. With reduced motion none of this runs (and the page never
// greys the headline either: index.njk).
//
// Where the line goes is read from the layout, not assumed: in a row (wide
// screens) it enters and leaves each step at the height of the icon's
// centre, through the middle of the square between the steps; stood up (a
// phone) it enters at the top and leaves at the bottom, on the icon's centre
// line. So it follows the CSS if the strip's proportions change.
(() => {
  const flow = document.querySelector(".flow");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  if (!flow || still.matches) return;

  const SVG = "http://www.w3.org/2000/svg";
  const root = document.documentElement;
  const steps = [...flow.querySelectorAll(":scope > li:not(.flow__link)")];
  const words = [...document.querySelectorAll("h1 .hl")];   // words[i] is the headline's clause for steps[i]
  const DRAW = 800, HOLD = 600, CROSS = 450;   // a step: its outline and icon drawing, then shown; the line crossing a square
  let ended = false;
  let trace = null;
  let outlines = [];     // outlines[i]: the two paths round steps[i]
  let crossings = [];    // crossings[i]: the path from steps[i] to steps[i + 1]
  const drawn = new Set();   // paths already drawn, so a resize can build the line again as it was

  flow.classList.add("is-live");
  // icons draw on: every stroke is a path of length 1, offset until its step is reached
  steps.forEach((li) => li.querySelectorAll("svg :is(path, circle, rect, ellipse)").forEach((el, i) => {
    el.setAttribute("pathLength", "1");
    el.style.setProperty("--i", i);
  }));

  // steps before i are done, i is shown; so are its clause
  function show(i) {
    [steps, words].forEach((list) => list.forEach((el, k) => {
      el.classList.toggle("is-done", k < i);
      el.classList.toggle("is-active", k === i);
    }));
  }

  // The line, in the strip's own pixels (the strip is its container)
  function build() {
    trace?.remove();
    const box = flow.getBoundingClientRect();
    trace = document.createElementNS(SVG, "svg");
    trace.setAttribute("class", "flow__trace");
    trace.setAttribute("aria-hidden", "true");
    trace.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    flow.append(trace);
    const half = parseFloat(getComputedStyle(trace).strokeWidth) / 2 || 0.75;   // so the line sits on the outline, not across its edge

    const rel = (el) => {
      const r = el.getBoundingClientRect();
      return { l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top };
    };
    const tall = steps[1].getBoundingClientRect().top > steps[0].getBoundingClientRect().bottom - 1;   // stood up, not in a row

    const path = (key, d, ms) => {
      const p = document.createElementNS(SVG, "path");
      p.setAttribute("d", d);
      p.setAttribute("pathLength", "1");
      p.style.setProperty("--d", `${ms}ms`);
      p.dataset.key = key;
      if (drawn.has(key)) { p.style.transition = "none"; p.classList.add("is-drawn"); }
      trace.append(p);
      return p;
    };

    const ends = [];   // where the line comes into each step, and where it leaves
    outlines = steps.map((li, i) => {
      const s = rel(li), c = rel(li.querySelector(".flow__icon"));
      const l = s.l + half, r = s.r - half, t = s.t + half, b = s.b - half;
      if (!tall) {
        const y = (s.t + s.b) / 2;   // halfway down the panel, level with the hairline across the square between
        ends.push({ from: [l, y], to: [r, y] });
        return [path(`o${i}a`, `M${l} ${y}V${t}H${r}V${y}`, DRAW), path(`o${i}b`, `M${l} ${y}V${b}H${r}V${y}`, DRAW)];
      }
      const x = (c.l + c.r) / 2;
      ends.push({ from: [x, t], to: [x, b] });
      return [path(`o${i}a`, `M${x} ${t}H${l}V${b}H${x}`, DRAW), path(`o${i}b`, `M${x} ${t}H${r}V${b}H${x}`, DRAW)];
    });
    crossings = ends.slice(0, -1).map((e, i) => path(`c${i}`, `M${e.to[0]} ${e.to[1]}L${ends[i + 1].from[0]} ${ends[i + 1].from[1]}`, CROSS));
  }

  const draw = (...paths) => requestAnimationFrame(() => paths.flat().forEach((p) => {
    drawn.add(p.dataset.key);
    p.classList.add("is-drawn");
  }));

  // played: the line fades and the strip is as printed, the headline in the text colour
  function end() {
    if (ended) return;
    ended = true;
    resize.disconnect();
    trace?.classList.add("is-done");
    setTimeout(() => trace?.remove(), 600);
    flow.classList.remove("is-live");
    [...steps, ...words].forEach((el) => el.classList.remove("is-done", "is-active"));
    root.classList.remove("flow-pending");
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function play() {
    for (let i = 0; i < steps.length; i++) {
      if (ended) return;
      if (i > 0) {   // the line crosses the square to the next step
        draw(crossings[i - 1]);
        await wait(CROSS);
        if (ended) return;
      }
      show(i);
      draw(outlines[i]);
      await wait(DRAW + HOLD);
    }
    end();
  }

  // the strip changed size while it was playing: the line again, as far as it had got
  const resize = new ResizeObserver(() => { if (trace && !ended) build(); });

  // the setting changed while it was playing: straight to the end state
  still.addEventListener("change", () => { if (still.matches) end(); });

  show(-1);
  new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    build();
    resize.observe(flow);
    setTimeout(play, 300);
  }, { threshold: 0.6 }).observe(flow);
})();
