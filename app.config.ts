import type { ExpoConfig } from "@expo/config-types";
import "dotenv/config";

const config: ExpoConfig = {
  name: "Pure Life",
  slug: "pure-life",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "purelife",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#020205",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.purelife.app",
    buildNumber: "1",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#020205",
    },
    package: "com.purelife.app",
    versionCode: 1,
  },
  web: {
    bundler: "metro",
  },
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 34,
          kotlinVersion: "1.9.24",
        },
      },
    ],
    "expo-font",
  ],
    extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
    supabasePasswordRedirect:
      process.env.EXPO_PUBLIC_SUPABASE_PASSWORD_REDIRECT ?? "",
    eas: {
      projectId: "601cfd90-5fe3-4c18-9edc-9f28146c3b64",
    },
  },
};

export default config;
