(function () {
  "use strict";

  // ─── Data ──────────────────────────────────────────────────────────────
  // Each entry powers a card and the playground insert buttons. The token
  // class on the marker span drives the visual marker when highlight is on.

  const CHARACTERS = [
    {
      id: "space",
      name: "Space",
      unicode: "U+0020",
      char: " ",
      category: "spacing",
      token: "space",
      mac: "Spacebar",
      win: "Spacebar",
      before: "The·quick·brown·fox jumped over the lazy dog.",
      after:  "The·quick·brown·fox jumped over the lazy dog.",
      beforeLabel: "Standard word separation",
      afterLabel: "—",
      cases: [
        "Between words in normal prose",
        "List items and inline descriptors"
      ]
    },
    {
      id: "nbsp",
      name: "Non-breaking space",
      unicode: "U+00A0",
      char: " ",
      category: "spacing",
      token: "nbsp",
      mac: "⌥ + Space",
      win: "Ctrl + Shift + Space",
      before: "The trail measured 50 km on the day.",
      after:  "The trail measured 50 km on the day.",
      beforeLabel: "50 and km can split across a line break",
      afterLabel: "50 and km stay locked together",
      cases: [
        "Numbers bound to units: 50 km, 8 GB, 12 px",
        "Initials and titles: Dr. Smith, J. F. Kennedy",
        "Currency and amount: $ 99.99, € 49",
        "Cross-references: figure 4, section 2.1"
      ]
    },
    {
      id: "tab",
      name: "Tab",
      unicode: "U+0009",
      char: "\t",
      category: "spacing",
      token: "tab",
      mac: "Tab",
      win: "Tab",
      before: "Item\tPrice\nMug\t£12\nBook\t£18",
      after:  "Item\tPrice\nMug\t£12\nBook\t£18",
      beforeLabel: "Aligning data in columns",
      afterLabel: "—",
      cases: [
        "Indenting the first line of paragraphs",
        "Aligning short data into columns before reaching for a table",
        "Code samples and technical documentation"
      ]
    },
    {
      id: "em-space",
      name: "Em space",
      unicode: "U+2003",
      char: " ",
      category: "spacing",
      token: "em-space",
      mac: "⇧ + ⌘ + M",
      win: "Shift + Ctrl + M",
      before: "Section one End. Section two begins.",
      after:  "Section one End. Section two begins.",
      beforeLabel: "Standard space between sentences",
      afterLabel: "Deliberate em-width pause",
      cases: [
        "First-line indents in classical typesetting",
        "Set against em dashes in some house styles",
        "Editorial pauses that read as a beat, not a break"
      ]
    },
    {
      id: "en-space",
      name: "En space",
      unicode: "U+2002",
      char: " ",
      category: "spacing",
      token: "en-space",
      mac: "⇧ + ⌘ + N",
      win: "Shift + Ctrl + N",
      before: "Title — Subtitle",
      after:  "Title — Subtitle",
      beforeLabel: "Regular spaces around em dash",
      afterLabel: "En-spaced em dash (European style)",
      cases: [
        "Proportional spacing around em dashes (European tradition)",
        "Fine-tuning rhythm in justified text",
        "Before footnote markers in editorial work"
      ]
    },
    {
      id: "thin-space",
      name: "Thin space",
      unicode: "U+2009",
      char: " ",
      category: "spacing",
      token: "thin-space",
      mac: "Insert special character",
      win: "Insert special character",
      before: "She paused — and walked on. 50%",
      after:  "She paused — and walked on. 50 %",
      beforeLabel: "Tight punctuation",
      afterLabel: "Thin-spaced dashes and units (French / scientific)",
      cases: [
        "Around em dashes in British and French typography",
        "Between number and unit-symbol in scientific style (50 %, 6.02 × 10²³)",
        "Inside grouped digits: 1 000 000 (French thousands separator)"
      ]
    },
    {
      id: "hair-space",
      name: "Hair space",
      unicode: "U+200A",
      char: " ",
      category: "spacing",
      token: "hair-space",
      mac: "Insert special character",
      win: "Insert special character",
      before: "\"Quoted phrase here.\"",
      after:  "\" Quoted phrase here. \"",
      beforeLabel: "Quotes tight to content",
      afterLabel: "Hair space inside the quotes for optical balance",
      cases: [
        "Optical balance inside quotation marks",
        "Tiny adjustments around punctuation in display type",
        "Adjusting kerning anomalies on a single line"
      ]
    },
    {
      id: "zwsp",
      name: "Zero-width space",
      unicode: "U+200B",
      char: "​",
      category: "hidden",
      token: "zwsp",
      mac: "Insert special character",
      win: "Insert special character",
      before: "Visit https://supercalifragilisticexpialidocious.example.com/long/path/here",
      after:  "Visit https://supercalifragilistic​expialidocious.example.com/long/​path/here",
      beforeLabel: "URL overflows the measure",
      afterLabel: "Invisible break points let the URL wrap cleanly",
      cases: [
        "Forcing wrap points in long URLs and identifiers",
        "Breaking compound words without inserting a visible hyphen",
        "Preventing unwanted ligatures between adjacent glyphs"
      ]
    },
    {
      id: "line-break",
      name: "Line break",
      unicode: "U+000A",
      char: "\n",
      category: "breaks",
      token: "line-break",
      mac: "⇧ + Return",
      win: "Shift + Enter",
      before: "Roses are red, violets are blue, sugar is sweet, and so are you.",
      after:  "Roses are red,\nviolets are blue,\nsugar is sweet,\nand so are you.",
      beforeLabel: "Continuous prose",
      afterLabel: "Forced line breaks for verse and addresses",
      cases: [
        "Poetry, lyrics and verse where line breaks carry meaning",
        "Addresses on multiple lines",
        "Breaking dialogue from its attribution"
      ]
    },
    {
      id: "paragraph-break",
      name: "Paragraph break",
      unicode: "U+000D",
      char: "\n\n",
      category: "breaks",
      token: "paragraph-break",
      mac: "Return",
      win: "Enter",
      before: "First idea ends here. Second idea begins.",
      after:  "First idea ends here.\n\nSecond idea begins.",
      beforeLabel: "Run-on prose",
      afterLabel: "Clean separation between thoughts",
      cases: [
        "Separating distinct blocks of thought",
        "New sections, scenes, or speakers",
        "Visual breathing room in dense reading"
      ]
    },
    {
      id: "em-dash",
      name: "Em dash",
      unicode: "U+2014",
      char: "—",
      category: "dashes",
      token: "em-dash",
      mac: "⇧ + ⌥ + Hyphen",
      win: "Alt + 0151",
      before: "She walked to the door - and stopped.",
      after:  "She walked to the door — and stopped.",
      beforeLabel: "Hyphen mis-used as a pause",
      afterLabel: "Em dash sets off the clause",
      cases: [
        "Parenthetical asides set off with emphasis",
        "Indicating an abrupt break: \"Well, I thought—\"",
        "Attribution lines under pull quotes: — Bringhurst"
      ]
    },
    {
      id: "en-dash",
      name: "En dash",
      unicode: "U+2013",
      char: "–",
      category: "dashes",
      token: "en-dash",
      mac: "⌥ + Hyphen",
      win: "Alt + 0150",
      before: "Pages 23-47, 9 AM-5 PM, London-Paris",
      after:  "Pages 23–47, 9 AM–5 PM, London–Paris",
      beforeLabel: "Hyphens stand in for ranges",
      afterLabel: "En dashes signal ranges and relationships",
      cases: [
        "Numeric ranges: pages 23–47, 1954–2020",
        "Time spans: 9 AM–5 PM",
        "Compound modifiers with a complete unit: post–World War II",
        "Routes and connections: New York–London"
      ]
    },
    {
      id: "hyphen",
      name: "Hyphen-minus",
      unicode: "U+002D",
      char: "-",
      category: "dashes",
      token: "hyphen",
      mac: "Hyphen key",
      win: "Hyphen key",
      before: "well known author, mother in law, over the counter",
      after:  "well-known author, mother-in-law, over-the-counter",
      beforeLabel: "Compounds left open",
      afterLabel: "Hyphenated compound modifiers",
      cases: [
        "Compound modifiers before a noun: well-known author",
        "Compound nouns: mother-in-law, son-in-law",
        "Hyphenated names: Mary-Jane, Jean-Luc",
        "Soft line-end breaks in justified text"
      ]
    },
    {
      id: "nb-hyphen",
      name: "Non-breaking hyphen",
      unicode: "U+2011",
      char: "‑",
      category: "dashes",
      token: "nb-hyphen",
      mac: "Insert special character",
      win: "Insert special character",
      before: "mother-in-law of the bride",
      after:  "mother‑in‑law of the bride",
      beforeLabel: "Compound risks breaking at a narrow measure",
      afterLabel: "Locked together regardless of line width",
      cases: [
        "Compound names and surnames: Lévi‑Strauss",
        "Product codes, ISBNs, telephone numbers",
        "Compounds that read wrong when broken: jack‑o‑lantern"
      ]
    },
    {
      id: "soft-hyphen",
      name: "Soft hyphen",
      unicode: "U+00AD",
      char: "­",
      category: "hidden",
      token: "soft-hyphen",
      mac: "⌘ + Hyphen",
      win: "Ctrl + Hyphen",
      before: "antidisestablishmentarianism",
      after:  "anti­dis­estab­lish­men­tar­ian­ism",
      beforeLabel: "No break points — pushes the measure",
      afterLabel: "Invisible break points appear only when needed",
      cases: [
        "Long technical or foreign words that risk rivers in justified text",
        "Suggesting preferred syllable breaks when auto-hyphenation is wrong",
        "Brand or proper nouns with custom break rules"
      ]
    }
  ];

  // ─── DOM hooks ──────────────────────────────────────────────────────────

  const root = document.querySelector(".ws-demo");
  if (!root) return;

  const grid = root.querySelector(".ws-grid");
  const search = root.querySelector(".ws-search");
  const filterButtons = root.querySelectorAll(".ws-filter");
  const measure = root.querySelector(".ws-slider");
  const measureOut = root.querySelector(".ws-slider-value");
  const highlight = root.querySelector(".ws-toggle");
  const playgroundInput = root.querySelector(".ws-playground__input");
  const insertButtons = root.querySelector(".ws-playground__inserts");
  const counter = root.querySelector(".ws-playground__counter");

  // ─── Marker rendering ──────────────────────────────────────────────────
  // Wrap each special character in a token span so CSS can swap the glyph
  // when the highlight toggle is on. Non-special characters render as
  // ordinary text nodes. Keys are distinct Unicode codepoints even though
  // many render as a visually-identical space — JS keys them by codepoint,
  // not by visual appearance, so the map is unambiguous at runtime.

  const TOKENS = {
    " ":      "space",
    " ": "nbsp",
    "\t":     "tab",
    "\n":     "line-break",
    " ": "em-space",
    " ": "en-space",
    " ": "thin-space",
    " ": "hair-space",
    "​": "zwsp",
    "­": "soft-hyphen",
    "‑": "nb-hyphen",
    "—":      "em-dash",
    "–":      "en-dash"
  };

  function markText(text) {
    const out = document.createDocumentFragment();
    let buf = "";
    for (const ch of text) {
      const tok = TOKENS[ch];
      if (tok) {
        if (buf) { out.appendChild(document.createTextNode(buf)); buf = ""; }
        const span = document.createElement("span");
        span.className = "ws-tok ws-tok--" + tok;
        span.setAttribute("data-c", ch);
        if (tok === "line-break") {
          out.appendChild(span);
          out.appendChild(document.createElement("br"));
          continue;
        }
        out.appendChild(span);
      } else {
        buf += ch;
      }
    }
    if (buf) out.appendChild(document.createTextNode(buf));
    return out;
  }

  function renderMarked(target, text) {
    target.innerHTML = "";
    target.appendChild(markText(text));
  }

  // ─── Cards ──────────────────────────────────────────────────────────────

  function makeCard(c) {
    const card = document.createElement("article");
    card.className = "ws-card";
    card.dataset.category = c.category;
    card.dataset.id = c.id;
    card.dataset.name = c.name.toLowerCase();
    card.dataset.unicode = c.unicode.toLowerCase();

    const header = document.createElement("header");
    header.className = "ws-card__header";
    header.innerHTML = `
      <h3 class="ws-card__name">${c.name}</h3>
      <code class="ws-card__code">${c.unicode}</code>
    `;
    card.appendChild(header);

    const shortcuts = document.createElement("dl");
    shortcuts.className = "ws-card__shortcuts";
    shortcuts.innerHTML = `
      <dt>Mac</dt><dd><kbd>${c.mac}</kbd></dd>
      <dt>Win</dt><dd><kbd>${c.win}</kbd></dd>
    `;
    card.appendChild(shortcuts);

    const examples = document.createElement("div");
    examples.className = "ws-card__examples";
    examples.innerHTML = `
      <div class="ws-example">
        <span class="ws-example__label">Without</span>
        <div class="ws-example__body ws-mark" data-text></div>
      </div>
      <div class="ws-example">
        <span class="ws-example__label">With</span>
        <div class="ws-example__body ws-mark" data-text></div>
      </div>
    `;
    const [withoutBody, withBody] = examples.querySelectorAll("[data-text]");
    withoutBody.textContent = c.before;
    withBody.textContent = c.after;
    examples.querySelectorAll(".ws-example")[0].setAttribute("data-note", c.beforeLabel);
    examples.querySelectorAll(".ws-example")[1].setAttribute("data-note", c.afterLabel);
    card.appendChild(examples);

    if (c.cases && c.cases.length) {
      const ul = document.createElement("ul");
      ul.className = "ws-card__cases";
      for (const item of c.cases) {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      }
      card.appendChild(ul);
    }

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "ws-copy";
    copy.dataset.copy = c.char;
    copy.setAttribute("aria-label", "Copy " + c.name);
    copy.title = "Copy " + c.name;
    copy.innerHTML = COPY_ICON_SVG;
    card.appendChild(copy);

    const deeplink = document.createElement("a");
    deeplink.className = "ws-deeplink";
    deeplink.href = "#ws-playground";
    deeplink.dataset.deeplinkId = c.id;
    deeplink.textContent = "Use " + c.name + " in playground →";
    card.appendChild(deeplink);

    return card;
  }

  // Inline SVG icons (currentColor, scale with text)
  const COPY_ICON_SVG = '<svg class="ws-copy__icon" viewBox="0 0 16 16" aria-hidden="true">' +
    '<rect x="2" y="4" width="9" height="11" fill="none" stroke="currentColor" stroke-width="1"/>' +
    '<rect x="5" y="1" width="9" height="11" fill="none" stroke="currentColor" stroke-width="1"/>' +
    '</svg>';

  const CHECK_ICON_SVG = '<svg class="ws-copy__icon" viewBox="0 0 16 16" aria-hidden="true">' +
    '<polyline points="3,8.5 7,12.5 13,4" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
    '</svg>';

  function buildGrid() {
    grid.innerHTML = "";
    for (const c of CHARACTERS) grid.appendChild(makeCard(c));
    refreshMarkers();
  }

  // ─── Marker swap on toggle ──────────────────────────────────────────────

  function refreshMarkers() {
    const marks = root.querySelectorAll(".ws-mark");
    marks.forEach(function (el) {
      if (!el.dataset.original) el.dataset.original = el.textContent;
      renderMarked(el, el.dataset.original);
    });
  }

  // ─── Filtering ──────────────────────────────────────────────────────────

  function applyFilter() {
    const q = (search.value || "").trim().toLowerCase();
    const active = root.querySelector('.ws-filter[aria-pressed="true"]');
    const cat = active ? active.dataset.category : "all";
    const cards = grid.querySelectorAll(".ws-card");
    cards.forEach(function (card) {
      const matchesCat = cat === "all" || card.dataset.category === cat;
      const haystack = card.dataset.name + " " + card.dataset.unicode;
      const matchesQ = !q || haystack.indexOf(q) !== -1;
      card.hidden = !(matchesCat && matchesQ);
    });
  }

  function setActiveFilter(btn) {
    filterButtons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    applyFilter();
  }

  filterButtons.forEach(function (b) {
    b.addEventListener("click", function () { setActiveFilter(b); });
  });
  if (search) search.addEventListener("input", applyFilter);

  // ─── Measure slider ─────────────────────────────────────────────────────

  function applyMeasure() {
    const v = measure.value;
    root.style.setProperty("--demo-measure", v + "ch");
    if (measureOut) measureOut.textContent = v + " ch";
  }
  if (measure) {
    measure.addEventListener("input", applyMeasure);
    applyMeasure();
  }

  // ─── Highlight toggle ───────────────────────────────────────────────────

  function applyHighlight() {
    root.dataset.marked = highlight.checked ? "true" : "false";
  }
  if (highlight) {
    highlight.addEventListener("change", applyHighlight);
    applyHighlight();
  }

  // ─── Copy buttons ───────────────────────────────────────────────────────

  root.addEventListener("click", function (e) {
    const btn = e.target.closest(".ws-copy");
    if (!btn) return;
    const ch = btn.dataset.copy;
    if (typeof ch !== "string") return;
    const ok = function () {
      const prevLabel = btn.getAttribute("aria-label") || "Copy character";
      btn.classList.add("ws-copy--copied");
      btn.innerHTML = CHECK_ICON_SVG;
      btn.setAttribute("aria-label", "Copied");
      setTimeout(function () {
        btn.classList.remove("ws-copy--copied");
        btn.innerHTML = COPY_ICON_SVG;
        btn.setAttribute("aria-label", prevLabel);
      }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ch).then(ok).catch(function () { fallbackCopy(ch); ok(); });
    } else {
      fallbackCopy(ch);
      ok();
    }
  });

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_) {}
    document.body.removeChild(ta);
  }

  // ─── Playground ─────────────────────────────────────────────────────────

  function makeInsertButtons() {
    if (!insertButtons) return;
    insertButtons.innerHTML = "";
    for (const c of CHARACTERS) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ws-insert";
      b.dataset.insert = c.char;
      b.title = c.name + " · " + c.unicode;
      b.textContent = shortLabel(c);
      insertButtons.appendChild(b);
    }
  }

  function shortLabel(c) {
    if (c.id === "space") return "␣";
    if (c.id === "nbsp") return "NBSP";
    if (c.id === "tab") return "TAB";
    if (c.id === "line-break") return "↵";
    if (c.id === "paragraph-break") return "¶";
    if (c.id === "em-space") return "EM␣";
    if (c.id === "en-space") return "EN␣";
    if (c.id === "thin-space") return "THIN␣";
    if (c.id === "hair-space") return "HAIR␣";
    if (c.id === "zwsp") return "ZWSP";
    if (c.id === "em-dash") return "—";
    if (c.id === "en-dash") return "–";
    if (c.id === "hyphen") return "-";
    if (c.id === "nb-hyphen") return "‑NB";
    if (c.id === "soft-hyphen") return "SHY";
    return c.char;
  }

  function insertAtCursor(input, text) {
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const v = input.value;
    input.value = v.slice(0, start) + text + v.slice(end);
    const pos = start + text.length;
    input.setSelectionRange(pos, pos);
    input.focus();
    updateCounter();
    refreshPlaygroundPreview();
  }

  if (insertButtons) {
    insertButtons.addEventListener("click", function (e) {
      const b = e.target.closest(".ws-insert");
      if (!b) return;
      insertAtCursor(playgroundInput, b.dataset.insert);
    });
  }

  function updateCounter() {
    if (!counter || !playgroundInput) return;
    const v = playgroundInput.value;
    const total = [...v].length;
    const spaces = (v.match(/ /g) || []).length;
    const nbsps = (v.match(/ /g) || []).length;
    const shys = (v.match(/­/g) || []).length;
    const breaks = (v.match(/\n/g) || []).length;
    counter.textContent =
      total + " chars · " +
      spaces + " spaces · " +
      nbsps + " NBSP · " +
      shys + " soft hyphens · " +
      breaks + " line breaks";
  }

  const playgroundPreview = root.querySelector(".ws-playground__preview");
  function refreshPlaygroundPreview() {
    if (!playgroundPreview || !playgroundInput) return;
    renderMarked(playgroundPreview, playgroundInput.value);
  }

  if (playgroundInput) {
    playgroundInput.addEventListener("input", function () {
      updateCounter();
      refreshPlaygroundPreview();
    });
    updateCounter();
  }

  // ─── Mobile: "Use in playground →" deep-link ───────────────────────────

  function wireMobileDeepLinks() {
    root.addEventListener("click", function (e) {
      const link = e.target.closest(".ws-deeplink");
      if (!link) return;
      const id = link.dataset.deeplinkId;
      const c = CHARACTERS.find(function (x) { return x.id === id; });
      if (!c || !playgroundInput) return;
      insertAtCursor(playgroundInput, c.char);
      // The anchor jumps to #ws-playground; defer focus so iOS keyboards
      // don't fight the scroll.
      setTimeout(function () { playgroundInput.focus(); }, 250);
    });
  }

  // ─── Mobile: Web Share API (progressive enhancement) ───────────────────
  // Long-press a copy icon → system share sheet (where supported).
  // Default tap behaviour (clipboard) is unaffected.

  function wireShareSheet() {
    if (typeof navigator === "undefined" || !navigator.share) return;
    let timer = null;
    let triggered = false;

    function start(e) {
      const btn = e.target.closest(".ws-copy");
      if (!btn) return;
      triggered = false;
      timer = setTimeout(function () {
        triggered = true;
        const ch = btn.dataset.copy;
        const name = btn.getAttribute("aria-label") || "character";
        navigator.share({ text: ch, title: name }).catch(function () {});
      }, 550);
    }
    function cancel() {
      if (timer) { clearTimeout(timer); timer = null; }
    }
    root.addEventListener("pointerdown", start, { passive: true });
    root.addEventListener("pointerup", cancel);
    root.addEventListener("pointercancel", cancel);
    root.addEventListener("pointerleave", cancel);
    // If the share sheet fired, swallow the trailing click so the clipboard
    // path doesn't also run.
    root.addEventListener("click", function (e) {
      if (!triggered) return;
      if (!e.target.closest(".ws-copy")) return;
      e.stopPropagation();
      e.preventDefault();
      triggered = false;
    }, true);
  }

  // ─── Init ──────────────────────────────────────────────────────────────

  buildGrid();
  makeInsertButtons();
  refreshPlaygroundPreview();
  wireMobileDeepLinks();
  wireShareSheet();

  // Mark hydrated so CSS can hide the no-script fallback / show controls.
  root.setAttribute("data-hydrated", "true");
})();
