# Pure Life

AI destekli Pure Life mobil uygulaması; günlük kalori takibi, kişisel antrenman planları ve ilerleme analizlerini aynı yerde toplayan iki dilli (Türkçe/İngilizce) bir fitness çözümdür.

## Özellikler
- **Çift Platform**: Expo ile iOS ve Android desteği.
- **Çift Dil**: i18next altyapısı ile Türkçe ve İngilizce arasında anında geçiş.
- **Tema Yönetimi**: Siyah ve elektrik mavisi tonlarında karanlık/aydınlık mod.
- **Kapsamlı Akış**: Onboarding, kayıt/giriş, dashboard, antrenman planlayıcı, ilerleme ve ayarlar sekmeleri.
- **Kalıcı Durum**: AsyncStorage ile tema ve kullanıcı oturumu saklama.

## Kurulum
1. Bağımlılıkları yükleyin: `npm install`
2. Geliştirme sunucusunu başlatın: `npx expo start`
3. Cihaz/Emülatör seçin veya Expo Go uygulamasını kullanarak QR kodunu okutun.

## Uygulama ikonu (logo) yükleme

Elinizdeki görseli uygulamanın ikonuna dönüştürmek için aşağıdaki adımları izleyin:

1. Sağladığınız (ekteki) görseli `assets/source-icon.png` olarak kaydedin.
2. Geliştirme bağımlılıklarını güncelleyin (sharp kullanıyoruz):

```bash
npm install
```

3. İkonları otomatik oluşturun:

```bash
npm run generate:icons
```

Bu komut `assets/icon.png` (iOS / App Store için 1024×1024) ve `assets/adaptive-icon.png` (Android adaptive foreground, 432×432, şeffaf arka plan) dosyalarını oluşturur. `app.config.ts` dosyasında bu yollar zaten işaretlenmiştir, bu nedenle Expo'yu yeniden başlattığınızda yeni ikon kullanılacaktır.

Not: Eğer `sharp` kurulumu sırasında bir hata alırsanız, macOS'ta Xcode Command Line Tools'ın yüklü olduğundan emin olun veya alternatif olarak online araçlarla gerekli boyutları manuel oluşturup `assets/icon.png` ve `assets/adaptive-icon.png` olarak yerleştirebilirsiniz.

## Proje Yapısı
```
App.tsx
src/
  components/
  context/
  navigation/
  screens/
  services/
  theme/
  i18n/
```

## Yapılacaklar
- Gerçek API entegrasyonu ve veri modellerinin bağlanması.
- Tasarımları marka yönergelerine göre güncelleme, özel illüstrasyonlar eklenmesi.
- Bildirimler, Apple/Google oturum açma ve sağlık servisleriyle entegrasyon.
