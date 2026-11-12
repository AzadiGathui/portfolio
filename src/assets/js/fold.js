// A narrow screen's way of keeping a long list short (style.css: "Folds").
//
// FOLDS. A group is [data-fold]; a row in it is [data-fold-item], with a
// [data-fold-head] (the title that stays) and a [data-fold-body] (what opens
// under it). A row marked data-fold-open starts open. On a narrow screen the
// head's text is wrapped in a real <button> (aria-expanded, aria-controls),
// and opening one row closes the others. On a wide screen, and without
// scripts, nothing is folded: every body is simply there, and no button is.
//
// RAILS. A [data-rail] is a row to swipe along. A scroller nobody can reach by
// keyboard can't be scrolled by keyboard, so it is made reachable (tabindex)
// only while there is something to scroll to, and it is counted ("2 / 4") so
// you can tell how far along it you are.
(() => {
  const narrow = matchMedia("(max-width: 860px)");   // the same break as style.css's folds
  const snap = () => window.matSnap?.();             // snap.js: the mat's lines, again, for the new heights
  let ids = 0;

  const groups = [...document.querySelectorAll("[data-fold]")].map((group) => ({
    group,
    rows: [...group.querySelectorAll("[data-fold-item]")].flatMap((item) => {
      const head = item.querySelector("[data-fold-head]");
      const body = item.querySelector("[data-fold-body]");
      if (!head || !body) return [];
      body.id ||= `fold-${++ids}`;
      return [{ item, head, body, button: null }];
    }),
  }));

  function set(row, open) {
    row.item.classList.toggle("is-open", open);
    row.button?.setAttribute("aria-expanded", String(open));
  }

  function toggle(row, rows) {
    const open = !row.item.classList.contains("is-open");
    const before = row.head.getBoundingClientRect().top;
    if (open) for (const other of rows) if (other !== row) set(other, false);
    set(row, open);
    snap();
    // What was tapped stays under the finger, however much closes above it
    const shift = row.head.getBoundingClientRect().top - before;
    if (Math.abs(shift) > 1) window.scrollBy({ top: shift, behavior: "instant" });
  }

  function fold(row, rows) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "fold__btn";
    button.setAttribute("aria-controls", row.body.id);
    button.append(...row.head.childNodes);
    row.head.append(button);
    row.button = button;
    // What is tapped is the head (a plain row), or the whole row where the group says
    // so (a card, as the findings are): the button is the same control for the
    // keyboard, and its click bubbles up to the same listener
    row.target = row.item.closest("[data-fold-hit='item']") ? row.item : row.head;
    row.onClick = (event) => {
      if (!event.target.closest("a")) toggle(row, rows);
    };
    row.target.addEventListener("click", row.onClick);
    set(row, row.item.hasAttribute("data-fold-open"));
  }

  function unfold(row) {
    if (!row.button) return;
    row.target.removeEventListener("click", row.onClick);
    row.head.append(...row.button.childNodes);
    row.button.remove();
    row.button = null;
    row.item.classList.remove("is-open");
  }

  function sync() {
    for (const { group, rows } of groups) {
      group.toggleAttribute("data-folded", narrow.matches);
      for (const row of rows) narrow.matches ? !row.button && fold(row, rows) : unfold(row);
    }
    snap();
  }

  // A link to a finding (the rule it led to links back to it) opens it, so what
  // was linked to is on screen and not a title with its detail shut
  function openLinked() {
    const id = location.hash.slice(1);
    for (const { rows } of groups) {
      const row = rows.find((r) => r.item.id === id);
      if (row?.button && !row.item.classList.contains("is-open")) toggle(row, rows);
    }
  }

  if (groups.length) {
    narrow.addEventListener("change", sync);
    addEventListener("hashchange", openLinked);
    sync();
    openLinked();
  }

  // One rail: reachable and counted while it overflows. Returns what to run when its size changes.
  function track(rail) {
    const count = document.createElement("p");
    count.className = "label rail__count";
    count.setAttribute("aria-hidden", "true");   // the list itself already says how many there are
    count.hidden = true;
    rail.after(count);

    const show = () => {
      const steps = [...rail.children];
      const edge = rail.getBoundingClientRect().left;
      const away = (step) => Math.abs(step.getBoundingClientRect().left - edge);
      let at = steps.reduce((best, step, i) => (away(step) < away(steps[best]) ? i : best), 0);
      // The last step can't always reach the edge, so reaching the end counts as being on it
      if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2) at = steps.length - 1;
      count.textContent = `${at + 1} / ${steps.length}`;
    };

    let frame = 0;
    rail.addEventListener("scroll", () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(show);
    }, { passive: true });

    return () => {
      const more = rail.scrollWidth > rail.clientWidth + 1;
      if (more) rail.tabIndex = 0;
      else rail.removeAttribute("tabindex");
      if (count.hidden === more) {
        count.hidden = !more;
        snap();   // the counter is a line the mat has to count
      }
      if (more) show();
    };
  }

  const rails = new Map([...document.querySelectorAll("[data-rail]")].map((rail) => [rail, track(rail)]));
  if (rails.size) {
    const reach = new ResizeObserver((changed) => changed.forEach(({ target }) => rails.get(target)()));
    rails.forEach((_, rail) => reach.observe(rail));
  }
})();
