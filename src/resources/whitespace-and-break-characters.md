---
title: "Whitespace & Break Characters"
tagline: A working reference for the invisible glyphs that do the typesetting
type: Article
order: 1
published: true
coverImage: /assets/images/resources/whitespace-cover.svg
description: A visual-first reference and interactive playground for whitespace and break characters in digital and print typography — non-breaking spaces, dashes, soft hyphens, and the rest of the family.
permalink: /resources/whitespace-and-break-characters/
---

<div class="article-body">

The invisible glyphs do the typesetting. A non-breaking space holds *Dr. Smith* together when the line wraps. A soft hyphen quietly breaks *antidisestablishmentarianism* without leaving a scar in justified type. An en dash separates *1954–2020* the way a hyphen never should. Most of these characters share a single visual signature — empty space — but they each carry a different instruction to the line-breaking engine.

<blockquote class="pull-quote">
You can read a body of text and never see them. You can read it badly because they aren't there.
<cite>— a working principle</cite>
</blockquote>

This is a reference, not an essay. The interactive playground below lets you toggle every whitespace and break character on, see where it sits, watch how it behaves at different measures, and copy it for use in your own work. The cheat sheet at the end gives the whole inventory in one table.

<h2 id="interactive-reference">Interactive reference</h2>

<p>Each card shows the character in a real before/after, the keyboard shortcut, and the contexts it belongs in. Use the toolbar to filter by category, narrow the measure to see line-breaking behaviour, and turn on the highlight toggle to render every invisible character as a visible mark.</p>

<div class="ws-demo full-bleed">
  <div class="ws-demo__inner">
    <noscript>
      <div class="ws-demo__nojs">The interactive reference requires JavaScript. The cheat sheet near the end of the article contains the same information in static form.</div>
    </noscript>

    <div class="ws-toolbar" role="toolbar" aria-label="Whitespace demo controls">
      <div class="ws-toolbar__row ws-toolbar__row--filters">
        <input type="search" class="ws-search" placeholder="Search name or codepoint" aria-label="Search characters">
        <button type="button" class="ws-filter" data-category="all" aria-pressed="true">All</button>
        <button type="button" class="ws-filter" data-category="spacing" aria-pressed="false">Spacing</button>
        <button type="button" class="ws-filter" data-category="breaks" aria-pressed="false">Breaks</button>
        <button type="button" class="ws-filter" data-category="dashes" aria-pressed="false">Dashes</button>
        <button type="button" class="ws-filter" data-category="hidden" aria-pressed="false">Hidden</button>
      </div>
      <div class="ws-toolbar__row ws-toolbar__row--controls">
        <label class="ws-slider-group">
          Measure
          <input type="range" class="ws-slider" min="14" max="80" value="40" step="2" aria-label="Example column width in characters">
          <span class="ws-slider-value">40 ch</span>
        </label>
        <label class="ws-toggle-group">
          Highlight
          <input type="checkbox" class="ws-toggle" aria-label="Highlight invisible characters">
        </label>
      </div>
    </div>

    <div class="ws-grid" aria-live="polite"></div>

    <section id="ws-playground" class="ws-playground" aria-label="Whitespace playground">
      <h3 class="ws-playground__heading">Playground</h3>
      <div class="ws-playground__inserts" aria-label="Insert character"></div>
      <textarea class="ws-playground__input" rows="5" placeholder="Type or paste text here, then insert characters with the buttons above. The preview below shows the same text at the current measure — turn highlight on to see every whitespace and break character."></textarea>
      <span class="ws-playground__preview-label">Preview at <span class="ws-slider-value">40 ch</span></span>
      <div class="ws-playground__preview" aria-live="polite"></div>
      <p class="ws-playground__counter">0 chars · 0 spaces · 0 NBSP · 0 soft hyphens · 0 line breaks</p>
    </section>
  </div>
</div>

<h2 id="digital">Best practices — digital</h2>

<h3>Bind units, names and references</h3>

Use a non-breaking space wherever a wrap between two tokens would read as an error. Common bindings: number and unit (*50 km*, *8 GB*, *12 px*), title and surname (*Dr. Smith*), initial and surname (*J. F. Kennedy*), currency symbol and amount (*€ 49*), cross-reference and number (*figure 4*, *section 2.1*). In HTML, `&nbsp;` and the literal Unicode character are equivalent; CSS `white-space: nowrap` is the right tool for longer phrases.

