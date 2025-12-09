# Google Play Submission Checklist

Use this checklist to ship the Android build of **Pure Life** to the Play Store.

## 1. Branding assets
- Run `npm run generate:icons` after updating `assets/source-icon.svg` or `source-icon.png` to refresh `assets/icon.png` and `assets/adaptive-icon.png`.
- Prepare a 512x512 PNG icon (exported from the icon generator), a 1024x500 feature graphic, and at least two 1080x2340 phone screenshots. Store these under `assets/marketing/` for easy reference.

## 2. App configuration
- Verify `app.config.ts` values:
  - `version` / `android.versionCode` / `ios.buildNumber` reflect the release you are shipping.
  - `android.package` is unique (current: `com.purelife.app`).
  - `extra.supabase*` secrets are set through Expo EAS or `.env`.
- Update localized copy (app name, descriptions) in Play Console to match product positioning.

## 3. Build with Expo EAS
1. Sign in: `eas whoami` (or `eas login`).
2. Configure: `eas build:configure` (accept prompts to generate keystore if you do not have one).
3. Release build: `eas build -p android --profile release`.
4. Download the generated `.aab` from the EAS dashboard once the build finishes.

## 4. Google Play Console setup
1. Create the app (App name, Default language, App/ Game, Paid/Free).
2. Complete **Store Listing**: short & full description, icon, feature graphic, screenshots, promo video (optional).
3. Fill **App content**: target audience, content rating questionnaire, ads declaration, privacy policy URL.
4. Set up **Pricing & distribution** (countries, free/paid, consent forms).

## 5. Testing & release
- Create an **Internal** or **Closed testing** track and upload the `.aab`.
- Add tester emails (e.g., `ahmetsametyuzlu@gmail.com`) and roll out the test release.
- Verify the Play Store review checklist is all green before promoting to Production.

---
Keep this document updated for future releases. Add links to marketing assets or privacy policy once they are finalised.
