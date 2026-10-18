// Craft experiment, the CV on a phone: each entry folds to its header (dates,
// role, client, a line about it) and opens on a tap. A group (Zindua) folds
// to its header and its projects' titles. The folding is phone-only CSS
// (.is-open under "CV on a phone" in craft.css), so on a wider screen
// everything shows whatever the state. Entries are folded from the first
// paint (html.js, set in the page head), and a folded entry's images are
// lazy and not rendered, so they are only fetched once it opens.
// Without JS, every entry is open.
(() => {
  // the entries in the list, not the projects inside a group
  const entries = [...document.querySelectorAll(".entry")].filter((e) => !e.parentElement.closest(".entry"));
  if (!entries.length) return;

  // craft-snap.js re-measures on "toggle" (it listens for <details>)
  const resnap = (el) => el.dispatchEvent(new Event("toggle"));

  function setOpen(entry, open) {
    const button = entry.querySelector(".entry__toggle");
    if (!button) return;
    entry.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    resnap(entry);
  }

  for (const entry of entries) {
    const head = entry.querySelector(".entry__meta");
    const body = entry.querySelector(".entry__body");
    if (!head || !body) continue;
    body.id ||= `${entry.id}-more`;
    const title = head.querySelector("h2, h3");
    const client = head.querySelector(".entry__client");

    // One button over the whole header (a group's: the whole folded entry,
    // titles too), so the row is the target; its name is the role and client
    const button = document.createElement("button");
    button.type = "button";
    button.className = "entry__toggle";
    button.setAttribute("aria-controls", body.id);
    button.setAttribute("aria-expanded", "false");
    const name = document.createElement("span");
    name.className = "vh";
    name.textContent = [title?.textContent, client?.textContent].filter(Boolean).join(", ");
    button.append(name);
    button.insertAdjacentHTML("beforeend", '<span class="go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>');
    button.addEventListener("click", () => setOpen(entry, !entry.classList.contains("is-open")));
    head.append(button);
  }

  // A link to an entry, or a project inside one (#jireh, #edm), opens it
  function openTarget() {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const entry = target && entries.find((e) => e.contains(target));
    if (!entry) return;
    setOpen(entry, true);
    // the browser jumped before the entries above it folded: jump again
    target.scrollIntoView();
  }
  addEventListener("hashchange", openTarget);
  openTarget();
})();
