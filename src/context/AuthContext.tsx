import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// YENİ IMPORTLAR: SSO akışını yönetmek için gerekli
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

import { supabase, supabasePasswordRedirect } from "@/lib/supabase";

// Expo SSO için hazırlık: Uygulamanın tarayıcı geri dönüşünü tanımasını sağlar
WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  heightCm: number;
  weightKg: number;
  goal: "lose" | "maintain" | "gain";
};

type Credentials = {
  email: string;
  password: string;
};

type RegistrationPayload = Credentials & {
  name: string;
  heightCm: number;
  weightKg: number;
  goal: AuthUser["goal"];
};

type AuthResult = {
  ok: boolean;
  error?: string;
  requiresVerification?: boolean;
};

// YENİ TIP: SSO Sağlayıcıları
type Provider = "google" | "apple";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (creds: Credentials) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  register: (payload: RegistrationPayload) => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  completePasswordReset: (password: string) => Promise<AuthResult>;
  pendingPasswordReset: boolean;
  // YENİ ALAN: SSO fonksiyonu Context'e eklendi
  signInWithProvider: (provider: Provider) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const defaultGoal: AuthUser["goal"] = "maintain";

const mapUserFromSupabase = (incoming: User): AuthUser => {
  const metadata = (incoming.user_metadata ?? {}) as Partial<
    AuthUser & {
      goal?: AuthUser["goal"];
    }
  >;

  return {
    id: incoming.id,
    email: incoming.email ?? "",
    name: metadata.name ?? "",
    heightCm: Number(metadata.heightCm ?? 0),
    weightKg: Number(metadata.weightKg ?? 0),
    goal: (metadata.goal as AuthUser["goal"]) ?? defaultGoal,
  };
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPasswordReset, setPendingPasswordReset] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Failed to load session", error.message);
        }
        const currentUser = data.session?.user ?? null;
        setUser(currentUser ? mapUserFromSupabase(currentUser) : null);
      } catch (error) {
        console.warn("Unexpected session restore failure", error);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    const parseRecoveryParams = (url: string | null) => {
      if (!url) {
        return null;
      }

      const { queryParams, path } = Linking.parse(url);
      const hashSection = url.includes("#") ? (url.split("#")[1] ?? "") : "";
      const hashParams = new URLSearchParams(hashSection);

      const params = new URLSearchParams();

      Object.entries(queryParams ?? {}).forEach(([key, value]) => {
        if (typeof value === "string") {
          params.set(key, value);
        }
      });

      hashParams.forEach((value, key) => {
        params.set(key, value);
      });

      const type = params.get("type") ?? params.get("event");

      if (!type || type !== "recovery") {
        return null;
      }

      return {
        accessToken: params.get("access_token") ?? undefined,
        refreshToken: params.get("refresh_token") ?? undefined,
        token: params.get("token") ?? undefined,
        email: params.get("email") ?? undefined,
        path,
      };
    };

    const handleDeepLink = async (incomingUrl: string | null) => {
      const parsed = parseRecoveryParams(incomingUrl);
      if (!parsed) {
        return;
      }

      try {
        if (parsed.accessToken && parsed.refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: parsed.accessToken,
            refresh_token: parsed.refreshToken,
          });
          if (error) {
            console.warn(
              "Failed to restore session from recovery link",
              error.message,
            );
            return;
          }
        } else if (parsed.token && parsed.email) {
          const { error } = await supabase.auth.verifyOtp({
            type: "recovery",
            email: parsed.email,
            token: parsed.token,
          });
          if (error) {
            console.warn(
              "Failed to verify OTP from recovery link",
              error.message,
            );
            return;
          }
        }

        setPendingPasswordReset(true);
      } catch (error) {
        console.warn("Unexpected error while handling recovery link", error);
      }
    };

    const subscribeToDeepLinks = () => {
      const subscription = Linking.addEventListener("url", (event) => {
        handleDeepLink(event.url).catch((error) => {
          console.warn("Deep link handling failed", error);
        });
      });
      return () => subscription.remove();
    };

    Linking.getInitialURL()
      .then((initialUrl) => handleDeepLink(initialUrl))
      .catch((error) => {
        console.warn("Failed to load initial link", error);
      });

    const unsubscribe = subscribeToDeepLinks();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (
          event === "INITIAL_SESSION" ||
          event === "TOKEN_REFRESHED" ||
          event === "SIGNED_IN" ||
          event === "USER_UPDATED"
        ) {
          const currentUser = session?.user ?? null;
          setUser(currentUser ? mapUserFromSupabase(currentUser) : null);
        }

        if (event === "PASSWORD_RECOVERY") {
          setPendingPasswordReset(true);
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          setPendingPasswordReset(false);
        }
      },
    );

    return () => {
      unsubscribe();
      subscription.unsubscribe();
    };
  }, []);

  const register = useCallback(
    async (payload: RegistrationPayload): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            name: payload.name,
            heightCm: payload.heightCm,
            weightKg: payload.weightKg,
            goal: payload.goal,
          },
        },
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      if (data.user) {
        setUser(mapUserFromSupabase(data.user));
      }

      return {
        ok: true,
        requiresVerification: !data.session,
      };
    },
    [],
  );

  const signIn = useCallback(
    async ({ email, password }: Credentials): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      if (data.user) {
        setUser(mapUserFromSupabase(data.user));
      }

      return { ok: true };
    },
    [],
  );
  
  // YENİ FONKSİYON: SSO (Google/Apple) ile Oturum Açma Mantığı
  const signInWithProvider = useCallback(
    async (provider: Provider): Promise<AuthResult> => {
      setLoading(true);
      try {
        // 1. Geri Dönüş URL'sini Oluşturma
        const redirectUrl = AuthSession.makeRedirectUri({
          path: '/auth/callback',
        });
        
        // 2. Supabase'ten OAuth (SSO) Başlatma URL'sini Alma
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true, // Expo'nun tarayıcıyı açmasını sağlar
          },
        });

        if (error) {
          throw new Error(`SSO Başlatma Hatası: ${error.message}`);
        }

        if (data?.url) {
          // 3. Tarayıcı Penceresini Açma ve Akışı Yönetme
          const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

          // 4. Başarılı Geri Dönüşü Yakalama ve Oturumu Doğrulama
          if (result.type === 'success' && result.url) {
            // Supabase'in bu URL'den gelen oturum bilgisini işlemesini sağla
            await supabase.auth.getSessionFromUrl({ url: result.url });
            // onAuthStateChange dinleyicisi zaten user/session durumunu otomatik güncelleyecektir.
          }
        }
        
        // Hata olmadıkça başarılı sayılır
        return { ok: true };

      } catch (e: any) {
        console.error(`SSO Giriş İşlemi Hata Verdi (${provider}):`, e.message);
        return { ok: false, error: e.message || 'Bilinmeyen SSO hatası' };
      } finally {
        setLoading(false);
      }
    },
    [],
  );
  // YENİ FONKSİYON BİTİŞİ

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("Sign-out failed", error.message);
    }
    setUser(null);
    setPendingPasswordReset(false);
  }, []);

  const requestPasswordReset = useCallback(
    async (email: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: supabasePasswordRedirect || undefined,
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      return { ok: true };
    },
    [],
  );

  const completePasswordReset = useCallback(
    async (password: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.updateUser({ password });

      if (error) {
        return { ok: false, error: error.message };
      }

      if (data.user) {
        setUser(mapUserFromSupabase(data.user));
      }

      setPendingPasswordReset(false);
      return { ok: true };
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
      register,
      requestPasswordReset,
      completePasswordReset,
      pendingPasswordReset,
      // YENİ ALAN: SSO fonksiyonu context değerine dahil edildi
      signInWithProvider,
    }),
    [
      completePasswordReset,
      loading,
      pendingPasswordReset,
      register,
      requestPasswordReset,
      signIn,
      signOut,
      user,
      // Yeni eklenen bağımlılık
      signInWithProvider,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
