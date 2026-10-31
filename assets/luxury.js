/* NorthStack — luxury motion layer (GSAP, progressive) */
(function () {
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  if (!hasGsap || reduce) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.style.opacity = 1; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  gsap.set('[data-reveal]', { opacity: 0, y: 24 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 92%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, y: 0, duration: .85, stagger: .07, ease: 'power2.out', overwrite: true });
    }
  });

  document.querySelectorAll('[data-parallax]').forEach(function (el) {
    gsap.to(el, {
      yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: el, parent: el.closest('section') || document.body, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
