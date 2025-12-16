# Store Submission Checklist

Use this guide for both the Apple App Store and Google Play Store.

## App Store (iOS)

1. **Branding assets**
  - Run `npm run generate:icons` whenever `assets/source-icon.*` changes.
  - Capture at least 6.7", 6.1", and iPad screenshots (in both languages if possible) from the simulator.
  - Keep privacy policy + terms URLs pointing to `https://pure-form.github.io/Pure-Form/privacy-policy.html` and `https://pure-form.github.io/Pure-Form/terms-of-service.html`.

2. **Compliance prep**
  - Confirm the in-app deletion path is visible: **Settings → Data & Privacy → Delete account**.
  - Deploy the Supabase `delete-account` Edge Function and make sure `SUPABASE_SERVICE_ROLE_KEY` is configured (see README instructions).
  - Review `ios/PureForm/PrivacyInfo.xcprivacy` and App Privacy questionnaire answers:
    - Contact info (email + name): App functionality & account management.
    - Health & Fitness (height, weight, workout logs): App functionality + personalization.
    - Identifiers (user ID): App functionality.
    - Usage Data (product interaction) & Diagnostics (crash data): Analytics & app functionality.
  - Answer the encryption export question with `ITSAppUsesNonExemptEncryption = false` (already in Info.plist).

3. **Build with Expo EAS**
  ```bash
  eas build -p ios --profile release
  ```
  - Upload the `.ipa` from the EAS dashboard to App Store Connect via Transporter.

4. **App Store Connect**
  - Create the app record (name, subtitle, bundle ID `com.pureform.app`).
  - Fill App Information, Pricing and Availability, and the **App Privacy** questionnaire using the data points above.
  - Paste the privacy policy URL into the “General > App Privacy” section and the metadata form.
  - Under **Compliance**, state that the app does not use tracking and encryption is exempt.
  - Provide a reviewer note describing the account deletion steps and any demo credentials if needed.

5. **Review & release**
  - Submit the build for TestFlight first, verify onboarding (signup/login) works, then push to App Review.
  - After approval, choose a release method (manual/automatic/Phased).

## Google Play (Android)

1. **Branding assets**
  - Run `npm run generate:icons` after updating `assets/source-icon.svg` or `source-icon.png` to refresh `assets/icon.png` and `assets/adaptive-icon.png`.
  - Prepare a 512x512 PNG icon (exported from the icon generator), a 1024x500 feature graphic, and at least two 1080x2340 phone screenshots. Store these under `assets/marketing/` for easy reference.

2. **App configuration**
  - Verify `app.config.ts` values:
    - `version` / `android.versionCode` / `ios.buildNumber` reflect the release you are shipping.
    - `android.package` is unique (current: `com.pureform.app`).
    - `extra.supabase*` secrets are set through Expo EAS or `.env`.
  - Update localized copy (app name, descriptions) in Play Console to match product positioning.

3. **Build with Expo EAS**
  1. Sign in: `eas whoami` (or `eas login`).
  2. Configure: `eas build:configure` (accept prompts to generate keystore if you do not have one).
  3. Release build: `eas build -p android --profile release`.
  4. Download the generated `.aab` from the EAS dashboard once the build finishes.

4. **Google Play Console setup**
  1. Create the app (App name, Default language, App/ Game, Paid/Free).
  2. Complete **Store Listing**: short & full description, icon, feature graphic, screenshots, promo video (optional).
  3. Fill **App content**: target audience, content rating questionnaire, ads declaration, privacy policy URL.
  4. Set up **Pricing & distribution** (countries, free/paid, consent forms).

5. **Testing & release**
  - Create an **Internal** or **Closed testing** track and upload the `.aab`.
  - Add tester emails (e.g., `ahmetsametyuzlu@gmail.com`) and roll out the test release.
  - Verify the Play Store review checklist is all green before promoting to Production.

---
Keep this document updated for future releases. Link any new marketing assets or regulatory answers when they change.
