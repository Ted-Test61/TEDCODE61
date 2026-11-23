# TEDCODE61: TEDKOD öğrenci seçme sitesi

Bu klasörün içindeki bütün dosyaları doğrudan `Ted-Test61/TEDCODE61` deposunun köküne yükleyin. ZIP'in kendisini yüklemeyin.

Öğrenci sitesi: https://ted-test61.github.io/TEDCODE61/
Öğretmen paneli: https://ted-test61.github.io/TEDCODE61/admin/

## GitHub Pages

1. Repository'yi açıp **Add file > Upload files** ile ZIP'ten çıkardığınız dosyaları/klasörleri yükleyin. Gizli `.github` klasörünün de yüklendiğini kontrol edin.
2. **Settings > Pages > Build and deployment > Source > GitHub Actions** seçin.
3. **Actions** sekmesindeki **TEDKOD GitHub Pages** iş akışını çalıştırın ya da yeni bir `main` commit'iyle otomatik çalışmasını sağlayın.
4. **Settings > Pages** bölümünde **Visit site** bağlantısıyla kontrol edin.

## Başvuru veritabanı (zorunlu)

GitHub Pages yalnızca siteyi yayınlar, başvuruları kendi başına kaydetmez.

1. Supabase'de yeni proje açın.
2. **SQL Editor > New query** bölümüne size ayrı verilen `TEDCODE61_Supabase_Kurulum.sql` dosyasının tamamını yapıştırıp çalıştırın. **Bu SQL dosyasını herkese açık GitHub deposuna yüklemeyin!** Dosyada test cevap anahtarı vardır.
3. **Authentication > Users > Add user** ile öğretmen hesabını oluşturun; oluşturulan User UID ile SQL Editor'de `insert into public.teacher_accounts (user_id) values ('OGRETMEN_KULLANICI_UUID');` sorgusunu çalıştırın.
4. Supabase projenizin URL'sini ve **publishable (anon)** anahtarını GitHub'daki `config.js` dosyasına yazıp commit edin. Secret key veya service_role key kullanmayın.
5. Test başvurusunu gerçek öğrenci bilgisi kullanmadan yapın; öğretmen panelinde çıktığını doğrulayın.

Başvuru süresi: 27 Kasım 2026, 23.59 (Türkiye saati). Değiştirmek için hem `config.js` içindeki `deadline`, hem de Supabase'deki `submit_application` fonksiyonu güncellenmelidir.

Bu site okul içi ön seçme içindir; MEB'e resmî turnuva başvurusu değildir. Okul onayı, KVKK aydınlatması ve gerekli veli izinleri tamamlanmadan gerçek öğrenci verisi toplamayın.
