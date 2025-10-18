import React, { useState } from "react";
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

const initialErrors = {
  password: "",
  confirmPassword: "",
};

type ErrorState = typeof initialErrors;

const ResetPasswordScreen = () => {
  const { theme } = useTheme();
  const { completePasswordReset, pendingPasswordReset } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ErrorState>(initialErrors);
  const [formError, setFormError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErrors(initialErrors);
    setFormError("");
    setInfoMessage("");

    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password required" }));
      return;
    }

    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    setLoading(true);
    const result = await completePasswordReset(password);
    setLoading(false);

    if (!result.ok) {
      setFormError(
        result.error ?? "Unable to reset password. Please try again.",
      );
      return;
    }

    setInfoMessage("Password updated. You can now continue using the app.");
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
              Reset Password
            </Text>
            <Text style={[styles.subtext, { color: theme.colors.subText }]}>
              {pendingPasswordReset
                ? "Enter a new password to secure your account."
                : "The reset link has expired or is invalid. Please request a new one from the login screen."}
            </Text>
          </View>

          {pendingPasswordReset ? (
            <View>
              <FormTextInput
                label="New Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                error={errors.password}
              />

              <FormTextInput
                label="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
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

              <View style={styles.footer}>
                <PrimaryButton
                  title="Update Password"
                  onPress={handleSubmit}
                  loading={loading}
                />
              </View>
            </View>
          ) : null}
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
});

export default ResetPasswordScreen;
