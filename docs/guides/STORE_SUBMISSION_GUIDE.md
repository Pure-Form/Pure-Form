# 🚀 Pure Form - Store Submission Guide

## 📱 App Store (iOS) Submission

### 1. EAS Build ile Production Binary Oluşturma
```bash
# Production build başlat
eas build --platform ios --profile production

# Build durumunu takip et
eas build:list
```

### 2. App Store Connect Hazırlığı

#### A. Gerekli Bilgiler
- **App Name**: Pure Form
- **Bundle ID**: com.pureform.app
- **Version**: 1.0.0
- **Build Number**: 1 (otomatik artacak)
- **Primary Language**: Turkish
- **Category**: Health & Fitness
- **Content Rating**: 12+

#### B. Store Listing (Türkçe)

**Başlık** (30 karakter max):
```
Pure Form - AI Fitness Coach
```

**Alt Başlık** (30 karakter max):
```
Kişisel Antrenman ve Beslenme
```

**Açıklama** (4000 karakter max):
```
🏋️ Pure Form ile Hedeflerinize Ulaşın!

Pure Form, yapay zeka destekli kişisel fitness koçunuz. Antrenman programları, beslenme planları ve ilerleme takibi ile sağlıklı yaşam hedefinize ulaşın.

✨ ÖNE ÇIKAN ÖZELLİKLER

🤖 AI Koç
• Kişiselleştirilmiş antrenman programları
• Anlık soru-cevap desteği
• Hedef odaklı planlama
• 7/24 akıllı asistan

💪 Antrenman Planlayıcı
• Haftalık egzersiz programları
• Video ve görselli egzersizler
• Set ve tekrar takibi
• İlerleme kayıtları

🥗 Beslenme Kütüphanesi
• 1000+ Türk yemeği verisi
• Kalori ve makro hesaplama
• Öğün planlama
• Besin değerleri analizi

📊 İlerleme Takibi
• Ağırlık grafikleri
• Vücut ölçüleri
• Antrenman istatistikleri
• Başarı rozetleri

🎯 Hedef Yönetimi
• Kilo verme/alma
• Kas yapma
• Dayanıklılık artırma
• Form tutma

🔐 GÜVENLİK ve GİZLİLİK
• GDPR ve CCPA uyumlu
• Verileriniz şifrelenmiş
• İstediğiniz zaman verilerinizi silebilirsiniz
• Reklamsız deneyim

💎 NEDEN PURE FORM?
• %100 Türkçe arayüz
• Türk mutfağına özel beslenme verisi
• Yapay zeka destekli kişiselleştirme
• Kullanıcı dostu tasarım
• Sürekli güncellenen içerik

📱 TEKNİK ÖZELLİKLER
• Offline çalışma desteği
• iCloud senkronizasyonu
• Dark mode desteği
• Widget desteği
• Apple Health entegrasyonu (yakında)

⚠️ ÖNEMLİ NOTLAR
Pure Form bir sağlık danışmanlığı hizmeti değildir. Medikal tavsiye sunmaz. Ciddi sağlık sorunları için lütfen bir sağlık profesyoneline danışın.

🎁 BAŞLARKEN
1. Hesap oluşturun (email ile)
2. Hedeflerinizi belirleyin
3. Vücut ölçülerinizi girin
4. AI koçunuzdan plan alın
5. Antrenmanınıza başlayın!

📧 DESTEK
Sorularınız için: support@pureform.app
Geri bildirim: feedback@pureform.app

🌟 Pure Form ile sağlıklı yaşamınız başlıyor!
```

**Anahtar Kelimeler** (100 karakter max):
```
fitness,antrenman,spor,beslenme,diyet,kilo,AI,yapay zeka,sağlık
```

**Promotional Text** (170 karakter - opsiyonel):
```
🚀 Yeni: AI destekli kişisel antrenman planları! Hedeflerinize ulaşmak için yapay zeka koçunuzla tanışın. Hemen deneyin!
```

**Support URL**:
```
https://pureform.app/support
```

**Marketing URL**:
```
https://pureform.app
```

