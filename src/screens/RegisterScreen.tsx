import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
  name: "",
  email: "",
  password: "",
  heightCm: "",
  weightKg: "",
};

type ErrorState = typeof initialErrors;

type FormState = {
  name: string;
  email: string;
  password: string;
  heightCm: string;
  weightKg: string;
  goal: GoalOption["value"];
};

type GoalOption = {
  value: "lose" | "maintain" | "gain";
  label: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">;

const RegisterScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { register } = useAuth();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    heightCm: "",
    weightKg: "",
    goal: "lose" as GoalOption["value"],
  });
  const [errors, setErrors] = useState<ErrorState>(initialErrors);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const goalOptions = useMemo<GoalOption[]>(
    () => [
      { value: "lose", label: t("auth.goals.lose") },
      { value: "maintain", label: t("auth.goals.maintain") },
      { value: "gain", label: t("auth.goals.gain") },
    ],
    [t],
  );

  const handleInputChange = (key: keyof FormState, value: string) => {
    setForm((prev: FormState) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    let valid = true;
    setErrors(initialErrors);
    const nextErrors: ErrorState = { ...initialErrors };

    if (!form.name) {
      nextErrors.name = "Required";
      valid = false;
    }
    if (!form.email || !/[^@]+@[^.]+\..+/.test(form.email)) {
      nextErrors.email = "Invalid email";
      valid = false;
    }
    if (form.password.length < 6) {
      nextErrors.password = "At least 6 characters";
      valid = false;
    }
    if (!form.heightCm) {
      nextErrors.heightCm = "Required";
      valid = false;
    }
    if (!form.weightKg) {
      nextErrors.weightKg = "Required";
      valid = false;
    }
    setErrors(nextErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    setLoading(true);
    setFormError("");
    setInfoMessage("");
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      goal: form.goal,
    });
    setLoading(false);
    if (!result.ok) {
      setFormError(result.error ?? "Registration failed. Try again.");
      return;
    }
    if (result.requiresVerification) {
      setInfoMessage("Verify your email address to activate your account.");
    }
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
              {t("auth.createAccount")}
            </Text>
            <Text style={[styles.subtext, { color: theme.colors.subText }]}>
              Your personalised program starts here.
            </Text>
          </View>

          <View>
            <FormTextInput
              label={t("auth.name")}
              value={form.name}
              onChangeText={(value: string) => handleInputChange("name", value)}
              error={errors.name}
            />
            <FormTextInput
              label={t("auth.email")}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(value: string) =>
                handleInputChange("email", value)
              }
              error={errors.email}
            />
            <FormTextInput
              label={t("auth.password")}
              secureTextEntry
              value={form.password}
              onChangeText={(value: string) =>
                handleInputChange("password", value)
              }
              error={errors.password}
            />
            {formError ? (
              <Text style={[styles.errorText, { color: theme.colors.danger }]}>
                {formError}
              </Text>
            ) : null}
            {infoMessage ? (
              <Text style={[styles.infoText, { color: theme.colors.accent }]}>
                {infoMessage}
              </Text>
            ) : null}
            <View style={styles.row}>
              <View style={styles.half}>
                <FormTextInput
                  label={t("auth.height")}
                  keyboardType="number-pad"
                  value={form.heightCm}
                  onChangeText={(value: string) =>
                    handleInputChange("heightCm", value)
                  }
                  error={errors.heightCm}
                />
              </View>
              <View style={styles.half}>
                <FormTextInput
                  label={t("auth.weight")}
                  keyboardType="number-pad"
                  value={form.weightKg}
                  onChangeText={(value: string) =>
                    handleInputChange("weightKg", value)
                  }
                  error={errors.weightKg}
                />
              </View>
            </View>

            <Text style={[styles.label, { color: theme.colors.subText }]}>
              {t("auth.goal")}
            </Text>
            <View style={styles.goalRow}>
              {goalOptions.map((option) => {
                const isActive = option.value === form.goal;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleInputChange("goal", option.value)}
                    style={({ pressed }: { pressed: boolean }) => [
                      styles.goalPill,
                      {
                        backgroundColor: isActive
                          ? theme.colors.accent
                          : theme.colors.surface,
                        borderColor: isActive
                          ? theme.colors.accent
                          : theme.colors.border,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.goalText,
                        {
                          color: isActive
                            ? theme.colors.background
                            : theme.colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              title={t("auth.register")}
              onPress={handleSubmit}
              loading={loading}
            />
            <PrimaryButton
              title={t("auth.switchToLogin")}
              variant="secondary"
              onPress={() => navigation.navigate("Login")}
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  goalRow: {
    flexDirection: "row",
    gap: 12,
  },
  goalPill: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    alignItems: "center",
  },
  goalText: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 13,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    marginTop: 8,
  },
  footer: {
    marginTop: 24,
    gap: 12,
  },
});

export default RegisterScreen;
