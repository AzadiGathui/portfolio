// The CV (/resume/). Every card's rows are <details>, folded to a line
// with a thumbnail, so the whole career can be skimmed; they open by
// themselves without any of this. On top, this adds:
// - each card's header opens or closes all its rows; "Expand all" opens
//   or closes every row on the page
// - opening or closing many rows at once keeps what you were reading
//   where it was (no jumping), and skips the animation (.is-bulk)
// - a link to a card or row (#jireh, #ciff), from the timeline or
//   another page, opens it, scrolls to it and lights it briefly
// - a timeline bar and its card or row light up together on hover
// - the panel under the timeline previews the bar pointed at, or keeps the
//   one clicked or tapped; pointing at a lane's name fades the other lanes
// - the timeline draws itself in once it's on screen
// - printing ("Save as PDF") opens every row, then puts them back
(() => {
  const cards = [...document.querySelectorAll(".mat__content .entry")];
  if (!cards.length) return;
  const root = document.documentElement;
  const rowsIn = (el) => [...el.querySelectorAll(".entry__row")];
  const allRows = rowsIn(document);
  const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  // snap.js re-sizes the cards on "toggle"; sent now, not when the browser gets round to it
  const resnap = () => document.querySelector(".mat__content").dispatchEvent(new Event("toggle"));

  // Change many rows at once without the page jumping: the card being read
  // stays where it is on screen (or, if its top was above the screen and
  // it closes, its title comes back to the top)
  function bulk(change, anchor = cards.find((c) => c.getBoundingClientRect().bottom > 0)) {
    const before = anchor?.getBoundingClientRect().top;
    root.classList.add("is-bulk");
    change();
    resnap();
    if (anchor) {
      const after = anchor.getBoundingClientRect().top;
      // "the top" is just below the pinned keys
      const top = (document.querySelector(".keys")?.getBoundingClientRect().bottom || 0) + 16;
      const target = before < top && anchor.getBoundingClientRect().bottom < innerHeight ? top : before;
      scrollBy({ top: after - target, behavior: "instant" });
    }
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("is-bulk")));
    updateButtons();
  }

  // Each card's header: one button over it, named for the card
  for (const card of cards) {
    const head = card.querySelector(".entry__meta");
    const rows = rowsIn(card);
    if (!head || !rows.length) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "entry__toggle";
    button.setAttribute("aria-expanded", "false");
    const name = document.createElement("span");
    name.className = "visually-hidden";
    // "Show all of UX researcher, Jireh Health": the role alone could be two cards'
    const where = head.querySelector(".entry__where > span:not([aria-hidden])")?.textContent;
    name.textContent = `Show all of ${head.querySelector("h3")?.textContent}${where ? `, ${where}` : ""}`;
    button.append(name);
    button.addEventListener("click", () => {
      const open = !rows.every((r) => r.open);
      bulk(() => rows.forEach((r) => (r.open = open)), card);
    });
    head.append(button);
  }

  const expandAll = document.querySelector("[data-expand-all]");
  expandAll?.addEventListener("click", () => {
    const open = !allRows.every((r) => r.open);
    bulk(() => allRows.forEach((r) => (r.open = open)));
  });

  // Buttons say what they'll do next
  function updateButtons() {
    for (const card of cards) {
      const rows = rowsIn(card);
      card.querySelector(".entry__toggle")?.setAttribute("aria-expanded", String(rows.length > 0 && rows.every((r) => r.open)));
    }
    if (expandAll) {
      const all = allRows.every((r) => r.open);
      expandAll.textContent = all ? "Collapse all" : "Expand all";
      expandAll.setAttribute("aria-pressed", String(all));
    }
  }
  document.addEventListener("toggle", (e) => e.target.matches?.(".entry__row") && updateButtons(), true);

  // A link to a card or a row opens it, then brings it into view and lights it
  function openTarget(behavior = "instant") {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const card = target && cards.find((c) => c.contains(target));
    if (!card) return;
    const rows = target.matches(".entry__row") ? [target] : rowsIn(card);
    bulk(() => rows.forEach((r) => (r.open = true)), null);
    // Where it will be, not where it is: a card not yet on screen is still
    // lowered, waiting to rise into place (style.css), so it's measured
    // with that paused
    card.style.animation = "none";
    const y = target.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(target).scrollMarginTop || 0);
    card.style.animation = "";
    scrollTo({ top: y, behavior });
    target.classList.remove("is-flash");
    void target.offsetWidth; // restart the animation if it's lit again
    target.classList.add("is-flash");
    setTimeout(() => target.classList.remove("is-flash"), 1700);
  }
  addEventListener("hashchange", () => openTarget(smooth()));
  openTarget();

  // ------------------------------------------------------------------
  // The timeline
  // ------------------------------------------------------------------
  const chart = document.querySelector(".tl");
  if (chart) {
    // Its bars, by the id of the card or row each stands for
    const bars = new Map([...chart.querySelectorAll(".tl__track a")].map((a) => [a.hash.slice(1), a.closest("li")]));

    // The panel under the chart shows one entry: the one pointed at (a
    // preview, gone when the pointer leaves), else the one chosen (kept; the
    // job you're in now to begin with). Each entry's content is built into
    // the page, hidden (resume.njk: .tl-pv); this copies it in.
    const panel = document.getElementById("tl-panel");
    const body = panel?.querySelector(".tl-panel__body");
    const hint = panel?.querySelector(".tl-panel__hint");
    const lis = new Map([...chart.querySelectorAll(".tl__track li")].map((li) => [li.dataset.id, li]));
    const ticks = new Map([...chart.querySelectorAll(".tl__tick")].map((t) => [t.dataset.id, t]));
    let chosen = panel?.dataset.current || lis.keys().next().value;

    const show = (id, preview = false) => {
      const pv = document.getElementById(`pv-${id}`);
      if (!pv || !body) return;
      body.replaceChildren(...[...pv.children].map((c) => c.cloneNode(true)));
      body.dataset.id = id;
      hint.textContent = preview ? "Click to keep" : "";
      // the bar it belongs to (a project in a group lights the group, and its own tick)
      const group = pv.dataset.back;
      lis.forEach((li, key) => li.classList.toggle("is-selected", key === (group || id)));
      ticks.forEach((t, key) => t.classList.toggle("is-picked", key === id));
      resnap();
    };
    const choose = (id) => { chosen = id; show(id); };
    if (panel) show(chosen);

    // Choosing: a click or tap on a bar (not a jump: the panel has the link to the card),
    // or a project or "all projects" inside the panel
    chart.addEventListener("click", (e) => {
      const li = e.target.closest(".tl__track li");
      if (!li || !panel) return;
      e.preventDefault();
      choose(li.dataset.id);
    });
    panel?.addEventListener("click", (e) => {
      const pick = e.target.closest("[data-pick]");
      if (pick) return choose(pick.dataset.pick);
      // "Full entry": the way to the card, which opens and lights up
      const open = e.target.closest("a[data-open]");
      if (!open) return;
      e.preventDefault();
      history.pushState(null, "", open.hash);
      openTarget(smooth());
    });

    // Pointing at a bar previews it (a mouse or pen; a finger just chooses)
    chart.addEventListener("pointerover", (e) => {
      const li = e.target.closest?.(".tl__track li");
      if (li && e.pointerType !== "touch" && li.dataset.id !== body?.dataset.id) show(li.dataset.id, true);
    });
    chart.addEventListener("pointerleave", (e) => e.pointerType !== "touch" && show(chosen));
    // the keyboard previews as it moves; choosing is Enter
    chart.addEventListener("focusin", (e) => {
      const li = e.target.closest?.(".tl__track li");
      if (li && li.matches(":has(:focus-visible)")) show(li.dataset.id, true);
    });
    chart.addEventListener("focusout", (e) => !chart.contains(e.relatedTarget) && show(chosen));

    // The lane names, on the left axis: point at one (or focus it) and its
    // projects stand out, the other lanes fade. Click or tap keeps it; again clears it.
    let kept = null;
    const focusLane = (lane) => chart.querySelectorAll("[data-lane]").forEach((el) => el.classList.toggle("is-dim", !!lane && el.dataset.lane !== lane));
    for (const name of chart.querySelectorAll(".tl__name")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tl__lane";
      button.dataset.lane = name.dataset.lane;
      button.setAttribute("aria-pressed", "false");
      button.textContent = name.textContent;
      name.replaceChildren(button);
      button.addEventListener("pointerenter", (e) => e.pointerType !== "touch" && focusLane(button.dataset.lane));
      button.addEventListener("pointerleave", (e) => e.pointerType !== "touch" && focusLane(kept));
      button.addEventListener("focus", () => button.matches(":focus-visible") && focusLane(button.dataset.lane));
      button.addEventListener("blur", () => focusLane(kept));
      button.addEventListener("click", () => {
        kept = kept === button.dataset.lane ? null : button.dataset.lane;
        chart.querySelectorAll(".tl__lane").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lane === kept)));
        focusLane(kept);
      });
    }

    // Pointing at a bar lights its card or row; pointing at a row or card lights its bar
    let lit = [];
    const light = (bar, item) => {
      lit.forEach((el) => el.classList.remove("is-linked"));
      lit = [bar, item].filter(Boolean);
      lit.forEach((el) => el.classList.add("is-linked"));
      chart.classList.toggle("has-link", !!bar);
    };
    const fromBar = (e) => {
      const li = e.target.closest?.(".tl__track li");
      if (li) light(li, document.getElementById(li.querySelector("a").hash.slice(1)));
    };
    const fromCard = (e) => {
      const item = e.target.closest?.(".entry__row, .mat__content .entry");
      if (!item) return;
      // its own bar, else its card's (Leja's rows share the Leja bar); only
      // the row pointed at lights up, not the rest of its card
      const bar = bars.get(item.id) || bars.get(item.closest(".entry").id);
      if (bar) light(bar, item);
    };
    chart.addEventListener("pointerover", fromBar);
    chart.addEventListener("focusin", fromBar);
    chart.addEventListener("pointerleave", () => light());
    chart.addEventListener("focusout", () => light());
    for (const card of cards) {
      card.addEventListener("pointerover", fromCard);
      card.addEventListener("pointerleave", () => light());
    }

    // Draw it in once half of it is on screen (style.css: .is-drawn)
    if ("IntersectionObserver" in window) {
      const seen = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        chart.classList.add("is-drawn");
        seen.disconnect();
      }, { threshold: 0.5 });
      seen.observe(chart);
    } else chart.classList.add("is-drawn");
  }

  // "Save as PDF": the browser's print dialog (cv-print.css lays the page
  // out for paper). Every row is opened for printing, then the ones that
  // were closed are closed again.
  document.querySelector("[data-print] button")?.addEventListener("click", () => print());
  let closed = [];
  addEventListener("beforeprint", () => {
    closed = allRows.filter((r) => !r.open);
    root.classList.add("is-bulk");
    closed.forEach((r) => (r.open = true));
  });
  addEventListener("afterprint", () => {
    closed.forEach((r) => (r.open = false));
    root.classList.remove("is-bulk");
  });
})();
