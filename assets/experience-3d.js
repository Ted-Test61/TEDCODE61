/* TEDKOD 3D story: scroll-linked CSS 3D. No third-party tracking, external CDN, or student data access. */
(() => {
  'use strict';
  const story = document.querySelector('.idea-journey');
  const stage = document.querySelector('.journey-stage');
  const track = document.querySelector('.journey-scroll-space');
  const orb = document.querySelector('.journey-universe');
  const title = document.querySelector('#journey-title');
  const description = document.querySelector('#journey-description');
  const fraction = document.querySelector('#journey-fraction');
  const label = document.querySelector('#journey-card-label');
  const markers = Array.from(document.querySelectorAll('.journey-markers span'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = [
    { title: 'Her şey bir <em>soruyla</em> başlar.', text: 'Çevrene dikkatle bak. Herkesin alıştığı bir durum, belki de henüz çözülmemiş bir problemdir.', tag:'MERAK' },
    { title: 'İyi fikir, <em>kanıt</em> ister.', text: 'Gözlem yap, sorunu yaşayanları dinle, basit bir ölçüm yap. Gerçeği tahminlerle değil verilerle anlat.', tag:'ARAŞTIR' },
    { title: 'Çözümünü <em>tasarla.</em>', text: 'Birden fazla fikir üret. Yapay zekânın gerçekten işe yarayıp yaramadığını sorgula. En anlamlı çözümü seç.', tag:'TASARLA' },
    { title: 'Dene. Öğren. <em>İyileştir.</em>', text: 'Fikrini bir prototipe dönüştür. Test et, geri bildirim al, geliştir. Fikrinin nasıl olgunlaştığını göster.', tag:'ÜRET' }
  ];
  let raf = 0;
  let active = -1;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  function render() {
    raf = 0;
    if (!story || !track || !stage || !orb || reduceMotion.matches) return;
    const bounds = track.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
    const scrollable = Math.max(1, bounds.height - window.innerHeight);
    const progress = clamp(-bounds.top / scrollable, 0, 1);
    stage.style.setProperty('--journey-p', progress.toFixed(4));
    stage.style.setProperty('--journey-rx', `${(-12 + 16 * progress).toFixed(2)}deg`);
    stage.style.setProperty('--journey-ry', `${(-24 + 95 * progress).toFixed(2)}deg`);
    stage.style.setProperty('--journey-rz', `${(8 * progress).toFixed(2)}deg`);
    const idx = Math.min(3, Math.floor(progress * 4));
    if (idx !== active) {
      active = idx;
      title.innerHTML = chapters[idx].title;
      description.textContent = chapters[idx].text;
      label.textContent = chapters[idx].tag;
      fraction.textContent = `0${idx + 1} / 04`;
      markers.forEach((marker, i) => marker.classList.toggle('is-active', i === idx));
    }
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };
  if (story && track) {
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule, {passive:true});
    reduceMotion.addEventListener?.('change', schedule);
    schedule();
  }
  const data = {
    learning:{topic:'01 / EĞİTİM',question:'Bir konuyu öğrenirken en çok nerede zorlanıyoruz?',explore:'Sınıf arkadaşlarının zorlandığı konuları kişisel bilgi toplamadan gözlemle. Ortak bir durum var mı?',followup:'Bu durumu basit bir sayım veya gözlemle nasıl kanıtlarım?'},
    access:{topic:'02 / ERİŞİLEBİLİRLİK',question:'Okuldaki hangi alanları herkes için daha kolay kullanılabilir yapabiliriz?',explore:'Merdiven, yönlendirme veya ders materyali gibi gündelik engelleri gözlemle. Kimlerin işini zorlaştırıyor?',followup:'Kimsenin sağlık veya kimlik bilgisini toplamadan çözümü nasıl sınarım?'},
    earth:{topic:'03 / ÇEVRE',question:'Okulumuzda nerelerde kaynak israfı yaşanıyor?',explore:'Işıklar, su kullanımı veya atıkların ayrıştırılması gibi gözlemleyebileceğin bir durum seç.',followup:'Bir hafta boyunca hangi ölçümleri yapabilir ve küçük bir denemeyle nasıl iyileştirebilirim?'}
  };
  const tabButtons = Array.from(document.querySelectorAll('.studio-tab'));
  tabButtons.forEach(button => button.addEventListener('click', () => {
    const item = data[button.dataset.topic];
    if (!item) return;
    tabButtons.forEach(t => {const selected=t===button;t.classList.toggle('is-selected',selected);t.setAttribute('aria-pressed', String(selected));});
    document.querySelector('#studio-topic').textContent = item.topic;
    document.querySelector('#studio-question').textContent = item.question;
    document.querySelector('#studio-explore').textContent = item.explore;
    document.querySelector('#studio-followup').textContent = item.followup;
  }));
})();