**Privacy Policy URL**:
```
https://github.com/Pure-Form/Pure-Form/blob/main/assets/legal/privacy-policy.md
```

#### C. Screenshots
- **Gerekli**: iPhone 6.7" (1290x2796) - 3-10 arası
- **Lokasyon**: `assets/marketing/screenshots/`
- Yükleme sırası:
  1. 01-onboarding.png
  2. 02-dashboard.png
  3. 03-weekly-plan.png
  4. 04-nutrition.png
  5. 05-progress.png
  6. 06-ai-coach.png
  7. 07-settings.png

#### D. App Store Review Bilgileri
**Demo Account** (test için gerekli):
- Email: demo@pureform.app
- Password: Demo123!

**Review Notes**:
```
Merhaba Apple Review Team,

Pure Form, AI destekli bir fitness koçu uygulamasıdır. 

Test için demo hesap:
Email: demo@pureform.app
Password: Demo123!

Önemli notlar:
1. Uygulama medikal tavsiye sunmaz (disclaimer eklenmiştir)
2. Supabase backend kullanır
3. Sentry ile hata takibi yapılır
4. GDPR/CCPA uyumludur
5. Veri silme özelliği Settings > Delete Account'ta

Teşekkürler!
```

### 3. App Store Connect Adımları

1. **App Store Connect'e giriş yapın**: https://appstoreconnect.apple.com
2. **My Apps > + simgesi > New App**
3. Bilgileri doldurun:
   - Platform: iOS
   - Name: Pure Form
   - Primary Language: Turkish
   - Bundle ID: com.pureform.app
   - SKU: pureform-ios-001
4. **App Information** sekmesi:
   - Category: Health & Fitness
   - Privacy Policy URL ekleyin
5. **Pricing and Availability**:
   - Price: Free
   - Availability: All countries
6. **Prepare for Submission**:
   - Screenshots yükleyin
   - App Description, keywords, support URL ekleyin
   - Build'i seçin (EAS'tan gelen)
   - Content Rights seçin
   - Age Rating: 12+
7. **Submit for Review**

---

## 🤖 Google Play Store (Android) Submission

### 1. EAS Build ile Production Binary Oluşturma
```bash
# Production build başlat
eas build --platform android --profile production

# Build durumunu takip et
eas build:list
```

### 2. Google Play Console Hazırlığı

#### A. Gerekli Bilgiler
- **App Name**: Pure Form
- **Package Name**: com.pureform.app
- **Version**: 1.0.0
- **Version Code**: 2
- **Default Language**: Turkish (Türkiye)
- **Category**: Health & Fitness
- **Content Rating**: PEGI 3

#### B. Store Listing (Türkçe)

**App Name** (50 karakter max):
```
Pure Form - AI Fitness ve Beslenme Koçu
```

**Kısa Açıklama** (80 karakter max):
```
AI destekli kişisel antrenman ve beslenme planı. Hedeflerinize ulaşın!
```

