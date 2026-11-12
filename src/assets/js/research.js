// Research sources (a case study's research section; markup:
// partials/study/research.njk, styles: "Research" in style.css).
//
// Without this file the sources are a plain grid, each with its title and
// link. With it they are gathered into a loose pile:
//   - one source at a time is brought forward, in colour, with its title
//     (every few seconds: data-cycle on .rw)
//   - pointing at a source, tabbing to it, or tapping it holds it open and
//     adds where it is from and a link to it; moving away lets go
//   - a button pauses the motion; with "reduce motion" nothing cycles and
//     the lines between the pile and the findings stand still
// On a narrow column the pile becomes a strip that scrolls sideways, with
// the open source's title and link in a box underneath.
//
// The pile's layout is worked out here (each source's place depends on its
// picture's shape and on which one is open); every size is a fraction of the
// pile's width (--cw), so CSS scales it and nothing is measured on resize.
(() => {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const f4 = (v) => v.toFixed(4);
  const GOLDEN = 2.39996;   // the golden angle, in radians: a sunflower's spacing, so no two sources line up

  for (const root of document.querySelectorAll(".rw")) {
    const pile = root.querySelector(".rw__pile");
    const cards = [...root.querySelectorAll(".rw__card")];
    const detail = root.querySelector(".rw__detail");
    const pause = root.querySelector(".rw__pause");
    const n = cards.length;
    if (!pile || !n) continue;

    // Each picture's shape (width / height), from the size the image pipeline wrote on it
    const shapes = cards.map((card) => {
      const img = card.querySelector("img");
      const w = +img?.getAttribute("width"), h = +img?.getAttribute("height");
      return w > 0 && h > 0 ? w / h : 1.33;
    });

    // The strip's box: every source's title and link in one grid cell, so
    // the box is as tall as the longest and never changes height
    const infos = cards.map((card) => {
      const info = card.querySelector(".rw__foot").cloneNode(true);
      info.className = "rw__info";
      detail.append(info);
      return info;
    });

    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const state = {
      cycle: 0,          // the source the cycle has reached
      hover: null, focus: null, pin: null,   // a source held open, and how
      over: false,       // the pointer is over the pile
      touching: false,   // a finger is on the strip (or has just left it)
      paused: false,     // the pause button
      offscreen: false,  // scrolled out of view: nothing to watch
      reduced: mq.matches,
    };
    const every = (parseFloat(root.dataset.cycle) || 4) * 1000;
    const strip = () => getComputedStyle(pile).getPropertyValue("--rw-mode").trim() === "strip";   // CSS decides, by the column's width

    const held = () => state.hover ?? state.focus ?? state.pin;
    const canCycle = () => !state.paused && !state.reduced && n > 1 && !state.over && !state.touching && !state.offscreen && held() == null;

    // ---- The pile: a sunflower scatter, in units of its width ----
    function layout(active, open) {
      const area = clamp(0.58 / n, 0.03, 0.12);   // each picture's share of the pile
      const base = shapes.map((asp, i) => {
        let w = Math.sqrt(area * asp), h = Math.sqrt(area / asp);
        if (w > 0.4) { h *= 0.4 / w; w = 0.4; }
        const r = n === 1 ? 0 : Math.sqrt((i + 0.5) / n), th = i * GOLDEN;
        return { asp, w, h, x: 0.5 + 0.31 * r * Math.cos(th), y: 0.525 + 0.33 * r * Math.sin(th), rot: ((i * 53) % 11 - 5) * 1.2 };
      });
      const a = active != null ? base[active] : null;
      let ax = 0, ay = 0, aw = 0;
      if (a) {
        aw = Math.min(0.5, a.w * 1.35);
        const ah = Math.max(aw, 0.3) / a.asp + 0.3;   // room for the picture (never under 160px wide) and its words
        ax = clamp(a.x, 0.24, 0.76);
        ay = clamp(a.y, ah / 2 + 0.01, 1.05 - ah / 2 - 0.01);
      }
      base.forEach((b, i) => {
        const card = cards[i], on = active === i;
        let px = 0, py = 0;   // the others step back from the one brought forward
        if (a && !on) {
          const vx = b.x - ax, vy = b.y - ay, dist = Math.hypot(vx, vy);
          if (dist > 0 && dist < 0.55) { const by = 0.1 * (1 - dist / 0.55); px = vx / dist * by; py = vy / dist * by; }
        }
        const imgW = on ? `max(calc(var(--cw) * ${f4(aw)}), 160px)` : `calc(var(--cw) * ${f4(b.w)})`;
        card.style.cssText =
          `left:calc(var(--cw) * ${f4(on ? ax : b.x)});top:calc(var(--cw) * ${f4(on ? ay : b.y)});` +
          `width:${on ? `max(calc(var(--cw) * ${f4(aw)} + 32px), 192px)` : imgW};` +
          `transform:translate(-50%,-50%) translate(calc(var(--cw) * ${f4(px)}),calc(var(--cw) * ${f4(py)})) rotate(${on ? 0 : b.rot}deg);` +
          `z-index:${on ? n + 10 : i + 1};--asp:${f4(b.asp)};--img-w:${imgW}`;
        card.classList.toggle("is-on", on);
        card.classList.toggle("is-detail", open === i);
      });
    }

    // ---- The strip: thumbnails in a row, the open one's words underneath ----
    let lastCentred = null;
    function layoutStrip(active, pinned) {
      cards.forEach((card, i) => {
        card.style.cssText = `--asp:${f4(clamp(shapes[i], 0.5, 2.4))}`;
        card.classList.toggle("is-on", active === i);
        card.classList.toggle("is-detail", pinned === i);
        card.setAttribute("aria-pressed", pinned === i ? "true" : "false");
        infos[i].classList.toggle("is-act", active === i);
      });
      // the row scrolls (never the page) so the open thumbnail sits in the middle
      if (active !== lastCentred && active != null && pile.scrollWidth > pile.clientWidth) {
        const el = cards[active];
        pile.scrollTo({ left: Math.max(0, el.offsetLeft - (pile.clientWidth - el.offsetWidth) / 2), behavior: state.reduced ? "auto" : "smooth" });
      }
      lastCentred = active;
    }

    let timer = null, wasStrip = null;
    function render() {
      const isStrip = strip();
      if (isStrip !== wasStrip) {
        wasStrip = isStrip;
        detail.hidden = !isStrip;
        for (const card of cards) {
          card.setAttribute("tabindex", "0");
          if (isStrip) card.setAttribute("role", "button"); else { card.setAttribute("role", "group"); card.removeAttribute("aria-pressed"); }
        }
      }
      const open = held();
      // with motion off nothing is brought forward on its own: in the pile all rest, in the strip the first is shown
      const idle = state.reduced ? (isStrip ? 0 : null) : state.cycle % n;
      const active = open != null ? open : idle;
      if (isStrip) layoutStrip(active, state.pin); else layout(active, open);

      root.dataset.motion = state.reduced ? "reduced" : state.paused ? "paused" : "on";
      pause.disabled = state.reduced;
      pause.querySelector("span").textContent = state.reduced ? "Motion off" : state.paused ? "Play motion" : "Pause motion";
      pause.querySelector("path").setAttribute("d", state.paused && !state.reduced ? "M6 4l10 6-10 6z" : "M7 4v12M13 4v12");

      // one timer, a whole interval long, re-armed after every change
      clearTimeout(timer);
      if (canCycle()) timer = setTimeout(() => set({ cycle: (state.cycle + 1) % n }), every);
    }
    function set(change) { Object.assign(state, change); render(); }

    const mouse = (e) => !e.pointerType || e.pointerType === "mouse";   // touch fires enter and leave around a tap: only a mouse hovers
    pile.addEventListener("pointerenter", (e) => mouse(e) && set({ over: true }));
    pile.addEventListener("pointerleave", (e) => mouse(e) && set({ over: false, hover: null, cycle: state.hover ?? state.cycle }));
    let touchEnd = null;   // a finger that has just left still holds the cycle for a moment
    pile.addEventListener("touchstart", () => { clearTimeout(touchEnd); set({ touching: true }); }, { passive: true });
    pile.addEventListener("touchend", () => { clearTimeout(touchEnd); touchEnd = setTimeout(() => set({ touching: false }), 2500); }, { passive: true });

    cards.forEach((card, i) => {
      card.addEventListener("pointermove", (e) => {
        if (!mouse(e) || strip() || state.hover === i) return;
        if (e.movementX === 0 && e.movementY === 0) return;   // the pile moved under a still pointer
        set({ hover: i, over: true });
      });
      card.addEventListener("focusin", () => { if (card.matches(":focus-visible, :has(:focus-visible)") && state.focus !== i) set({ focus: i }); });
      card.addEventListener("focusout", (e) => {
        if (card.contains(e.relatedTarget)) return;
        if (state.focus === i) set({ focus: null, cycle: i });
      });
      // a tap (no hover to rely on) holds a source open, and a second tap lets go; in the strip a click does too
      card.addEventListener("click", (e) => {
        if (e.target.closest("a, button")) return;
        if (strip() || e.pointerType === "touch" || e.pointerType === "pen") set(state.pin === i ? { pin: null, cycle: i } : { pin: i, cycle: i });
      });
      card.addEventListener("keydown", (e) => {
        if (e.target !== card || (e.key !== "Enter" && e.key !== " ")) return;
        e.preventDefault();
        set(state.pin === i ? { pin: null, cycle: i } : { pin: i, cycle: i });
      });
    });
    root.addEventListener("keydown", (e) => { if (e.key === "Escape" && held() != null) set({ hover: null, pin: null }); });

    pause.addEventListener("click", () => set({ paused: !state.paused }));
    mq.addEventListener("change", () => set({ reduced: mq.matches }));
    new ResizeObserver(() => { if (strip() !== wasStrip) render(); }).observe(root);
    // nothing cycles while the pile is off screen
    new IntersectionObserver(([entry]) => set({ offscreen: !entry.isIntersecting })).observe(root);

    pause.hidden = false;
    root.classList.add("is-live");
    render();
  }
})();
