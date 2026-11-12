// Tips (style.css: "Tip"): a small card that opens from the thing it describes.
//
// One card, two ways of opening it, named on the element that owns it:
//
//   data-tip="hover"  a team member (layouts/project.njk). CSS opens it on hover
//                     and on keyboard focus. Touch has no hover, so there the
//                     first tap shows it and the second follows the link.
//   data-tip="click"  a pin on an annotated screen (pins.js). Its button,
//                     [data-tip-trigger], opens and closes the card, and this
//                     script places it: beside the button, kept on screen.
//
// For both, one tip is open at a time, and Escape, or a tap elsewhere, puts it
// away. Everything is listened for on the document, so a tip made later (pins.js
// makes its own) needs no wiring.
(() => {
  const OPEN = "is-open";
  const GAP = 12;    // between the button and the card: the card's pointer (a 10px square, turned) takes 7 of it
  const EDGE = 12;   // the closest a card comes to the screen's edge
  let pointer = "mouse";

  const isClick = (host) => host.dataset.tip === "click";

  function set(host, open) {
    host.classList.toggle(OPEN, open);
    host.querySelector("[data-tip-trigger]")?.setAttribute("aria-expanded", String(open));
    if (open && isClick(host)) place(host);
  }

  function closeOthers(keep) {
    for (const host of document.querySelectorAll(`[data-tip].${OPEN}`)) if (host !== keep) set(host, false);
  }

  // Where a click tip goes. The card is measured (it is on show now, though not yet
  // painted), then placed under its button, or over it when there is no room below,
  // centred on the button and slid along until it is inside the screen. The answer goes to
  // CSS as custom properties from the host's corner (the host is position: relative),
  // with the side chosen (the pointer's edge) and how far along that edge the pointer goes.
  function place(host) {
    const button = host.querySelector("[data-tip-trigger]");
    const tip = host.querySelector(".tip");
    if (!button || !tip) return;

    const at = button.getBoundingClientRect();
    const home = host.getBoundingClientRect();
    const { offsetWidth: w, offsetHeight: h } = tip;
    const screenW = document.documentElement.clientWidth;
    const screenH = innerHeight;
    // A phone's reading bar floats over the bottom of the screen: a card under a button near it would be hidden by it
    const bar = document.querySelector(".reading-bar");
    const covered = bar && getComputedStyle(bar).display !== "none" ? Math.max(0, screenH - bar.getBoundingClientRect().top) : 0;

    const below = screenH - at.bottom - EDGE - covered;
    const above = at.top - EDGE;
    const side = below >= h + GAP || below >= above ? "bottom" : "top";

    const middle = at.left + at.width / 2;
    const x = Math.min(Math.max(middle - w / 2, EDGE), screenW - EDGE - w);
    const y = side === "bottom" ? at.bottom + GAP : at.top - GAP - h;

    tip.dataset.side = side;
    tip.style.setProperty("--tip-x", `${x - home.left}px`);
    tip.style.setProperty("--tip-y", `${y - home.top}px`);
    tip.style.setProperty("--tip-ax", `${Math.min(Math.max(middle - x, 14), w - 14)}px`);   // not into the card's corners
  }

  document.addEventListener("pointerdown", (e) => {
    pointer = e.pointerType;
    closeOthers(e.target.closest("[data-tip]"));   // a press on a tip's own owner is that tip's business (the click, below)
  });

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-tip-trigger]");
    if (trigger) {
      const host = trigger.closest('[data-tip="click"]');
      if (!host) return;
      closeOthers(host);
      set(host, !host.classList.contains(OPEN));
      return;
    }
    const face = e.target.closest('[data-tip="hover"]');
    if (!face || pointer !== "touch" || face.classList.contains(OPEN)) return;
    e.preventDefault();   // first tap: show the name, don't leave the page
    closeOthers(face);
    set(face, true);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    for (const host of document.querySelectorAll("[data-tip]")) {
      // a hover tip put away stays away until the pointer or focus has left and come back
      if (!isClick(host) && host.matches(":hover, :focus-within, .is-open")) host.classList.add("is-put-away");
      if (host.classList.contains(OPEN)) set(host, false);
    }
  });

  // The pointer or focus has left a tip's owner (and not just moved between its parts)
  const left = (e) => {
    const host = e.target.closest?.("[data-tip]");
    if (!host || host.contains(e.relatedTarget)) return;
    host.classList.remove("is-put-away");
    if (e.type === "focusout" && isClick(host) && e.relatedTarget) set(host, false);   // tabbed on to something else
  };
  document.addEventListener("pointerout", left);
  document.addEventListener("focusout", left);

  // A different width (a phone turned over, a window dragged across the pin breakpoint) puts the tips
  // elsewhere: put them away. A different height alone (a phone's toolbar sliding away) changes nothing.
  let width = innerWidth;
  addEventListener("resize", () => {
    if (innerWidth === width) return;
    width = innerWidth;
    closeOthers(null);
  });
})();
