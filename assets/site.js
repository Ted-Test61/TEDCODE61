/* TEDKOD site interactions: navigation, scroll reveals, idea explorer. No personal data collected. */
(() => {
  'use strict';
  const $=(s)=>document.querySelector(s);
  const nav=$('#main-navigation'), toggle=$('#menu-toggle');
  if(nav&&toggle){
    toggle.addEventListener('click',()=>{let open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç');});
    nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
    document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target)){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
    const page=document.body.dataset.page;if(page==='home'||page==='about'||page==='apply'){const a=nav.querySelector(`[data-nav="${page}"]`);if(a)a.classList.add('active');}
  }
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce&&'IntersectionObserver' in window){
    document.documentElement.classList.add('js-motion');
    const observer=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:0.05,rootMargin:'0px 0px -20px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    document.querySelectorAll('.hero-section .reveal').forEach(el=>el.classList.add('is-visible'));
  }
  const labData={
    education:{title:'EĞİTİM VE ÖĞRENME',prompts:[['Bir konuyu öğrenirken en çok nerede zorlanıyoruz?','İsim toplamadan gözlem yaparak veya gönüllü görüşmelerle işe başla.'],['Kütüphanede aradığımız kitapları nasıl daha hızlı bulabiliriz?','Kitap arama süresini farklı günlerde ölç ve sonuçları karşılaştır.'],['Teneffüslerde daha sakin çalışmaya ihtiyaç duyanlar nerede zaman geçirebilir?','Okulda gürültünün hangi alanlarda yükseldiğini kaydet.']]},
    nature:{title:'ÇEVRE VE SÜRDÜRÜLEBİLİRLİK',prompts:[['Okulda en çok hangi atıklar yanlış kutuya atılıyor?','Atık türlerini isim veya fotoğraf kaydetmeden say.'],['Suyu hangi zamanlarda gereğinden fazla kullanıyoruz?','Güvenli, anonim gözlem verileriyle karşılaştırma yap.'],['Sınıfta ışık ve enerji tasarrufunu nasıl artırabiliriz?','Farklı saatlerde gereksiz yanan ışık sayısını gözlemle.']]},
    access:{title:'ERİŞİLEBİLİRLİK',prompts:[['Okulda bir yönü bulmak bazı öğrenciler için neden zor olabilir?','Farklı kullanıcıların ihtiyaçlarını izin alarak ve kişisel bilgi toplamadan dinle.'],['Duyurular herkes tarafından aynı kolaylıkla anlaşılabiliyor mu?','Farklı yazı boyutlarını ve anlatım biçimlerini karşılaştır.'],['Kalabalık ortamlarda önemli uyarıları nasıl daha anlaşılır yapabiliriz?','Sadece renk değil ses, sembol ve metin alternatiflerini düşün.']]}
  };
  const tabs=[...document.querySelectorAll('[data-topic]')];
  if(tabs.length){let active='education',index=0;const render=()=>{const d=labData[active],x=d.prompts[index];$('#lab-category').textContent=d.title;$('#lab-question').textContent=x[0];$('#lab-hint').textContent=x[1];$('#lab-count').textContent=`0${index+1} / 03`;tabs.forEach(t=>{const selected=t.dataset.topic===active;t.classList.toggle('active',selected);t.setAttribute('aria-pressed',String(selected));});};tabs.forEach(t=>t.addEventListener('click',()=>{active=t.dataset.topic;index=0;render();}));$('#lab-next').addEventListener('click',()=>{index=(index+1)%3;render();});render();}
})();
