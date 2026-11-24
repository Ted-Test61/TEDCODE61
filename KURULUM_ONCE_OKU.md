# TEDKOD 5.1 — Zekâ Oyunları bağlantı düzeltmesi

## Sorun ve çözüm

GitHub deposunda `arena/` ve `assets/arena.js` ile `assets/arena.css` bulunmadığı için oyun sayfası 404 veriyordu. Ayrıca önceki mobil CSS çoğu üst menü bağlantısını saklıyordu.

Bu güncelleme, oyunu **tek HTML dosyasında çalıştırır**: `zeka-oyunlari.html`. Oyun CSS ve JavaScript'i sayfanın içine gömülü olduğundan eksik `assets/arena.js` veya `assets/arena.css` nedeniyle bozulmaz. Ana sayfada hem üst menüde hem telefonda sabit bir **Zekâ Oyunları** düğmesi vardır.

## YÜKLEME (ÖNERİLEN KOLAY YÖNTEM)

1. GitHub deponuza giriş yapın: `https://github.com/Ted-Test61/TEDCODE61`.
2. **Code** sekmesindeki ana dizine bu üç dosyayı yükleyin:
   - `index.html` (**mevcut dosyanın yerine**)
   - `zeka-oyunlari.html` (**yeni**)
   - `oyun-kazananlari.html` (**yeni**)
3. `Commit changes` ile kaydedin; `Actions` sekmesinde yayın durumunun **success** (yeşil) olduğunu doğrulayın.
4. Oyunu kontrol edin: `https://ted-test61.github.io/TEDCODE61/zeka-oyunlari.html`.
5. Öğretmen panelini kontrol edin: `https://ted-test61.github.io/TEDCODE61/oyun-kazananlari.html`.

**Önemli:** ZIP dosyasını olduğu gibi GitHub'a yüklemeyin; içindeki dosyaları yükleyin. GitHub web arayüzünde önce ana dizindeki yukarıdaki üç dosyayı yüklemek yeterlidir. `config.js` dosyasını ASLA değiştirmeyin.

## İSTEĞE BAĞLI: ESKİ LİNKLERİN DE AÇILMASI

Eski `/arena/` linkini de düzeltmek için:
- GitHub'da `arena` klasörü oluşturun (gerekirse **Add file → Create new file** ile dosya adı `arena/index.html` yazın) ve paketteki `arena/index.html` içeriğini kaydedin.
- Eski `/admin/arena.html` bağlantısını da yönlendirmek isterseniz `admin` klasörüne girip `arena.html` dosyasını yükleyin.

## KORUNANLAR

- Mevcut `config.js`, Supabase bağlantısı, öğretmen hesabı ve öğrenci ön test sistemine dokunulmaz.
- Oyun kayıtları halen Supabase SQL'deki `submit_arena_win` fonksiyonunu kullanır. Kurulumu zaten yaptıysanız SQL'i tekrar çalıştırmanız gerekmez.
- 30 Kasım 2026 son başvuru tarihi (okul içi seçme) korunur.
- Genel başarı listesi yalnızca öğretmen onaylı anonim rumuzları gösterir. Yetkili öğretmen panelinde tam ad ve sınıf görüntülenir.

## DENEME

1. Önce bir oyunu **uydurma ad** kullanarak tamamlayın. İsmi, sınıfı test verisi olarak girin.
2. `oyun-kazananlari.html` sayfasında öğretmen hesabınızla giriş yapın ve sahte test kaydını görün.
3. Öğretmen onayı verdikten sonra oyun sayfasındaki anonim başarı listesinde test kaydının çıktığını doğrulayın.
4. Test kaydını gerçek öğrenciler oyuna başlamadan önce Supabase üzerinden silin.

KVKK aydınlatması, veli bilgilendirmesi, veri saklama ve silme esasları okulca onaylanmadan gerçek öğrenci kişisel verileri toplanmamalıdır.
