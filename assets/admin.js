(() => {
  'use strict';
  const $=(s)=>document.querySelector(s);
  const core=window.TEDKOD;
  const state={items:[],current:null,key:{}};
  const show=(el,yes)=>el.classList.toggle('hidden',!yes);
  const mk=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=String(text);return el;};
  const readableTime=(str)=>new Date(str).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
  const feedback=(s)=>{$('#dashboard-error').textContent=s;show($('#dashboard-error'),Boolean(s));};
  function loginScreen(){show($('#dashboard'),false);show($('#login-section'),true);show($('#logout'),false);}
  function panelScreen(){show($('#dashboard'),true);show($('#login-section'),false);show($('#logout'),true);}
  async function ensureTeacher(){const db=core.client();const {data:{user},error}=await db.auth.getUser();if(error||!user)throw new Error('Öğretmen oturumu bulunamadı.');const {data,error:roleError}=await db.from('teacher_accounts').select('user_id').eq('user_id',user.id).maybeSingle();if(roleError||!data)throw new Error('Bu hesap öğretmen olarak yetkilendirilmemiş.');return user;}
  async function load(){await ensureTeacher();const db=core.client();const [list,key]=await Promise.all([db.from('applications').select('*').order('created_at',{ascending:false}).limit(3000),db.rpc('teacher_question_key')]);if(list.error)throw list.error;if(key.error)throw key.error;state.items=list.data||[];state.key=key.data||{};render();}
  function cell(tr,text){const td=mk('td','',text);tr.append(td);return td;}
  function render(){const all=state.items;$('#stat-total').textContent=all.length;$('#stat-reviewed').textContent=all.filter(x=>x.idea_score!==null&&x.solution_score!==null).length;$('#stat-interview').textContent=all.filter(x=>x.status==='Görüşmeye davet').length;$('#stat-selected').textContent=all.filter(x=>x.status==='Takıma seçildi').length;
    const term=$('#search').value.trim().toLocaleLowerCase('tr-TR');const status=$('#filter-status').value;const filtered=all.filter(x=>(!status||x.status===status)&&(!term||(x.full_name+' '+x.grade+'/'+x.section).toLocaleLowerCase('tr-TR').includes(term)));
    const tbody=$('#application-rows');tbody.replaceChildren();show($('#empty-table'),filtered.length===0);
    filtered.forEach(s=>{const tr=mk('tr');cell(tr,s.full_name);cell(tr,s.grade+'/'+s.section);cell(tr,s.mc_score+' / 60');cell(tr,s.idea_score===null||s.solution_score===null?'Bekliyor':(s.mc_score+s.idea_score+s.solution_score)+' / 100');const statusCell=cell(tr,'');statusCell.append(mk('span','pill '+(s.status==='Takıma seçildi'?'accept':s.status==='Görüşmeye davet'?'interview':''),s.status));cell(tr,readableTime(s.created_at));const b=mk('button','view-button','İncele →');b.type='button';b.addEventListener('click',()=>openStudent(s.id));cell(tr,'').append(b);tbody.append(tr);});
  }
  function meta(label,value){const el=mk('div');el.append(mk('small','',label),mk('b','',value));return el;}
  function answerCard(title,answer,result){const box=mk('div','answer-box');box.append(mk('h4','',title),mk('p','',answer));if(result)box.append(mk('div',result.startsWith('✓')?'correct':'incorrect',result));return box;}
  function field(label,input){const el=mk('label','field');el.append(mk('span','',label),input);return el;}
  function scoreInput(id,value){const input=mk('input');input.id=id;input.type='number';input.min='0';input.max='20';input.step='1';input.placeholder='0–20';input.value=value??'';return input;}
  function openStudent(id){const s=state.items.find(x=>x.id===id);if(!s)return;state.current=id;$('#drawer-name').textContent=s.full_name;const body=$('#drawer-content');body.replaceChildren();
    const info=mk('div','student-meta');info.append(meta('Sınıf',s.grade+'/'+s.section),meta('Başvuru zamanı',readableTime(s.created_at)),meta('Tema',s.theme),meta('Güçlü yön',s.strength),meta('Başvuru kodu',s.reference));body.append(info);
    const scores=mk('div','score-grid');[['Test',s.mc_score+' / 60'],['Açık uçlu',s.idea_score===null||s.solution_score===null?'Bekliyor':(s.idea_score+s.solution_score)+' / 40'],['Toplam',s.idea_score===null||s.solution_score===null?'—':(s.mc_score+s.idea_score+s.solution_score)+' / 100']].forEach(([label,value])=>{const c=mk('div');c.append(mk('strong','',value),mk('small','',label));scores.append(c);});body.append(scores);
    body.append(mk('h3','', 'Çoktan seçmeli yanıtlar'));core.questions.forEach((q,i)=>{const ans=s.answers?.[q.id];const selected=q.options[ans]??'Yanıt bulunamadı';const correct=state.key[q.id];body.append(answerCard(`${i+1}. ${q.text}`,selected,ans===correct?'✓ Doğru yanıt':'Doğru seçenek: '+q.options[correct]));});
    body.append(mk('h3','', 'Öğrencinin kendi fikirleri'),answerCard('7. Problem ve kanıt',s.idea),answerCard('8. Çözüm ve test planı',s.solution));
    const form=mk('form','review-form');form.append(mk('h3','', 'Öğretmen değerlendirmesi'));
    const cols=mk('div','two-col');const idea=scoreInput('score-idea',s.idea_score),solution=scoreInput('score-solution',s.solution_score);cols.append(field('Problem / 20',idea),field('Çözüm / 20',solution));form.append(cols);
    const status=mk('select');status.id='student-status';core.statuses.forEach(x=>{const o=mk('option','',x);o.value=x;status.append(o);});status.value=s.status;form.append(field('Değerlendirme durumu',status));
    const notes=mk('textarea');notes.id='teacher-notes';notes.rows=4;notes.maxLength=1500;notes.value=s.notes||'';notes.placeholder='Görüşme notları, güçlü yönler...';form.append(field('Öğretmen notları (öğrenciye görünmez)',notes));
    const actions=mk('div','review-actions');const del=mk('button','danger-text','Başvuruyu sil');del.type='button';const save=mk('button','button primary','Kaydet ✓');save.type='submit';actions.append(del,save);form.append(actions);const notice=mk('p','feedback','');form.append(notice);
    form.addEventListener('submit',async e=>{e.preventDefault();const a=idea.value===''?null:Number(idea.value),b=solution.value===''?null:Number(solution.value);if([a,b].some(n=>n!==null&&(!Number.isInteger(n)||n<0||n>20))){notice.textContent='Puanlar 0–20 aralığında tam sayı olmalı.';return;}save.disabled=true;try{const {data,error}=await core.client().from('applications').update({idea_score:a,solution_score:b,status:status.value,notes:notes.value.trim()}).eq('id',s.id).select('id');if(error)throw error;if(!data?.length)throw new Error('Değişiklik yetki nedeniyle kaydedilemedi.');notice.textContent='✓ Değerlendirme kaydedildi.';await load();}catch(ex){notice.textContent=core.message(ex);}finally{save.disabled=false;}});
    del.addEventListener('click',async()=>{if(!window.confirm(s.full_name+' adlı öğrencinin başvurusunu kalıcı olarak silmek istiyor musunuz?'))return;try{const {data,error}=await core.client().from('applications').delete().eq('id',s.id).select('id');if(error)throw error;if(!data?.length)throw new Error('Kayıt silinemedi.');closeDrawer();await load();}catch(ex){notice.textContent=core.message(ex);}});
    body.append(form);show($('#overlay'),true);document.body.style.overflow='hidden';$('#close-drawer').focus();
  }
  function closeDrawer(){show($('#overlay'),false);document.body.style.overflow='';state.current=null;}
  function csvCell(v){let s=String(v??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function exportCSV(){const columns=[['created_at','Başvuru tarihi'],['reference','Başvuru kodu'],['full_name','Ad Soyad'],['grade','Sınıf'],['section','Şube'],['theme','Tema'],['strength','Güçlü yön'],['mc_score','Test puanı'],['idea_score','Problem puanı'],['solution_score','Çözüm puanı'],['total_score','Toplam puan'],['status','Durum'],['idea','Problem yanıtı'],['solution','Çözüm yanıtı'],['notes','Öğretmen notları']];
    const rows=[columns.map(x=>csvCell(x[1])).join(';')];state.items.forEach(s=>{const v={...s,total_score:s.idea_score===null||s.solution_score===null?'':s.mc_score+s.idea_score+s.solution_score};rows.push(columns.map(([k])=>csvCell(v[k])).join(';'));});
    const blob=new Blob(['\ufeff'+rows.join('\r\n')],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='TEDKOD_basvurular_'+new Date().toISOString().slice(0,10)+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('#close-drawer').addEventListener('click',closeDrawer);$('#overlay').addEventListener('click',e=>{if(e.target===$('#overlay'))closeDrawer();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#overlay').classList.contains('hidden'))closeDrawer();});
  $('#search').addEventListener('input',render);$('#filter-status').addEventListener('change',render);
  $('#login-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button');b.disabled=true;show($('#login-error'),false);try{const db=core.client();const {error}=await db.auth.signInWithPassword({email:$('#email').value.trim(),password:$('#password').value});if(error)throw error;await ensureTeacher();$('#password').value='';panelScreen();await load();}catch(ex){await core.client().auth.signOut().catch(()=>{});$('#login-error').textContent=core.message(ex);show($('#login-error'),true);}finally{b.disabled=false;}});
  $('#logout').addEventListener('click',async()=>{try{await core.client().auth.signOut();}catch{}loginScreen();});$('#export').addEventListener('click',exportCSV);
  core.statuses.forEach(x=>{const opt=mk('option','',x);opt.value=x;$('#filter-status').append(opt);});
  if(!core.configured||!window.supabase){$('#login-error').textContent='Supabase bağlantısı kurulmamış. Önce README kurulum adımlarını tamamlayın.';show($('#login-error'),true);$('#login-form').querySelector('button').disabled=true;return;}
  (async()=>{try{await ensureTeacher();panelScreen();await load();}catch{loginScreen();}})();
})();