**Tam Açıklama** (4000 karakter max):
```
🏋️ Pure Form ile Hedeflerinize Ulaşın!

Pure Form, yapay zeka destekli kişisel fitness koçunuz. Antrenman programları, beslenme planları ve ilerleme takibi ile sağlıklı yaşam hedefinize ulaşın.

✨ ÖNE ÇIKAN ÖZELLİKLER

🤖 AI Koç
• Kişiselleştirilmiş antrenman programları
• Anlık soru-cevap desteği
• Hedef odaklı planlama
• 7/24 akıllı asistan

💪 Antrenman Planlayıcı
• Haftalık egzersiz programları
• Video ve görselli egzersizler
• Set ve tekrar takibi
• İlerleme kayıtları

🥗 Beslenme Kütüphanesi
• 1000+ Türk yemeği verisi
• Kalori ve makro hesaplama
• Öğün planlama
• Besin değerleri analizi

📊 İlerleme Takibi
• Ağırlık grafikleri
• Vücut ölçüleri
• Antrenman istatistikleri
• Başarı rozetleri

🎯 Hedef Yönetimi
• Kilo verme/alma
• Kas yapma
• Dayanıklılık artırma
• Form tutma

🔐 GÜVENLİK ve GİZLİLİK
• GDPR ve CCPA uyumlu
• Verileriniz şifrelenmiş
• İstediğiniz zaman verilerinizi silebilirsiniz
• Reklamsız deneyim

💎 NEDEN PURE FORM?
• %100 Türkçe arayüz
• Türk mutfağına özel beslenme verisi
• Yapay zeka destekli kişiselleştirme
• Kullanıcı dostu tasarım
• Sürekli güncellenen içerik

📱 TEKNİK ÖZELLİKLER
• Offline çalışma desteği
• Cloud senkronizasyonu
• Dark mode desteği
• Widget desteği
• Google Fit entegrasyonu (yakında)

⚠️ ÖNEMLİ NOTLAR
Pure Form bir sağlık danışmanlığı hizmeti değildir. Medikal tavsiye sunmaz. Ciddi sağlık sorunları için lütfen bir sağlık profesyoneline danışın.

🎁 BAŞLARKEN
1. Hesap oluşturun (email ile)
2. Hedeflerinizi belirleyin
3. Vücut ölçülerinizi girin
4. AI koçunuzdan plan alın
5. Antrenmanınıza başlayın!

📧 DESTEK
Sorularınız için: support@pureform.app
Geri bildirim: feedback@pureform.app

🌟 Pure Form ile sağlıklı yaşamınız başlıyor!

---

İzinler:
• İnternet: Veri senkronizasyonu
• Depolama: Resim ve önbellek
```

#### C. Graphics Assets

**App Icon**:
- 512x512 PNG
- Lokasyon: `assets/marketing/play-store-icon.png`

**Feature Graphic**:
- 1024x500 JPG/PNG
- Lokasyon: `assets/marketing/feature-graphic.png`

**Screenshots**:
- 2-8 arası, 1080x2340 (telefon)
- Lokasyon: `assets/marketing/screenshots/` (resize gerekli)

**Promo Video** (opsiyonel):
- YouTube URL
- 30 saniye - 2 dakika

#### D. Content Rating Questionnaire
1. **Violence**: Hayır
2. **Sexuality**: Hayır
3. **Language**: Hayır
4. **Drugs**: Hayır
5. **Gambling**: Hayır
6. **User Interaction**: Evet (chat özelliği)
7. **Location Sharing**: Hayır
8. **Personal Info**: Evet (email, boy, kilo)

**Sonuç**: PEGI 3 veya Everyone

#### E. Privacy Policy
```
https://github.com/Pure-Form/Pure-Form/blob/main/assets/legal/privacy-policy.md
```

### 3. Google Play Console Adımları

1. **Play Console'a giriş**: https://play.google.com/console
2. **Create App**
3. Bilgileri doldurun:
   - App name: Pure Form
   - Default language: Turkish
   - App or game: App
   - Free or paid: Free
4. **Store Listing**:
   - App name, descriptions ekleyin
   - Screenshots, icon, feature graphic yükleyin
   - Categorization: Health & Fitness
   - Contact details: support@pureform.app
   - Privacy Policy URL
5. **Content Rating**:
   - Questionnaire'i doldurun
   - Certificate alın
6. **App Content**:
   - Privacy Policy onaylayın
   - Ads: No ads
   - Target audience: 13+
