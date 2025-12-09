# Pure Life - Marketing Assets

Bu klasör App Store ve Google Play Store submission için gerekli marketing materyallerini içerir.

## Gerekli Asset'ler

### App Store (iOS)
- **App Icon**: 1024x1024 PNG (zaten mevcut: `assets/icon.png`)
- **Screenshots**: 
  - iPhone 6.7" (1290x2796) - 3-10 adet
  - iPhone 6.5" (1242x2688) - alternatif
  - iPhone 5.5" (1242x2208) - opsiyonel

### Google Play Store (Android)
- **App Icon**: 512x512 PNG (`play-store-icon.png`)
- **Feature Graphic**: 1024x500 PNG (`feature-graphic.png`)
- **Screenshots**: 
  - Phone: 1080x2340 (16:9 veya 9:16) - minimum 2, maksimum 8 adet
  - Tablet: 2048x2732 - opsiyonel

## Mevcut Asset'ler

### Otomatik Oluşturulan
- ✅ `play-store-icon.png` - 512x512 (generate-marketing-assets.js)
- ✅ `feature-graphic.png` - 1024x500 (generate-marketing-assets.js)

### Manuel Eklenmesi Gerekenler
Aşağıdaki screenshot'ları manuel olarak oluşturup bu klasöre ekleyin:

1. **screenshot-1-dashboard.png** - Ana dashboard ekranı
2. **screenshot-2-workout.png** - Haftalık antrenman planı
3. **screenshot-3-nutrition.png** - Beslenme kütüphanesi
4. **screenshot-4-progress.png** - İlerleme grafikleri
5. **screenshot-5-coach.png** - AI Coach chat

## Screenshot Oluşturma

### iOS Simulator'dan:
```bash
# Simulator çalışırken
xcrun simctl io booted screenshot screenshot-1-dashboard.png
```

### Android Emulator'dan:
```bash
# Emulator çalışırken
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png screenshot-1-dashboard.png
```

### Expo ile:
```bash
# Development build çalışırken
# Manuel olarak telefon/tablet'in screenshot özelliğini kullan
# iOS: Volume Up + Power
# Android: Volume Down + Power
```

## Asset Boyutları ve Gereksinimler

### App Store Screenshot Kuralları:
- Format: PNG veya JPEG
- Color Space: RGB
- Resolution: Retina display için @3x
- File Size: Max 500 MB her biri
- İçerik: Status bar temiz olmalı

### Google Play Screenshot Kuralları:
- Format: PNG veya JPEG (PNG önerilir)
- Resolution: 16:9 veya 9:16 aspect ratio
- Minimum: 320px kısa kenar
- Maksimum: 3840px uzun kenar
- File Size: Max 8 MB her biri

## Store Listing Metni

### Kısa Açıklama (80 karakter)
```
AI destekli fitness: Kişisel antrenman, beslenme ve ilerleme takibi
```

### Uzun Açıklama (4000 karakter)

**Pure Life - AI Destekli Kişisel Fitness Yardımcınız**

Pure Life, hedeflerinize ulaşmanız için yapay zeka destekli kişiselleştirilmiş antrenman planları, akıllı beslenme önerileri ve detaylı ilerleme takibi sunan kapsamlı bir fitness uygulamasıdır.

**ÖZELLİKLER:**

🏋️ **Kişiselleştirilmiş Antrenman Planları**
- AI tarafından hedeflerinize özel oluşturulan haftalık antrenman programları
- Kas gruplarına göre optimize edilmiş egzersiz kombinasyonları
- Toparlanma günleri ve yoğunluk ayarlaması
- Video rehberli egzersiz açıklamaları

🥗 **Akıllı Beslenme Takibi**
- 1000+ besin maddesi içeren kapsamlı veritabanı
- Makro besin değerleri (protein, karbonhidrat, yağ) takibi
- Kalori hedeflerine göre günlük plan önerileri
- Türkçe ve İngilizce besin isimleri

📊 **İlerleme Analizi**
- Kilo, yağ oranı ve beden ölçüleri takibi
- Görsel grafikler ve trend analizi
- Haftalık ve aylık karşılaştırmalar
- Hedef takibi ve motivasyon bildirimleri

🤖 **AI Coach Asistanı**
- 7/24 beslenme ve antrenman danışmanlığı
- Kişiselleştirilmiş öneriler
- Sık sorulan soruların cevapları
- Motivasyonel destek

🌍 **Çoklu Dil Desteği**
- Tam Türkçe arayüz
- İngilizce alternatifi
- Yerelleştirilmiş içerik

🎨 **Modern Tasarım**
- Karanlık ve aydınlık tema seçenekleri
- Kullanıcı dostu arayüz
- Hızlı ve responsive performans

**NEDEN PURE LIFE?**

✓ Bilimsel verilere dayalı AI önerileri
✓ Kişiye özel hedef belirleme
✓ Kullanımı kolay ve sezgisel
✓ Reklamsız premium deneyim
✓ Verilerinizin güvenliği

**BAŞLARKEN**

1. Hedeflerinizi belirleyin (kilo verme, kas kazanma, koruma)
2. Fiziksel özelliklerinizi girin
3. AI'ın sizin için oluşturduğu planı inceleyin
4. Günlük aktivitelerinizi takip edin
5. İlerleyişinizi görün ve motive olun!

Pure Life ile sağlıklı yaşam yolculuğunuza bugün başlayın!

---

**Gizlilik**: Verileriniz şifreli olarak saklanır ve üçüncü taraflarla paylaşılmaz.
**Destek**: Sorularınız için ahmetsametyuzlu@gmail.com

## Anahtar Kelimeler (Google Play)

fitness, antrenman, beslenme, kalori, diyet, kilo verme, kas kazanma, AI coach, sağlık, spor, egzersiz, makro, protein, progress tracking, workout planner

## Kategoriler

- **Primary**: Health & Fitness
- **Secondary**: Lifestyle

## Yaş Sınırı

3+ (Tüm yaşlar)

## İçerik Derecelendirmesi

- Alkol/Tütün/Uyuşturucu Referansı: Yok
- Kan/Şiddet: Yok
- Cinsel İçerik: Yok
- Dil: Yok
- Hassas Konular: Yok

## Güncellemeler

Düzenli olarak yeni özellikler ve iyileştirmeler eklenir.
