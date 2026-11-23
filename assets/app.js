(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const core=window.TEDKOD;
  const form=$('#apply-form');
  const state={step:0,sending:false};
  const stepTitles=['Önce tanışalım.','Düşünce testin.','Fikrini anlat.'];
  const show=(node,yes)=>node.classList.toggle('hidden',!yes);
  const error=(t)=>{const e=$('#validation');e.textContent=t;show(e,!!t);if(t)e.scrollIntoView({behavior:'smooth',block:'center'});};
  const siteError=(t)=>{const e=$('#site-error');e.textContent=t;show(e,!!t);};
  function populate(sel,values){values.forEach(v=>{const o=document.createElement('option');o.textContent=v;o.value=v;sel.append(o);});}
  function questionCard(q,i){
    const card=document.createElement('div');card.className='question-card';
    const tag=document.createElement('div');tag.className='question-tag';tag.textContent=q.skill.toLocaleUpperCase('tr-TR');card.append(tag);
    const title=document.createElement('h4');const num=document.createElement('span');num.textContent=`${i+1}.`;title.append(num,document.createTextNode(q.text));card.append(title);
    q.options.forEach((v,j)=>{const lbl=document.createElement('label');lbl.className='option';const r=document.createElement('input');r.type='radio';r.name=q.id;r.value=String(j);r.required=true;const text=document.createElement('span');text.textContent=v;lbl.append(r,text);card.append(lbl);});
    return card;
  }
  function setStep(n){state.step=n;document.querySelectorAll('[data-step]').forEach((el,i)=>show(el,i===n));$('#form-title').textContent=stepTitles[n];$('#step-indicator').textContent=`${n+1} / 3`;$('#progress-bar').style.width=`${Math.round((n+1)/3*100)}%`;show($('#back'),n>0);show($('#next'),n<2);show($('#submit'),n===2);error('');$('#form-shell').scrollIntoView({behavior:'smooth',block:'start'});}
  function validate(){
    if(state.step===0){for(const field of form.querySelectorAll('[data-step="0"] input[required],[data-step="0"] select[required]')){if(!field.checkValidity()){field.focus();return field.type==='checkbox'?'Gerekli kutuları işaretlemelisin.':'Adını, sınıfını, şubeni ve ilgilendiğin alanları eksiksiz doldur.';}}
      if(form.elements.full_name.value.trim().split(/\s+/).length<2){form.elements.full_name.focus();return 'Adını ve soyadını birlikte girmelisin.';}}
    if(state.step===1){for(const q of core.questions)if(!form.querySelector(`input[name="${q.id}"]:checked`))return 'Bütün test sorularını cevaplamalısın.';}
    if(state.step===2){for(const field of ['idea','solution'])if(form.elements[field].value.trim().length<30){form.elements[field].focus();return 'Her iki düşünme sorusunu da en az 30 karakterle yanıtlamalısın.';}}
    return '';
  }
  function countdown(){const deadline=new Date(core.config.deadline);const diff=deadline.getTime()-Date.now();const el=$('#countdown');if(diff<=0){el.textContent='Başvurular kapandı';show($('#closed-message'),true);show(form,false);$('#form-title').textContent='Başvuru süresi doldu.';return;}
    const days=Math.floor(diff/86400000),hours=Math.floor(diff%86400000/3600000),minutes=Math.floor(diff%3600000/60000);el.textContent=`${days} gün ${hours} saat ${minutes} dakika kaldı`;}
  $('#next').addEventListener('click',()=>{const msg=validate();if(msg){error(msg);return;}setStep(state.step+1);});
  $('#back').addEventListener('click',()=>setStep(Math.max(state.step-1,0)));
  for(const f of ['idea','solution'])form.elements[f].addEventListener('input',()=>{$('#'+f+'-count').textContent=form.elements[f].value.length;});
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(state.sending)return;const msg=validate();if(msg){error(msg);return;}
    if(new Date(core.config.deadline)<=new Date()){error('Başvuru süresi doldu.');return;}
    state.sending=true;$('#submit').disabled=true;$('#submit').textContent='Kaydediliyor...';
    const answers={};core.questions.forEach(q=>{answers[q.id]=Number(form.querySelector(`input[name="${q.id}"]:checked`).value);});
    const payload={full_name:form.elements.full_name.value.trim(),grade:Number(form.elements.grade.value),section:form.elements.section.value.trim(),theme:form.elements.theme.value,strength:form.elements.strength.value,answers,idea:form.elements.idea.value.trim(),solution:form.elements.solution.value.trim(),acknowledge:form.elements.acknowledge.checked,original_work:form.elements.original_work.checked,website:form.elements.website.value};
    try{const {data,error:dbError}=await core.client().rpc('submit_application',{p_payload:payload});if(dbError)throw dbError;if(!data?.reference)throw new Error('Başvuru kodu oluşturulamadı.');$('#reference').textContent=data.reference;show(form,false);show($('#success'),true);$('#form-title').textContent='Başarılı!';$('#step-indicator').textContent='✓';$('#progress-bar').style.width='100%';$('#form-shell').scrollIntoView({behavior:'smooth',block:'start'});}
    catch(ex){error('Başvuru kaydedilemedi: '+core.message(ex));}
    finally{state.sending=false;$('#submit').disabled=false;$('#submit').textContent='Başvuruyu gönder ↗';}
  });
  try{
    populate($('#theme-select'),core.themes);populate($('#strength-select'),core.strengths);
    core.questions.forEach((q,i)=>$('#questions').append(questionCard(q,i)));
    const deadline=new Date(core.config.deadline);
    if(Number.isNaN(deadline.getTime()))throw new Error('Son başvuru tarihi geçersiz.');
    $('#deadline-label').textContent='Son başvuru: '+new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',day:'numeric',month:'long',weekday:'long'}).format(deadline);
    countdown();setInterval(countdown,30000);$('#progress-bar').style.width='33%';
    if(!core.configured){siteError('Bu sitenin çevrimiçi başvuru bağlantısı henüz kurulmadı. Okul yönetiminin Supabase kurulumunu tamamlaması gerekiyor.');show(form,false);}
    else if(!window.supabase) {siteError('Başvuru hizmeti yüklenemedi. İnternet bağlantını kontrol et.');show(form,false);}
  }catch(ex){siteError(ex.message);show(form,false);}
})();