7. **Release**:
   - Production track seçin
   - Countries: All
   - App Bundle yükleyin (EAS'tan gelen .aab)
8. **Review and Publish**

---

## 🔑 Signing & Credentials

### iOS
```bash
# Apple Developer hesabınızla login
eas credentials

# Credential management
eas credentials --platform ios
```

### Android
```bash
# Keystore oluştur/yönet
eas credentials --platform android
```

**Not**: EAS otomatik credential management kullanır. Manuel müdahale genelde gerekmez.

---

## 📊 Store Optimization (ASO)

### Keywords Research (Türkçe)
**Birincil**:
- fitness, antrenman, spor, egzersiz
- beslenme, diyet, kalori, kilo
- AI, yapay zeka, koç

**İkincil**:
- kas, form, sağlık, zayıflama
- protein, makro, öğün, yemek
- haftalık plan, program

### Conversion Optimization
1. **İlk screenshot**: En etkileyici özellik (AI Coach)
2. **Icon**: Net, tanınabilir, farklı
3. **Description**: İlk 2 satır kritik
4. **Reviews**: Kullanıcılardan feedback isteyin

---

## 🚨 Pre-Launch Checklist

### Teknik
- [ ] Production build başarılı
- [ ] Sentry DSN production ortamda set
- [ ] Supabase production DB hazır
- [ ] API rate limitler ayarlandı
- [ ] Error tracking çalışıyor
- [ ] Analytics entegre (opsiyonel)

### Yasal
- [ ] Privacy Policy erişilebilir
- [ ] Terms of Service erişilebilir
- [ ] GDPR compliance kontrol edildi
- [ ] Medical disclaimer açık
- [ ] Data deletion flow test edildi

### İçerik
- [ ] 7 screenshot hazır
- [ ] Feature graphic hazır
- [ ] App icon 1024x1024
- [ ] Store descriptions yazıldı
- [ ] Keywords belirlendi
- [ ] Demo account oluşturuldu

### Testing
- [ ] iOS physical device test
- [ ] Android physical device test
- [ ] Sign up flow test
- [ ] Payment flow test (varsa)
- [ ] Crash test
- [ ] Network error test
- [ ] Offline mode test

---

## 📱 Launch Day

### 1. Sabah (09:00)
- [ ] Son build kontrolü
- [ ] Production ortam health check
- [ ] Sentry dashboard açık
- [ ] Support email aktif

### 2. Submission
- [ ] iOS: Submit for Review
- [ ] Android: Publish to Production
- [ ] Social media announcement hazır
- [ ] Landing page canlı

### 3. Monitoring
- [ ] Crash rate < 1%
- [ ] Response time < 2s
- [ ] Success rate > 95%
- [ ] User feedback takibi

---

## 🎯 Post-Launch

### İlk Gün
- Crash monitoring (her saat)
- User reviews yanıtlama
- Analytics takibi
- Server load monitoring

### İlk Hafta
- Bug fix release hazırlığı
- Feature request toplama
- A/B test planlama
- ASO optimizasyonu

### İlk Ay
- Version 1.1 planning
- User retention analizi
- Marketing strategy review
- Feature roadmap güncelleme

---

## 🆘 Support Hazırlığı

### FAQ Hazırlayın
1. Nasıl kayıt olunur?
2. Şifremi unuttum
3. Hesabımı nasıl silerim?
4. Verilerim güvende mi?
5. Offline çalışır mı?

### Support Channels
- **Email**: support@pureform.app (otomatik yanıt + 24h SLA)
- **In-app**: Settings > Help & Support
- **Social Media**: Twitter, Instagram

### Crisis Management
- **Critical Bug**: 1h içinde hotfix
- **Server Down**: Status page + bildirim
- **Security Issue**: Immediate action + disclosure

---

## 📈 Metrics to Track

### Technical
- Crash-free rate
- ANR (Android)
- App startup time
- API response time
- Error rate

### Business
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Retention (D1, D7, D30)
- Session length
- Conversion rate

### Store
- Impressions
- Downloads
- Conversion rate
- Reviews rating
- Keyword rankings

---

## ✅ Hızlı Başlangıç Komutları

```bash
# 1. Production build başlat
eas build --platform ios --profile production
eas build --platform android --profile production

# 2. Build takibi
eas build:list

# 3. Build indir
eas build:download --platform ios --latest
eas build:download --platform android --latest

# 4. Submit (build tamamlandıktan sonra)
eas submit --platform ios
eas submit --platform android

# 5. Version bump (sonraki release için)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

---

## 📞 Yardım

**EAS Documentation**: https://docs.expo.dev/eas/
**App Store Connect**: https://help.apple.com/app-store-connect/
**Google Play Console**: https://support.google.com/googleplay/android-developer/

**Pure Form Team**: dev@pureform.app
