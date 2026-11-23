/* Lightweight visual animation only. No application data or Supabase access. */
(() => {
  'use strict';
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const elements = Array.from(document.querySelectorAll('[data-animate]'));
  if (elements.length === 0) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {threshold: 0.05, rootMargin: '0px 0px -10px 0px'});
  document.documentElement.classList.add('js-animate');
  elements.forEach(element => observer.observe(element));
  /* Keep above-the-fold content visible even before first scroll/observer tick. */
  document.querySelectorAll('.premium-hero [data-animate]').forEach(el => el.classList.add('is-visible'));
})();
