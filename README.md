# EuroVenture

EuroVenture, on Avrupa şehri için kısa rota önerileri, bütçe bilgileri ve pratik ulaşım notları sunan, Türkçe ve bağımlılıksız bir statik şehir rehberidir.

## Yerel kullanım

Gereksinimler: güncel bir Node.js sürümü ve Python 3.

```bash
npm test
npm run serve
```

Site `http://localhost:4173` adresinde açılır. Sunucuyu durdurmak için terminalde `Ctrl+C` kullanın.

## Dosya haritası

- `index.html`: sayfanın semantik yapısı ve temel içerik
- `styles.css`: tasarım sistemi, yerleşim, erişilebilirlik ve duyarlı ekran kuralları
- `src/cities.js`: on şehrin içerik kataloğu
- `src/explore.js`: Türkçe metin normalizasyonu ve arama/filtre mantığı
- `src/icons.js`: arayüzde kullanılan SVG ikonları
- `src/app.js`: kart çizimi, arama, filtreler, rastgele seçim ve şehir diyaloğu
- `tests/`: Node test çalıştırıcısıyla çalışan davranış ve kaynak koruma testleri

## Tasarım ve teknik kısıtlar

- Arayüz Türkçe, tek sayfalı ve çerçevesizdir; derleme adımı ya da çalışma zamanı bağımlılığı yoktur.
- İçerik 320 pikselden geniş masaüstü ekranlara kadar yatay taşma üretmeden çalışmalıdır.
- Etkileşimli kontroller klavyeyle erişilebilir, görünür odak durumlarına sahip ve en az 44 piksel dokunma alanı sunmalıdır.
- Şehir ayrıntıları yerel `<dialog>` öğesinde açılır; Escape, kapatma düğmesi ve arka plan tıklamasıyla kapanır, ardından odağı açan kontrole geri verir.
- Hareketler `prefers-reduced-motion` tercihini destekler.
- Şehir fotoğrafları Unsplash üzerinden, yazı tipleri Google Fonts üzerinden yüklenir; çevrimdışı kullanım hedeflenmez.

## Statik yayınlama

Herhangi bir statik barındırma sağlayıcısında depo kökünü yayın dizini olarak seçin. Çalışan site için gereken dosyalar `index.html`, `styles.css` ve `src/` klasörüdür. GitHub Pages için kaynak olarak `main` dalını ve `/ (root)` klasörünü seçebilirsiniz; özel bir derleme komutu gerekmez.
