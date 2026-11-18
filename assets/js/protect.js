// Photos can't be dragged out of the page or saved from the right-click menu.
//
// This is a deterrent, not protection: an image has to reach the browser to be
// shown, so it can still be saved from the developer tools or a screenshot. What it
// stops is the casual drag to the desktop and "Save image as...". (The site also
// publishes only web-sized copies, never the originals: .eleventy.js.)
//
// Clicking is left alone, so an image that enlarges (spread-zoom.js) still does, and
// text, links and the rest of the page keep their right-click menu. CSS does the rest:
// "Images" in style.css switches off dragging, selecting and the press-and-hold menu on touch.
(() => {
  const isPhoto = (target) => target instanceof Element && target.closest("img, picture");

  // right-click (or the menu key) on a picture
  document.addEventListener("contextmenu", (e) => {
    if (isPhoto(e.target)) e.preventDefault();
  });

  // dragging a picture, by mouse or touch
  document.addEventListener("dragstart", (e) => {
    if (isPhoto(e.target)) e.preventDefault();
  });
})();
