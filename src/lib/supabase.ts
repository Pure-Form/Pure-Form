import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import * as Linking from "expo-linking";

const extras =
  (Constants.expoConfig?.extra as
    | Record<string, string | undefined>
    | undefined) ??
  (Constants.manifest?.extra as
    | Record<string, string | undefined>
    | undefined) ??
  (Constants.manifestExtra as Record<string, string | undefined> | undefined) ??
  {};

const supabaseUrl =
  extras?.supabaseUrl ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey =
  extras?.supabaseAnonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
const fallbackPasswordRedirect = Linking.createURL("password-reset");
export const supabasePasswordRedirect =
  extras?.supabasePasswordRedirect ??
  process.env.EXPO_PUBLIC_SUPABASE_PASSWORD_REDIRECT ??
  fallbackPasswordRedirect;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are missing. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
