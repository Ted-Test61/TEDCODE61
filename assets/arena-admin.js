/* Teacher-only winners moderation. Supabase RLS is the authorization boundary. */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const cfg=window.TEDKOD_CONFIG||{};
const client=(window.supabase&&cfg.supabaseUrl&&cfg.supabaseAnonKey)?window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
const gameNames={pattern:'Örüntü Avcısı',maze:'Robot Rotası',matrix:'Mantık Matrisi'};
let records=[];
function msg(text,login=false){$(login?'ar-admin-login-error':'ar-admin-error').textContent=text;}
function td(text){const e=document.createElement('td');e.textContent=text;return e;}
function addCell(body,node){let td=document.createElement('td');td.append(node);body.append(td);}
async function load(){msg('');if(!client){msg('Supabase bağlantısı bulunamadı.');return;}
 const {data,error}=await client.from('arena_winners').select('id,created_at,game_id,full_name,grade,section,score,approved').order('created_at',{ascending:false}).limit(500);
 if(error){msg('Kayıtlar alınamadı. Yetkili öğretmen hesabıyla giriş yaptığından ve SQL kurulumundan emin ol.');return;}
 records=data||[];$('ar-admin-count').textContent=`${records.length} başarı kaydı · ${records.filter(x=>!x.approved).length} onay bekliyor`;
 const tbody=$('ar-admin-rows');tbody.replaceChildren();if(!records.length){const tr=document.createElement('tr');const cell=td('Henüz kayıt yok.');cell.colSpan=7;tr.append(cell);tbody.append(tr);return;}
 records.forEach(x=>{const tr=document.createElement('tr');tr.append(td(x.full_name),td(`${x.grade} / ${x.section}`),td(gameNames[x.game_id]||x.game_id),td(String(x.score)),td(new Date(x.created_at).toLocaleString('tr-TR')));
 const status=document.createElement('span');status.className='ar-approve-state';status.textContent=x.approved?'Onaylı':'Bekliyor';addCell(tr,status);
 const button=document.createElement('button');button.type='button';button.textContent=x.approved?'Onayı kaldır':'Onayla ✓';button.className=x.approved?'is-approved':'';
 button.addEventListener('click',async()=>{button.disabled=true;const {error}=await client.from('arena_winners').update({approved:!x.approved}).eq('id',x.id);if(error){msg('Onay durumu değişmedi. Öğretmen yetkilerini kontrol et.');button.disabled=false;return;}await load()});addCell(tr,button);tbody.append(tr)});
}
function exportCsv(){if(!records.length)return;const fields=['Ad Soyad','Sınıf','Şube','Oyun','Puan','Tarih','Durum'];const quote=(v)=>'"'+String(v??'').replaceAll('"','""')+'"';const content=[fields,...records.map(r=>[r.full_name,r.grade,r.section,gameNames[r.game_id]||r.game_id,r.score,new Date(r.created_at).toLocaleString('tr-TR'),r.approved?'Onaylı':'Bekliyor'])].map(row=>row.map(quote).join(';')).join('\r\n');const blob=new Blob(['\ufeff'+content],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='TEDKOD_Zeka_Arenasi_Kazananlar.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function showSession(){if(!client)return;const {data:{session}}=await client.auth.getSession();if(!session){$('ar-admin-login').hidden=false;$('ar-admin-data').hidden=true;return;}
 // Without teacher_accounts membership, display the RLS error and do not expose data.
 const {data,error}=await client.from('teacher_accounts').select('user_id').eq('user_id',session.user.id).maybeSingle();
 if(error||!data){$('ar-admin-login').hidden=false;$('ar-admin-data').hidden=true;msg('Bu hesap öğretmen olarak yetkilendirilmemiş.',true);return}
 $('ar-admin-login').hidden=true;$('ar-admin-data').hidden=false;await load();}
$('ar-admin-login-form').addEventListener('submit',async(e)=>{e.preventDefault();msg('',true);if(!client){msg('Önce Supabase kurulmalı.',true);return}const email=$('ar-admin-email').value.trim(),password=$('ar-admin-password').value;const {error}=await client.auth.signInWithPassword({email,password});if(error){msg('E-posta veya parola hatalı.',true);return}await showSession()});
$('ar-admin-reload').addEventListener('click',load);
$('ar-admin-export').addEventListener('click',exportCsv);
$('ar-admin-logout').addEventListener('click',async()=>{if(client)await client.auth.signOut();records=[];$('ar-admin-password').value='';await showSession()});
showSession();
})();
