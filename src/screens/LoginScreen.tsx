import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FormTextInput from "@/components/FormTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import type { RootStackParamList } from "@/navigation/AppNavigator";

const initialErrors = {
  email: "",
  password: "",
};

type ErrorState = typeof initialErrors;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  // DEĞİŞİKLİK: signInWithProvider fonksiyonu useAuth'tan çekildi
  const { signIn, requestPasswordReset, signInWithProvider } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ErrorState>(initialErrors);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Fonksiyon: E-posta/Şifre ile Giriş (Mevcut kodunuz)
  const handleSubmit = async () => {
    setErrors(initialErrors);
    setFormError("");
    setInfoMessage("");

    if (!email) {
      setErrors((prev: ErrorState) => ({ ...prev, email: "Email required" }));
      return;
    }
    if (!password) {
      setErrors((prev: ErrorState) => ({
        ...prev,
        password: "Password required",
      }));
      return;
    }

    setLoading(true);
    const result = await signIn({ email, password });
    setLoading(false);
    if (!result.ok) {
      setFormError(result.error ?? "Unable to sign in. Please try again.");
      return;
    }
    if (result.requiresVerification) {
      setInfoMessage(
        "Check your inbox to verify your email address before signing in.",
      );
    }
  };

  // YENİ FONKSİYON: SSO ile Giriş
  const handleSSOSignIn = async (provider: 'google' | 'apple') => {
    setFormError("");
    setInfoMessage("");
    setLoading(true);

    // Context'ten gelen signInWithProvider fonksiyonunu kullan
    const result = await signInWithProvider(provider);
    
    // AuthContext'teki loading state'i genellikle SSO akışını yönetir,
    // ancak yerel loading state'ini de güncelleyelim.
    setLoading(false);

    if (!result.ok) {
      setFormError(result.error ?? `Unable to sign in with ${provider}. Please try again.`);
      return;
    }
    // Başarılı olursa, useAuth'taki onAuthStateChange yönlendirmeyi halledecektir.
  };

  // Fonksiyon: Şifre Sıfırlama (Mevcut kodunuz)
  const handlePasswordReset = async () => {
    setFormError("");
    setInfoMessage("");
    if (!email) {
      setErrors((prev: ErrorState) => ({ ...prev, email: "Email required" }));
      return;
    }

    setLoading(true);
    const result = await requestPasswordReset(email);
    setLoading(false);

    if (!result.ok) {
      setFormError(result.error ?? "Password reset failed. Try again later.");
      return;
    }
    setInfoMessage("Reset link sent. Please check your email.");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.headline, { color: theme.colors.text }]}>
              {t("auth.welcomeBack")}
            </Text>
            <Text style={[styles.subtext, { color: theme.colors.subText }]}>
              Track nutrition, workouts and progress in one place.
            </Text>
          </View>

          <View>
            <FormTextInput
              label={t("auth.email")}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            <FormTextInput
              label={t("auth.password")}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />
            {formError ? (
              <Text style={[styles.error, { color: theme.colors.danger }]}>
                {formError}
              </Text>
            ) : null}
            {infoMessage ? (
              <Text style={[styles.info, { color: theme.colors.accent }]}>
                {infoMessage}
              </Text>
            ) : null}
            <Text
              style={[styles.link, { color: theme.colors.accent }]}
              onPress={handlePasswordReset}
            >
              {t("auth.forgotPassword", "Forgot password?")}
            </Text>
          </View>

          <View style={styles.footer}>
            {/* E-posta/Şifre Giriş Butonu */}
            <PrimaryButton
              title={t("auth.login")}
              onPress={handleSubmit}
              loading={loading}
            />
            
            {/* YENİ BÖLÜM BAŞLANGICI: SSO Butonları */}
            <View style={styles.separatorContainer}>
              <View style={[styles.separator, { backgroundColor: theme.colors.subText }]} />
              <Text style={[styles.separatorText, { color: theme.colors.subText }]}>
                {t("auth.or", "OR")}
              </Text>
              <View style={[styles.separator, { backgroundColor: theme.colors.subText }]} />
            </View>

            {/* Google Butonu */}
            <PrimaryButton
              title="Google ile Giriş Yap" // T-key kullanmanızı öneririm: t("auth.loginWithGoogle")
              onPress={() => handleSSOSignIn('google')}
              loading={loading}
              variant="tertiary" // Farklı bir stil verebilirsiniz
            />

            {/* Apple Butonu */}
            {/* Platform.OS kontrolü, Apple butonu için iyi bir uygulamadır */}
            {Platform.OS === 'ios' && (
                <PrimaryButton
                    title="Apple ile Giriş Yap" // T-key kullanmanızı öneririm: t("auth.loginWithApple")
                    onPress={() => handleSSOSignIn('apple')}
                    loading={loading}
                    variant="tertiary"
                />
            )}
            {/* YENİ BÖLÜM BİTİŞİ */}


            {/* Kayıt Ol Butonu */}
            <PrimaryButton
              title={t("auth.switchToRegister")}
              variant="secondary"
              onPress={() => navigation.navigate("Register")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    gap: 8,
    marginBottom: 24,
  },
  headline: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtext: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    marginTop: 24,
    gap: 12,
  },
  error: {
    marginTop: 8,
    fontSize: 13,
  },
  info: {
    marginTop: 8,
    fontSize: 13,
  },
  link: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  // YENİ STİLLER
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  separator: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
});

export default LoginScreen;
