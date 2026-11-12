// Tap-to-zoom for publication spreads, and for the pictures a narrow screen
// shows smaller than they are (a page marks those img[data-enlarge]).
// Tapping one opens it full screen at the best resolution the build made.
// Tap the image to zoom in on the spot you tapped, drag to look around, and tap
// again to fit it back to the screen. Pinch-zoom still works on top of that.
(function () {
  var images = document.querySelectorAll('.spread-grid img, img[data-enlarge]');
  if (!images.length || typeof HTMLDialogElement !== 'function') return;

  var ZOOM = 2.5; // how much bigger than "fit to screen" a tap makes it
  var narrow = window.matchMedia('(max-width: 860px)'); // the same break as the page's miniatures (style.css)

  var dialog = document.createElement('dialog');
  dialog.className = 'zoom';
  dialog.setAttribute('aria-label', 'Enlarged image');
  dialog.innerHTML =
    '<div class="zoom__stage"></div>' +
    '<button type="button" class="zoom__close" aria-label="Close enlarged image">✕</button>' +
    '<p class="zoom__hint label" aria-hidden="true">Tap to zoom · tap again to fit</p>';
  document.body.appendChild(dialog);

  var stage = dialog.querySelector('.zoom__stage');
  var hint = dialog.querySelector('.zoom__hint');
  var current = null; // the <img> inside the dialog

  function open(img) {
    // Copy the whole <picture>, so the AVIF/WebP sources come along. A large
    // `sizes` makes the browser pick the biggest file (1600px) instead of the
    // small one the page layout needed.
    var original = img.closest('picture') || img;
    var copy = original.cloneNode(true);
    var parts = copy.tagName === 'IMG' ? [copy] : [...copy.querySelectorAll('source, img')];
    parts.forEach(function (el) {
      el.setAttribute('sizes', '(max-width: 768px) 300vw, 100vw');
      ['style', 'class', 'loading', 'role', 'tabindex', 'aria-label', 'data-enlarge', 'data-reveal'].forEach(function (a) { el.removeAttribute(a); });
    });

    stage.replaceChildren(copy);
    current = copy.tagName === 'IMG' ? copy : copy.querySelector('img');
    stage.classList.remove('is-zoomed');
    hint.hidden = false;
    dialog.showModal();
  }

  function toggleZoom(e) {
    var img = current;
    if (!img) return;

    if (stage.classList.contains('is-zoomed')) {
      stage.classList.remove('is-zoomed');
      img.style.width = '';
      return;
    }

    // Remember where on the image the tap landed (as a fraction), zoom, then
    // scroll so that same spot sits under the finger
    var r = img.getBoundingClientRect();
    var fx = (e.clientX - r.left) / r.width;
    var fy = (e.clientY - r.top) / r.height;
    if (!(fx >= 0 && fx <= 1)) fx = 0.5; // keyboard "clicks" have no position
    if (!(fy >= 0 && fy <= 1)) fy = 0.5;

    img.style.width = r.width * ZOOM + 'px';
    stage.classList.add('is-zoomed');
    hint.hidden = true;

    var z = img.getBoundingClientRect();
    stage.scrollLeft = fx * z.width - stage.clientWidth / 2;
    stage.scrollTop = fy * z.height - stage.clientHeight / 2;
  }

  stage.addEventListener('click', function (e) {
    if (e.target === current) toggleZoom(e);
    else if (!stage.classList.contains('is-zoomed')) dialog.close(); // tap the empty space around the image
  });

  dialog.querySelector('.zoom__close').addEventListener('click', function () { dialog.close(); });

  // Free the big file once closed
  dialog.addEventListener('close', function () {
    stage.replaceChildren();
    current = null;
  });

  // A spread is always a button: tappable, focusable, and announced as one. A
  // picture marked data-enlarge is one only on a narrow screen, where the page
  // shows it smaller than the screen it came from; wide, it is already at size,
  // so it stays a plain picture (no extra tab stops, no zoom cursor).
  function armed(img) {
    return !img.hasAttribute('data-enlarge') || narrow.matches;
  }

  function sync() {
    images.forEach(function (img) {
      if (armed(img)) {
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Enlarge: ' + img.alt);
      } else {
        ['tabindex', 'role', 'aria-label'].forEach(function (a) { img.removeAttribute(a); });
      }
    });
  }

  images.forEach(function (img) {
    img.addEventListener('click', function () { if (armed(img)) open(img); });
    img.addEventListener('keydown', function (e) {
      if (armed(img) && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        open(img);
      }
    });
  });

  narrow.addEventListener('change', sync);
  sync();
})();
