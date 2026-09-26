/* Experimental homepage + resume — shared behaviour.
   Everything here is progressive enhancement: without JS the pages still
   scroll, swipe (native scroll-snap) and read completely. */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var root = document.documentElement;

  /* ---------- Top bar: hide on scroll down, reveal on scroll up ---------- */
  var bar = document.querySelector('[data-topbar]');
  if (bar) {
    var lastY = window.scrollY, ticking = false;
    var setOffset = function () {
      var hidden = bar.classList.contains('is-hidden');
      root.style.setProperty('--topbar-offset', hidden ? '0px' : bar.offsetHeight + 'px');
    };
    var onScroll = function () {
      var y = window.scrollY, dy = y - lastY;
      if (Math.abs(dy) > 6) {
        // Stay visible near the top and while anything inside has focus.
        var hide = dy > 0 && y > bar.offsetHeight * 2 && !bar.contains(document.activeElement);
        bar.classList.toggle('is-hidden', hide);
        setOffset();
        lastY = y;
      }
      bar.classList.toggle('is-scrolled', y > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    bar.addEventListener('focusin', function () { bar.classList.remove('is-hidden'); setOffset(); });
    window.addEventListener('resize', setOffset);
    setOffset();
  }

  /* ---------- Project displays: counter, scrub track, prev/next ---------- */
  document.querySelectorAll('[data-display]').forEach(function (el) {
    var track = el.querySelector('.display__track');
    var slides = Array.prototype.slice.call(track.children);
    var cur = el.querySelector('[data-cur]');
    var segs = el.querySelectorAll('.display__scrub span');
    var prev = el.querySelector('[data-prev]');
    var next = el.querySelector('[data-next]');
    if (slides.length < 2) return;

    function activeIndex() {
      // The slide whose left edge is nearest the track's left edge.
      var left = track.getBoundingClientRect().left, best = 0, bestD = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.getBoundingClientRect().left - left);
        if (d < bestD) { bestD = d; best = i; }
      });
      // At the far end, the last slide may never reach the left edge.
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) best = slides.length - 1;
      return best;
    }
    function update() {
      var i = activeIndex();
      if (cur) cur.textContent = i + 1;
      segs.forEach(function (s, k) { s.classList.toggle('is-on', k === i); s.classList.toggle('is-seen', k < i); });
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }
    // While a smooth scroll is in flight, count from where it is heading,
    // not from wherever it has got to — otherwise quick taps skip slides.
    var pending = null, settle = 0;
    function go(dir) {
      var from = pending !== null ? pending : activeIndex();
      var i = Math.max(0, Math.min(slides.length - 1, from + dir));
      pending = i;
      var target = slides[i].offsetLeft - slides[0].offsetLeft;
      track.scrollTo({ left: target, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    var raf = 0;
    track.addEventListener('scroll', function () {
      cancelAnimationFrame(raf); raf = requestAnimationFrame(update);
      clearTimeout(settle); settle = setTimeout(function () { pending = null; }, 140);
    }, { passive: true });
    window.addEventListener('resize', update);
    // Images load lazily, so widths change after first paint.
    track.querySelectorAll('img').forEach(function (img) { img.addEventListener('load', update); });
    update();
  });

  /* ---------- Resume: section index scroll-spy + reading progress ---------- */
  var spy = document.querySelector('[data-spy]');
  if (spy) {
    var links = Array.prototype.slice.call(spy.querySelectorAll('a[href^="#"]'));
    var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var progress = spy.querySelector('.cv-index-nav__progress');

    var lastIdx = -2;
    var updateSpy = function () {
      // Pick the last section whose top has passed 35% of the viewport.
      var line = window.innerHeight * 0.35, idx = -1;
      sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < line) idx = i; });
      if (idx === lastIdx) return;
      lastIdx = idx;
      links.forEach(function (a, i) {
        if (i === idx) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      // Keep the active chip visible in the horizontally scrollable index.
      if (idx > -1) {
        var a = links[idx], row = a.parentElement;
        if (a.offsetLeft < row.scrollLeft || a.offsetLeft + a.offsetWidth > row.scrollLeft + row.clientWidth) {
          row.scrollTo({ left: a.offsetLeft - 16, behavior: 'auto' });
        }
      }
    };

    var onProgress = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      updateSpy();
    };
    window.addEventListener('scroll', function () { requestAnimationFrame(onProgress); }, { passive: true });
    onProgress();
  }

  /* ---------- Print / Save as PDF: expand every <details> first ---------- */
  var opened = [];
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details:not([open])').forEach(function (d) { d.open = true; opened.push(d); });
  });
  window.addEventListener('afterprint', function () {
    opened.forEach(function (d) { d.open = false; }); opened = [];
  });
  document.querySelectorAll('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () { window.print(); });
  });
})();
