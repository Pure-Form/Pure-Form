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