<h3>Break long strings with zero-width spaces, not hyphens</h3>

Long URLs, hashes, and identifiers should wrap without leaving a stray hyphen behind. Insert `U+200B` zero-width spaces at logical boundaries. For HTML, `<wbr>` is the semantic equivalent and is preferred in markup; reserve `U+200B` for content that travels as plain text.

<h3>Pick one em-dash style and hold it</h3>

The em dash has two common settings: unspaced (US, *life — and death*: incorrect, *life—and death*: correct) or thin-spaced (UK, *life — and death*). Mixing styles within a body of work is the visible mistake. Pick one in the typography spec and let no character through that doesn't match.

<h3>En dash for ranges, never a hyphen</h3>

*Pages 23–47*, not *23-47*. *Monday–Friday*, *9 AM–5 PM*, *post–World War II*. The hyphen-minus reads as a compound; the en dash reads as a span. If the range begins with the word *from* or *between*, use *to* and *and* instead — a dash with a leading preposition is a parsing failure.

<h3>Use the proper minus sign in technical text</h3>

`U+2212` (the Unicode minus sign) is wider than a hyphen-minus and aligns with the mathematical glyphs. Code editors, spreadsheets, and most prose can survive on hyphen-minus; published technical typography should not.

<h3>Mind the screen reader</h3>

A non-breaking space reads identically to a space. A zero-width space and a soft hyphen are usually skipped silently. An em dash is read aloud in many configurations — if the rhythm of your prose depends on it, test what it sounds like.

<h3>Avoid the double space</h3>

The convention of two spaces after a sentence belonged to monospaced typewriters. Modern fonts give sentence-end punctuation its own kerning. One space, always.

<h2 id="print">Best practices — print (InDesign / Affinity Publisher)</h2>

<h3>Show hidden characters by default while you typeset</h3>

In both apps, enable hidden character visualisation early and keep it on. Most line-breaking problems are caused by a regular space where a non-breaking one belongs.

<h3>Lock compound surnames and titles with non-breaking hyphens</h3>

*Lévi‑Strauss*, *Saint‑Exupéry*, *Henri‑Cartier Bresson* — the hyphen is part of the name and must not be the line-break point. Use `U+2011` (non-breaking hyphen) inside the compound. Same rule for ISBNs, telephone numbers, and product codes.

<h3>Use discretionary hyphens to fix justified rivers</h3>

When a justified paragraph develops gaps or a river of whitespace, the fix is rarely a different font size. Walk the offending lines and place soft hyphens at preferred break points. The hyphen only appears when the engine actually needs to break the word.

<h3>Spaces around dashes — pick a tradition</h3>

UK style sets the em dash with thin spaces on either side. US style uses no spaces. French style replaces the em dash with an en dash and adds full spaces (*— Marcel Proust*). InDesign and Affinity both let you build this into a paragraph style with GREP find/change. Define it once.

<h3>Figure spaces in tabular numerals</h3>

`U+2007` figure space is the width of a digit. Use it to right-align figures inside running text without switching to a table — e.g. when you want price columns to align in a prose paragraph. Pair with tabular numerals (`font-variant-numeric: tabular-nums` on the web).

<h3>En spaces and footnote markers</h3>

A leading en space before a superscript footnote marker reads cleaner than a regular space and prevents the marker from dropping onto the next line. In long-form editorial, this is a body-text-level decision, not a per-paragraph one — bake it into the style.

<h3>French narrow no-break before colons, semicolons, question marks, exclamation marks</h3>

French typography requires a narrow no-break space (`U+202F`) before `: ; ! ?`. InDesign and Affinity Publisher both honour locale settings; if a French paragraph is set inside an English document, the space won't be inserted automatically — apply it manually or via a GREP rule.

<h3>Optical margin alignment for hanging punctuation</h3>

Quotation marks, commas, periods, and hyphens at the start or end of a line look misaligned against the left or right edge of the column. Both apps include optical margin alignment for this — enable it on the paragraph style, set the strength conservatively, and let it pull punctuation into the gutter.

<h2 id="cross-cutting">Cross-cutting</h2>

<h3>Widows and orphans</h3>

A single word on the last line of a paragraph is a widow. A single line at the top or bottom of a column is an orphan. Catch them at typesetting time, not at proof time — most fixes are a non-breaking space at the right place earlier in the paragraph (pulling two tokens together so the last line carries more weight), not a rewrite.

<h3>Smart-quote pairing</h3>

