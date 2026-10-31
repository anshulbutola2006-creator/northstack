/* NorthStack — shared behaviour: mobile menu, marquee, GSAP reveals */
(function () {
  document.documentElement.classList.add('js');

  /* mobile menu */
  var btn = document.querySelector('.menu-btn');
  var menu = document.querySelector('.mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  /* marquee — pure GSAP when available, CSS fallback otherwise */
  var track = document.querySelector('.marquee-track');
  if (track && hasGsap && !reduce) {
    gsap.to(track, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 });
    document.addEventListener('visibilitychange', function () {
      gsap.globalTimeline.paused(document.hidden);
    });
  }

  if (!hasGsap || reduce) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.style.opacity = 1; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* hero entrance */
  var hero = document.querySelectorAll('[data-hero]');
  if (hero.length) {
    gsap.from(hero, {
      y: 26, opacity: 0, duration: .8, ease: 'power3.out', stagger: .1,
      onComplete: function () { ScrollTrigger.refresh(); }
    });
  }

  /* below-fold reveals — batched for performance */
  gsap.set('[data-reveal]', { opacity: 0, y: 26 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, y: 0, duration: .7, stagger: .07, ease: 'power2.out', overwrite: true });
    }
  });

  /* subtle parallax on marked images */
  document.querySelectorAll('[data-parallax]').forEach(function (el) {
    gsap.to(el, {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
