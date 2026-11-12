// Pins: how an annotated screen keeps its notes on a narrow screen
// (style.css: "Pins").
//
// A group is [data-pins]. Each [data-pin] in it, whose value is "l" or "r" (the
// edge its pin sits on), has a [data-pin-note]: the words that explain it.
// Every note gets a numbered circle, and a tip carrying the same words that
// opens when the circle is pressed (tip.js).
//
// This only adds them. Whether they are on show, and the note itself put away,
// is the stylesheet's call, by width: a wide screen has room for the notes
// beside their slices, so there the circles and tips are display: none. And
// without this script, or in print, the notes are all there is, so every one is
// on show.
(() => {
  let ids = 0;

  for (const group of document.querySelectorAll("[data-pins]")) {
    let n = 0;
    for (const item of group.querySelectorAll("[data-pin]")) {
      const note = item.querySelector("[data-pin-note]");
      if (!note) continue;
      const id = `pin-tip-${++ids}`;
      n += 1;

      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = "pin";
      pin.textContent = n;
      pin.setAttribute("aria-label", `Note ${n}`);
      pin.setAttribute("aria-expanded", "false");
      pin.setAttribute("aria-controls", id);
      pin.setAttribute("data-tip-trigger", "");

      // The note's own words, copied: the note stays as it was for the widths and the readers that never see a pin
      const tip = document.createElement("span");
      tip.className = "tip";
      tip.id = id;
      tip.setAttribute("role", "note");
      const card = document.createElement("span");
      card.className = "tip__card";
      card.append(...[...note.childNodes].map((node) => node.cloneNode(true)));
      tip.append(card);

      item.dataset.tip = "click";
      item.append(pin, tip);   // after the slice and its note, so a reader meets the note's tip straight after its pin
    }
    group.setAttribute("data-pinned", "");
  }
})();
