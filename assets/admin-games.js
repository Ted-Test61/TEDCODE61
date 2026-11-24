(() => {
  'use strict';
  const $ = (s)=>document.querySelector(s),core=window.TEDKOD;
  const names={pattern:'Örüntü Avcısı',maze:'Robot Rotası',matrix:'Mantık Matrisi'};
  const state={items:[]};
  const show=(el,yes)=>{el.hidden=!yes;};
  const message=(target,msg)=>{target.textContent=msg;show(target,Boolean(msg));};
  const textCell=(tr,content)=>{const td=document.createElement('td');td.textContent=String(content??'');tr.append(td);return td;};
  const formatDate=(value)=>new Date(value).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
  function screen(authorized){show($('#game-login'),!authorized);show($('#game-dashboard'),authorized);show($('#game-logout'),authorized);}
  async function checkTeacher(){const db=core.client();const {data:{user},error}=await db.auth.getUser();if(error||!user)throw new Error('Oturum açman gerekiyor.');const role=await db.from('teacher_accounts').select('user_id').eq('user_id',user.id).maybeSingle();if(role.error||!role.data)throw new Error('Bu hesap öğretmen olarak yetkilendirilmemiş.');return user;}
  function render(){const all=state.items;$('#game-total').textContent=all.length;$('#game-pending').textContent=all.filter(x=>!x.approved).length;$('#game-approved').textContent=all.filter(x=>x.approved).length;
    const term=$('#game-search').value.trim().toLocaleLowerCase('tr-TR'),filter=$('#game-filter').value;
    const rows=all.filter(x=>(filter==='all'||(filter==='approved'?x.approved:!x.approved))&&(!term||`${x.full_name} ${x.grade}/${x.section}`.toLocaleLowerCase('tr-TR').includes(term)));
    const tbody=$('#game-rows');tbody.replaceChildren();show($('#game-empty'),!rows.length);
    rows.forEach(item=>{const tr=document.createElement('tr');textCell(tr,item.full_name);textCell(tr,`${item.grade}/${item.section}`);textCell(tr,names[item.game_id]||item.game_id);textCell(tr,item.score);textCell(tr,item.play_name);textCell(tr,formatDate(item.created_at));
      const actions=textCell(tr,'');let approve=document.createElement('button');approve.type='button';approve.textContent=item.approved?'Onayı kaldır':'Onayla ✓';if(item.approved){approve.className='remove';}approve.addEventListener('click',()=>updateApproval(item.id,!item.approved));actions.append(approve);
      let del=document.createElement('button');del.type='button';del.className='remove';del.textContent='Kaydı sil';del.addEventListener('click',()=>deleteEntry(item));actions.append(del);tbody.append(tr);
    });
  }
  async function load(){try{await checkTeacher();const response=await core.client().from('arena_winners').select('id,created_at,game_id,play_name,full_name,grade,section,score,approved').order('created_at',{ascending:false}).limit(3000);if(response.error)throw response.error;state.items=response.data||[];message($('#game-error'),'');render();}catch(error){message($('#game-error'),core.message(error));}}
  async function updateApproval(id,approved){try{await checkTeacher();const res=await core.client().from('arena_winners').update({approved}).eq('id',id).select('id');if(res.error)throw res.error;if(!res.data?.length)throw new Error('İşlem için öğretmen yetkisi gerekli.');await load();}catch(err){message($('#game-error'),core.message(err));}}
  async function deleteEntry(item){if(!confirm(`${item.full_name} öğrencisinin ${names[item.game_id]||'oyun'} kaydını kalıcı olarak silmek istiyor musun?`))return;try{await checkTeacher();const res=await core.client().from('arena_winners').delete().eq('id',item.id).select('id');if(res.error)throw res.error;if(!res.data?.length)throw new Error('Kayıt silinemedi.');await load();}catch(err){message($('#game-error'),core.message(err));}}
  $('#game-search').addEventListener('input',render);$('#game-filter').addEventListener('change',render);$('#game-refresh').addEventListener('click',load);
  $('#game-login-form').addEventListener('submit',async e=>{e.preventDefault();message($('#game-login-error'),'');const button=e.target.querySelector('button');button.disabled=true;try{const response=await core.client().auth.signInWithPassword({email:$('#game-email').value.trim(),password:$('#game-password').value});if(response.error)throw response.error;await checkTeacher();$('#game-password').value='';screen(true);await load();}catch(err){await core.client().auth.signOut().catch(()=>{});message($('#game-login-error'),core.message(err));}finally{button.disabled=false;}});
  $('#game-logout').addEventListener('click',async()=>{try{await core.client().auth.signOut()}catch{}screen(false)});
  if(!core?.configured||!window.supabase){message($('#game-login-error'),'Çevrimiçi bağlantı yüklenemedi. config.js ve internet bağlantısını kontrol edin.');$('#game-login-form button').disabled=true;return;}
  (async()=>{try{await checkTeacher();screen(true);await load()}catch{screen(false)}})();
})();
