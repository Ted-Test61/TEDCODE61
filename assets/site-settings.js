/* TEDKOD okul içi ön seçme son tarihi. config.js içindeki Supabase bilgilerine dokunmaz. */
(() => {
  'use strict';
  const original = window.TEDKOD_CONFIG;
  if (!original || typeof original !== 'object') return;
  window.TEDKOD_CONFIG = Object.freeze({
    ...original,
    deadline: '2026-11-30T23:59:59+03:00'
  });
})();
