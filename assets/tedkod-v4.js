/* TEDKOD 4.0: visual interaction only. No Supabase, application, student data or secrets. */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const revealTargets = Array.from(document.querySelectorAll('[data-v4-reveal]'));
  if ('IntersectionObserver' in window && !reduced.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('v4-inview');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -32px 0px', threshold: 0.06 });
    document.documentElement.classList.add('js-v4');
    revealTargets.forEach((el) => io.observe(el));
    // Never leave the hero invisible while waiting for an observer frame.
    document.querySelectorAll('.v4-hero [data-v4-reveal]').forEach((el) => el.classList.add('v4-inview'));
  }

  const progress = $('#reading-progress');
  let scheduled = false;
  function updateProgress() {
    scheduled = false;
    if (!progress) return;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.width = `${Math.max(0, Math.min(100, scrollY / max * 100)).toFixed(2)}%`;
  }
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateProgress);
  }, {passive:true});
  window.addEventListener('resize', updateProgress, {passive:true});
  updateProgress();

  const scene = $('.v4-device-scene');
  if (scene && !reduced.matches && window.matchMedia('(hover: hover) and (pointer:fine)').matches) {
    scene.addEventListener('pointermove', (event) => {
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      scene.style.setProperty('--move-x', `${(x * 12).toFixed(1)}deg`);
      scene.style.setProperty('--move-y', `${(-y * 8).toFixed(1)}deg`);
    });
    scene.addEventListener('pointerleave', () => {
      scene.style.setProperty('--move-x', '0deg');
      scene.style.setProperty('--move-y', '0deg');
    });
  }

  const examples = {
    problem: {
      index:'01 / FARK ET',icon:'?',title:'Sorun gerçekten ne?',
      quote:'“Bahçedeki atıklar doğru kutulara ayrıştırılmıyor.”',
      feedback:'Bu problemi gözlemleyebilir, sayabilir ve araştırabilirsin.'
    },
    solution: {
      index:'02 / ÇÖZÜM ÜRET',icon:'✳',title:'Peki nasıl çözersin?',
      quote:'“Atıkları tanıyıp uygun kutuyu öneren bir sistem tasarlayabiliriz.”',
      feedback:'Önce problemin nedenini araştır. Sonra bu fikrin işe yarayıp yaramadığını test et.'
    }
  };
  const exampleCard = $('.v4-example-card');
  document.querySelectorAll('[data-example]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = examples[button.dataset.example];
      if (!value || !exampleCard) return;
      document.querySelectorAll('[data-example]').forEach((b) => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      $('#v4-example-index').textContent = value.index;
      $('#v4-example-icon').textContent = value.icon;
      $('#v4-example-title').textContent = value.title;
      $('#v4-example-quote').textContent = value.quote;
      $('#v4-example-feedback').textContent = value.feedback;
      exampleCard.classList.remove('v4-example-transition');
      void exampleCard.offsetWidth;
      exampleCard.classList.add('v4-example-transition');
    });
  });

  const prompts = {
    education: [
      ['Bir konuyu öğrenirken en çok nerede zorlanıyoruz?', 'Sınıf arkadaşlarının deneyimlerini isim almadan gözlemle.'],
      ['Okulda hangi bilgileri tekrar etmekte zorlanıyoruz?', 'En çok tekrar isteyen konuları anonim bir sayımla karşılaştır.'],
      ['Hangi ders materyali daha anlaşılır olabilir?', 'İki farklı anlatım biçimini deneyip geri bildirim topla.']
    ],
    accessibility: [
      ['Okulda hangi alanlar herkes için kolay kullanılmıyor?', 'Koridor ve yönlendirme levhalarını gözlemle; kişisel sağlık verisi toplama.'],
      ['Kalabalık ortamlarda yön bulmayı nasıl kolaylaştırırız?', 'Güzergâhları gözlemleyip anonim, basit bir erişim haritası çiz.'],
      ['Bir duyuru daha anlaşılır nasıl sunulabilir?', 'Yazı, simge ve sesli anlatım seçeneklerinin anlaşılabilirliğini test et.']
    ],
    nature: [
      ['Okulda gereksiz enerji kullanımı nerede oluyor?', 'Boş sınıflarda açık kalan ışıkları belirli saatlerde say.'],
      ['Atıkları ayırırken en çok hangi hata yapılıyor?', 'Kişilerin kimliğini kaydetmeden kutuların kullanımını gözlemle.'],
      ['Suyu tasarruflu kullanmak için nereden başlamalıyız?', 'Gözlenebilir bir durumu seç ve küçük bir iyileştirme denemesi planla.']
    ]
  };
  const topicLabels = { education:'EĞİTİM VE ÖĞRENME', accessibility:'SAĞLIKLI GELECEK VE ERİŞİLEBİLİRLİK', nature:'ÇEVRE VE SÜRDÜRÜLEBİLİR YAŞAM' };
  const labButtons = Array.from(document.querySelectorAll('[data-lab-topic]'));
  let topic = 'education';
  let index = 0;
  function renderPrompt() {
    const items = prompts[topic];
    if (!items) return;
    $('#v4-prompt-theme').textContent = topicLabels[topic];
    $('#v4-prompt-question').textContent = items[index][0];
    $('#v4-prompt-hint').textContent = items[index][1];
    $('#v4-prompt-count').textContent = `0${index+1} / 0${items.length}`;
    const glyph = $('.v4-console-pulse');
    glyph.classList.remove('v4-reprompt');
    void glyph.offsetWidth;
    glyph.classList.add('v4-reprompt');
  }
  labButtons.forEach((button) => button.addEventListener('click', () => {
    if (!prompts[button.dataset.labTopic]) return;
    topic = button.dataset.labTopic;
    index = 0;
    labButtons.forEach((b) => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    renderPrompt();
  }));
  $('#v4-next-question')?.addEventListener('click', () => {
    index = (index + 1) % prompts[topic].length;
    renderPrompt();
  });
})();
