// The tools on the mat can be picked up and moved
// anywhere, even off the mat onto the table around it. With a mouse,
// drag straight away. On a touch screen, press and hold to pick one up:
// a quick swipe over a tool still scrolls the page, so the tools never
// get in the way of reading. Every visit starts with them back in place.
// Where a tool has been moved to is kept in --dx / --dy (see .tool).
(() => {
  const mat = document.querySelector(".mat");
  if (!mat) return;

  const HOLD_MS = 350; // how long a finger must rest on a tool to pick it up
  const SLOP = 8; // px a finger may wander during that time (more = a scroll)
  let held = null;

  function pickUp(tool, e) {
    const r = tool.getBoundingClientRect();
    // Tools may leave the mat for the table around it, but not the page:
    // past its edge they would make the page scroll sideways
    const m = (mat.closest(".desk") || mat).getBoundingClientRect();
    const px = (name) => parseFloat(tool.style.getPropertyValue(name)) || 0;
    held = {
      tool,
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      dx: px("--dx"),
      dy: px("--dy"),
      // how far it can travel before an edge leaves the table
      min: [m.left - r.left, m.top - r.top],
      max: [m.right - r.right, m.bottom - r.bottom],
    };
    tool.classList.add("is-held");
    document.documentElement.classList.add("is-dragging"); // no text selection meanwhile
    getSelection()?.removeAllRanges();
    try { tool.setPointerCapture(e.pointerId); } catch {}
  }

  function putDown(e) {
    if (!held || e.pointerId !== held.id) return;
    held.tool.classList.remove("is-held");
    document.documentElement.classList.remove("is-dragging");
    held = null;
  }

  // A mouse press on a tool must not start selecting the text beneath it
  mat.addEventListener("mousedown", (e) => { if (e.target.closest(".tool")) e.preventDefault(); });
  document.addEventListener("selectstart", (e) => { if (held) e.preventDefault(); });

  mat.addEventListener("pointerdown", (e) => {
    const tool = e.target.closest(".tool");
    if (!tool || held || e.button > 0) return;

    if (e.pointerType === "mouse") {
      e.preventDefault(); // no text selection while dragging
      pickUp(tool, e);
      return;
    }

    // Touch / pen: wait, and give up if the finger moves first (a scroll)
    const stop = () => {
      clearTimeout(timer);
      tool.removeEventListener("pointermove", wander);
      tool.removeEventListener("pointerup", stop);
      tool.removeEventListener("pointercancel", stop);
    };
    const wander = (ev) => {
      if (Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) > SLOP) stop();
    };
    const timer = setTimeout(() => { stop(); pickUp(tool, e); }, HOLD_MS);
    tool.addEventListener("pointermove", wander);
    tool.addEventListener("pointerup", stop);
    tool.addEventListener("pointercancel", stop);
  });

  window.addEventListener("pointermove", (e) => {
    if (!held || e.pointerId !== held.id) return;
    const clamp = (v, i) => Math.min(held.max[i], Math.max(held.min[i], v));
    held.tool.style.setProperty("--dx", `${held.dx + clamp(e.clientX - held.x, 0)}px`);
    held.tool.style.setProperty("--dy", `${held.dy + clamp(e.clientY - held.y, 1)}px`);
  });
  window.addEventListener("pointerup", putDown);
  window.addEventListener("pointercancel", putDown);

  // While a tool is held, a moving finger drags it instead of scrolling the page
  mat.addEventListener("touchmove", (e) => { if (held) e.preventDefault(); }, { passive: false });
})();
