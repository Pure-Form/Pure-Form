# Pure Form

AI destekli Pure Form mobil uygulaması; günlük kalori takibi, kişisel antrenman planları ve ilerleme analizlerini aynı yerde toplayan iki dilli (Türkçe/İngilizce) bir fitness çözümdür.

## Özellikler
- **Çift Platform**: Expo ile iOS ve Android desteği.
- **Çift Dil**: i18next altyapısı ile Türkçe ve İngilizce arasında anında geçiş.
- **Tema Yönetimi**: Siyah ve elektrik mavisi tonlarında karanlık/aydınlık mod.
- **Kapsamlı Akış**: Onboarding, kayıt/giriş, dashboard, antrenman planlayıcı, ilerleme ve ayarlar sekmeleri.
- **Kalıcı Durum**: AsyncStorage ile tema ve kullanıcı oturumu saklama.

## Kurulum

### 1. Environment Setup
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add your Supabase credentials
# Get these from: https://supabase.com/dashboard/project/_/settings/api
```

**⚠️ IMPORTANT:** Never commit `.env` file to git. It's already in `.gitignore`.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npx expo start
```

### 4. Run on Device/Emulator
- Scan QR code with Expo Go app, or
- Press `i` for iOS simulator, or
- Press `a` for Android emulator

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

## Error Monitoring (Sentry)

Sentry is integrated for production error tracking and performance monitoring.

### Setup Sentry (Optional):

1. Create account at https://sentry.io
2. Create new React Native project
3. Copy DSN from project settings
4. Add to `.env`:
   ```bash
   EXPO_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

### Features:
- ✅ Automatic error capture
- ✅ User context tracking
- ✅ Performance monitoring
- ✅ Breadcrumb tracking
- ✅ Release tracking

**Note:** Sentry is disabled if DSN is not provided (development default).

## Legal & Privacy

- **Privacy Policy**: [docs/privacy-policy.html](./docs/privacy-policy.html)
- **Terms of Service**: [docs/terms-of-service.html](./docs/terms-of-service.html)

Both documents are bundled in the app and reachable through **Settings → Legal** as well as the public URLs configured in `app.config.ts`.

## Account deletion

Pure Form now complies with Apple's in-app account deletion requirement:

- Users can open **Settings → Data & Privacy → Delete account** to wipe their profile, workout logs, saved AI plans, and Supabase auth record.
- The UI calls the Supabase Edge Function `delete-account`, which cascades deletions across `workout_logs`, `coach_plans`, and the user entry.
- Deploy the function and set the service role key before releasing:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" --project-ref <project-ref>
supabase functions deploy delete-account --project-ref <project-ref>
```

Users are immediately signed out once deletion succeeds.

## Security

- Never commit `.env` file
- `.env.example` contains placeholder values only
- Rotate Supabase keys if accidentally exposed
- Enable RLS (Row Level Security) in Supabase for all tables
- Sentry filters sensitive data (passwords, tokens) automatically

## Store Submission

- Follow [docs/guides/STORE_CHECKLIST.md](./docs/guides/STORE_CHECKLIST.md) for both App Store and Play Store requirements.
- The checklist now includes App Privacy question answers, metadata, screenshots, and review notes specific to Apple.

## iOS Build

See [IOS_BUILD_SETUP.md](./IOS_BUILD_SETUP.md) for complete iOS build configuration and troubleshooting guide.
