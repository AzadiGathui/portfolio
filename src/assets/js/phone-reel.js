// One row of controls under every row of phone screens ({% phones %} in a
// project page): a count ("1–3 of 7"), a scroll bar and arrow buttons. Added
// here rather than in the page's HTML, so without JavaScript a row simply
// scrolls by touch, trackpad or keyboard, with the browser's own scroll bar.
// Styles: "PHONE SCREENS" in style.css.
(function () {
  var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".phone-reel").forEach(function (reel) {
    var phones = reel.querySelectorAll(".phone");
    if (phones.length < 2) return;

    var bar = document.createElement("div");
    bar.className = "phone-reel__bar";
    bar.innerHTML =
      '<span class="label phone-reel__count" aria-live="polite"></span>' +
      // The buttons and count already say where you are, so screen readers skip the bar
      '<div class="phone-reel__track" aria-hidden="true"><div class="phone-reel__thumb"></div></div>' +
      '<button type="button" class="phone-reel__btn" aria-label="Previous screens">←</button>' +
      '<button type="button" class="phone-reel__btn" aria-label="Next screens">→</button>';
    reel.after(bar);
    reel.classList.add("phone-reel--controlled");

    var count = bar.querySelector(".phone-reel__count");
    var track = bar.querySelector(".phone-reel__track");
    var thumb = bar.querySelector(".phone-reel__thumb");
    var prev = bar.querySelectorAll("button")[0];
    var next = bar.querySelectorAll("button")[1];

    // The phones fully on screen right now. The row runs to the window's edge,
    // so that edge (not the row's own box) is where a phone gets cut off.
    function fullyVisible() {
      var box = reel.getBoundingClientRect();
      var left = box.left;
      var right = Math.min(box.right, document.documentElement.clientWidth);
      var shown = [];
      phones.forEach(function (phone, i) {
        var p = phone.getBoundingClientRect();
        if (p.left >= left - 1 && p.right <= right + 1) shown.push(i);
      });
      return shown;
    }

    function maxScroll() {
      return reel.scrollWidth - reel.clientWidth;
    }

    function update() {
      var scrollable = maxScroll() > 1;
      bar.hidden = !scrollable; // every screen already fits: nothing to control
      reel.classList.toggle("phone-reel--controlled", scrollable);
      if (!scrollable) return;

      var shown = fullyVisible();
      var first = (shown.length ? shown[0] : 0) + 1;
      var last = shown.length ? shown[shown.length - 1] + 1 : first;
      count.textContent = (first === last ? first : first + "–" + last) + " of " + phones.length;

      // Thumb: as wide as the share of the row on screen, placed where it is
      var visible = reel.clientWidth / reel.scrollWidth;
      thumb.style.setProperty("--thumb-width", visible * 100 + "%");
      thumb.style.setProperty("--thumb-left", (reel.scrollLeft / maxScroll()) * (1 - visible) * 100 + "%");

      prev.disabled = reel.scrollLeft <= 1;
      next.disabled = reel.scrollLeft >= maxScroll() - 1;
    }

    // One click moves on by as many phones as are on screen (at least one),
    // so each click shows screens the reader hasn't seen yet
    function go(direction) {
      var step = phones[1].offsetLeft - phones[0].offsetLeft;
      var by = Math.max(1, fullyVisible().length) * step * direction;
      reel.scrollBy({ left: by, behavior: smooth ? "smooth" : "auto" });
    }

    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });

    // Scroll bar: a tap on the line centres the thumb there; dragging moves the
    // row with the pointer. Snapping is paused while dragging so it follows
    // smoothly, then settles on the nearest phone on release.
    var dragging = false;
    var grabOffset = 0;

    function scrollToPointer(x) {
      var box = track.getBoundingClientRect();
      var thumbWidth = thumb.getBoundingClientRect().width;
      var room = box.width - thumbWidth;
      var share = room > 0 ? (x - box.left - grabOffset) / room : 0;
      reel.scrollLeft = Math.min(1, Math.max(0, share)) * maxScroll();
    }

    track.addEventListener("pointerdown", function (e) {
      var t = thumb.getBoundingClientRect();
      var onThumb = e.clientX >= t.left && e.clientX <= t.right;
      grabOffset = onThumb ? e.clientX - t.left : t.width / 2;
      dragging = true;
      reel.style.scrollSnapType = "none";
      track.setPointerCapture(e.pointerId);
      scrollToPointer(e.clientX);
    });

    track.addEventListener("pointermove", function (e) {
      if (dragging) scrollToPointer(e.clientX);
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      reel.style.scrollSnapType = ""; // back to the stylesheet's snapping
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    var queued = false;
    function onChange() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; update(); });
    }
    reel.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange, { passive: true });
    update();
  });
})();