Curly opening and closing quotes (`“ ”`, `‘ ’`) must pair. A straight quote inside running text is a typesetting mistake. The exceptions are real (code, raw measurements: *6′ 2″*), and they should declare themselves with monospaced type or italics, not by abandoning the rule.

<h3>Currency, amount, and unit</h3>

Currency symbol and amount bind with a non-breaking space (or no space at all, depending on the locale and the currency). Amount and unit bind the same way. *$ 99.99* and *99.99 USD* both work; *$99.99* works; *$ 99 . 99* does not.

<h3>Locale conventions</h3>

Thousands separators, decimal markers, quotation marks, and the space before punctuation all vary by language. The rule is to set them by paragraph style or by locale, not by typing them on demand. Consistency at the document level is invisible; inconsistency is the only thing readers notice.

<h2 id="cheat-sheet">Cheat sheet</h2>

<table class="cheat-sheet">
  <thead>
    <tr><th>Glyph</th><th>Name</th><th>Codepoint</th><th>Mac</th><th>Windows</th><th>Primary use</th></tr>
  </thead>
  <tbody>
    <tr><td><code> </code></td><td>Space</td><td><code>U+0020</code></td><td>Spacebar</td><td>Spacebar</td><td>Word separator</td></tr>
    <tr><td><code>&nbsp;</code></td><td>Non-breaking space</td><td><code>U+00A0</code></td><td>⌥ Space</td><td>Ctrl Shift Space</td><td>Lock two tokens together</td></tr>
    <tr><td><code>→</code></td><td>Tab</td><td><code>U+0009</code></td><td>Tab</td><td>Tab</td><td>Indent / align columns</td></tr>
    <tr><td><code>↵</code></td><td>Line break</td><td><code>U+000A</code></td><td>⇧ Return</td><td>Shift Enter</td><td>Soft return inside a paragraph</td></tr>
    <tr><td><code>¶</code></td><td>Paragraph break</td><td><code>U+000D</code></td><td>Return</td><td>Enter</td><td>New paragraph</td></tr>
    <tr><td><code> </code></td><td>Em space</td><td><code>U+2003</code></td><td>⇧⌘ M</td><td>Shift Ctrl M</td><td>Wide pause / first-line indent</td></tr>
    <tr><td><code> </code></td><td>En space</td><td><code>U+2002</code></td><td>⇧⌘ N</td><td>Shift Ctrl N</td><td>Medium pause</td></tr>
    <tr><td><code> </code></td><td>Thin space</td><td><code>U+2009</code></td><td>—</td><td>—</td><td>Around dashes, before units</td></tr>
    <tr><td><code> </code></td><td>Hair space</td><td><code>U+200A</code></td><td>—</td><td>—</td><td>Optical balance only</td></tr>
    <tr><td><code>▢</code></td><td>Zero-width space</td><td><code>U+200B</code></td><td>—</td><td>—</td><td>Invisible break point</td></tr>
    <tr><td><code>—</code></td><td>Em dash</td><td><code>U+2014</code></td><td>⇧⌥ -</td><td>Alt 0151</td><td>Parenthetical / break</td></tr>
    <tr><td><code>–</code></td><td>En dash</td><td><code>U+2013</code></td><td>⌥ -</td><td>Alt 0150</td><td>Ranges and relationships</td></tr>
    <tr><td><code>-</code></td><td>Hyphen-minus</td><td><code>U+002D</code></td><td>-</td><td>-</td><td>Compounds, line-end breaks</td></tr>
    <tr><td><code>‑</code></td><td>Non-breaking hyphen</td><td><code>U+2011</code></td><td>—</td><td>—</td><td>Locked compound</td></tr>
    <tr><td><code>·-·</code></td><td>Soft hyphen</td><td><code>U+00AD</code></td><td>⌘ -</td><td>Ctrl -</td><td>Suggested break point</td></tr>
  </tbody>
</table>

<h2 id="further-reading">Further reading</h2>

- Matthew Butterick, *Practical Typography* — particularly the chapters on dashes, ellipses, and hyphenation.
- Robert Bringhurst, *The Elements of Typographic Style* — the canonical treatment of line-breaking, hyphenation, and the dashes.
- Unicode Technical Report 14, *Unicode Line Breaking Algorithm* — the formal rules every line-breaking engine implements.
- W3C, *Internationalization Best Practices* — locale-specific space and punctuation conventions.

</div>

<script src="/assets/js/whitespace-demo.js" defer></script>
