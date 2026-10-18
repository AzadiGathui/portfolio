/* Experimental homepage: behaviour.
   Everything here is progressive enhancement: without JS the stack shows
   fully spread (.stack in experiment-grid.css), every project is listed and the
   header shows its role line. */
(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- The stack: open a little on load, fan out with scroll ---------- */
  var stack = document.querySelector('[data-stack]');
  if (stack) {
    var REST = 0.8;    // spread after the intro: open enough for the labels to clear each other
    var setSpread = function (v) { stack.style.setProperty('--spread', v.toFixed(3)); };

    if (reduceMotion) {
      setSpread(1);
    } else {
      // How far down the hero we are, 0 to 1, over the first ~40% of the screen
      var fromScroll = function () {
        var p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.4)));
        return REST + (1 - REST) * p;
      };
      // Intro: --spread animates from 0 (the CSS initial value) to its resting value.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { setSpread(fromScroll()); });
      });
      setTimeout(function () {
        stack.classList.add('is-live');
        var ticking = false;
        window.addEventListener('scroll', function () {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(function () { setSpread(fromScroll()); ticking = false; });
        }, { passive: true });
      }, 1400);
    }

    /* Hovering a numbered phrase (or a label) lights its layer */
    var refs = document.querySelectorAll('.hero__ref[data-layer], .stack__label[data-layer]');
    var focus = function (layer) {
      if (layer) stack.dataset.focus = layer; else delete stack.dataset.focus;
      document.querySelectorAll('.hero__ref').forEach(function (r) {
        r.classList.toggle('is-on', r.dataset.layer === layer);
      });
    };
    refs.forEach(function (el) {
      el.addEventListener('mouseenter', function () { focus(el.dataset.layer); });
      el.addEventListener('mouseleave', function () { focus(null); });
    });
  }

  /* ---------- Header: show the role once the hero's role line has gone ---------- */
  var heroRole = document.querySelector('.hero__role');
  if (heroRole && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      root.classList.toggle('role-shown', !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { rootMargin: '-72px 0px 0px 0px' }).observe(heroRole);
  } else {
    root.classList.remove('quiet-role');
  }

  /* ---------- Selected work: three now, three more as the visitor scrolls ----------
     The "Show more work" button does the same for keyboard users and when
     scrolling can't trigger it. */
  var BATCH = 3;
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-work] > .work-item'));
  var more = document.querySelector('[data-work-more]');
  if (items.length > BATCH && more) {
    var shown = BATCH, io = null;
    items.slice(BATCH).forEach(function (el) { el.hidden = true; });
    more.hidden = false;

    var showNext = function () {
      var next = items.slice(shown, shown + BATCH);
      next.forEach(function (el) { el.hidden = false; el.classList.add('is-arriving'); });
      shown += next.length;
      if (shown >= items.length) {
        more.hidden = true;
        if (io) io.disconnect();
      }
      return next[0];
    };

    more.querySelector('button').addEventListener('click', function () {
      var first = showNext();
      // Keyboard users: move focus to the first new project's link
      if (first) first.querySelector('.work-item__title a').focus({ preventScroll: true });
    });

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) showNext();
      }, { rootMargin: '0px 0px 400px 0px' });
      io.observe(more);
    }
  }
})();
