(() => {
  'use strict';
  const c = window.TEDKOD_CONFIG || {};
  const questions = [
    {id:'q1',skill:'Problem keşfi',text:'Okul koridorunda teneffüslerde yoğunluk yaşandığını fark ettin. Projeye en doğru nasıl başlarsın?',options:['Önce pahalı sensörler satın alırım.','Yoğunluğun nerede ve ne zaman oluştuğunu gözlemlerim.','Arkadaşlarımın hepsine aynı çözümü söylerim.','Bir uygulama tasarlayıp sorunu daha sonra araştırırım.']},
    {id:'q2',skill:'Kanıt ve veri',text:'Kantindeki bekleme süresini azaltmak istiyorsun. En yararlı kanıt hangisidir?',options:["Bir öğrencinin 'çok bekledim' demesi",'Rastgele bir internet videosu','Farklı günlerde ölçülmüş bekleme süreleri','Kantin hakkında tahmin yürütmek']},
    {id:'q3',skill:'Yapay zekânın rolü',text:'Geri dönüşüm kutularına yanlış atılan nesneleri tanıyan bir sistem tasarlanıyor. Yapay zekâya en uygun görev hangisi?',options:['Fotoğraftaki nesnenin türünü tahmin etmek','Kutuyu her sabah elle boşaltmak','Geri dönüşüm kurallarını duvara asmak','Öğrencilere nöbet çizelgesi dağıtmak']},
    {id:'q4',skill:'Veri güvenliği',text:'Bir proje için sınıftaki öğrencilerin davranışlarını incelemek istiyorsun. En güvenli yaklaşım nedir?',options:['Herkesi gizlice videoya çekmek','Öğrencilerin şifrelerini toplamak','İsim ve görüntü toplamadan, gerekli izinlerle anonim gözlem yapmak','Kişisel verileri herkese açık dosyaya yüklemek']},
    {id:'q5',skill:'Test ve iyileştirme',text:'Yaptığınız prototip ilk denemede doğru çalıştı. Sonraki adım ne olmalı?',options:['Başka denemeye gerek olmadığını söylemek','Farklı koşullarda test edip hataları not almak','Sonucu değiştirmeden internete yüklemek','Sadece logoyu geliştirmek']},
    {id:'q6',skill:'Takım çalışması',text:'Takımdaki iki arkadaşın farklı çözüm öneriyor. En verimli yol hangisidir?',options:['Birini konuşmadan elemek','En yüksek sesle konuşanın fikrini seçmek','Karar vermeyi tamamen öğretmene bırakmak','Fikirleri ölçütlerle karşılaştırıp küçük denemeler yapmak']}
  ];
  const themes = ['Eğitim ve Öğrenmenin Geleceği','Sağlıklı Gelecek ve Erişilebilirlik','Çevre ve Sürdürülebilir Yaşam','Henüz karar vermedim'];
  const strengths = ['Araştırma ve gözlem','Tasarım ve yaratıcılık','Kodlama ve teknoloji','Sunum ve iletişim','Takım organizasyonu','Henüz keşfediyorum'];
  const statuses = ['Yeni başvuru','Görüşmeye davet','Değerlendiriliyor','Takıma seçildi','Yedek','Bu dönem seçilmedi'];
  const configured = Boolean(/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test((c.supabaseUrl||'').trim()) && c.supabaseAnonKey && !c.supabaseAnonKey.includes('BURAYA_'));
  let db = null;
  function client(){
    if(!configured) throw new Error('Supabase bağlantısı henüz yapılandırılmamış. Yönetici README dosyasındaki kurulum adımlarını tamamlamalı.');
    if(!window.supabase || typeof window.supabase.createClient !== 'function') throw new Error('Supabase kitaplığı yüklenemedi. İnternet bağlantınızı kontrol edin.');
    if(!db) db = window.supabase.createClient(c.supabaseUrl.replace(/\/$/,''),c.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
    return db;
  }
  function message(err){
    if(!err) return 'Beklenmeyen bir hata oldu.';
    const s=String(err.message||err);
    if(/duplicate key|unique constraint|23505/i.test(s)) return 'Bu ad, sınıf ve şube ile daha önce başvuru yapılmış olabilir. Danışman öğretmenine başvur.';
    if(/DEADLINE_CLOSED/i.test(s)) return 'Başvuru süresi sona erdi.';
    if(/VALIDATION_ERROR/i.test(s)) return 'Bazı bilgiler doğrulanamadı. Lütfen alanları kontrol et.';
    if(/permission denied|42501|not authorized|AUTH_REQUIRED/i.test(s)) return 'Bu işlem için yetkiniz bulunmuyor.';
    if(/Failed to fetch|NetworkError|fetch failed/i.test(s)) return 'Bağlantı kurulamadı. Ağ bağlantısını kontrol edin.';
    if(/Invalid login credentials/i.test(s)) return 'E-posta adresi veya parola hatalı.';
    if(/Could not find the function|PGRST202/i.test(s)) return 'Sunucu fonksiyonu bulunamadı. Veritabanı kurulumunu öğretmeninizle kontrol edin.';
    return 'İşlem tamamlanamadı. Lütfen tekrar dene veya danışman öğretmene haber ver.';
  }
  window.TEDKOD = Object.freeze({configured,client,questions,themes,strengths,statuses,message,config:c});
})();
