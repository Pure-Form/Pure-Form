import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useTheme } from "@/context/ThemeContext";
import type { RootStackParamList } from "@/navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <LinearGradient colors={["#06101E", "#020205"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.illustrationWrapper}>
            <LinearGradient
              colors={[theme.colors.accent, theme.colors.accentSoft]}
              style={styles.illustration}
            >
              <View style={styles.innerGlow} />
            </LinearGradient>
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.headline, { color: theme.colors.text }]}>
              {t("onboarding.headline")}
            </Text>
            <Text style={[styles.body, { color: theme.colors.subText }]}>
              {t("onboarding.body")}
            </Text>
          </View>
          <View style={styles.buttons}>
            <PrimaryButton
              title={t("onboarding.getStarted")}
              onPress={() => navigation.navigate("Register")}
            />
            <PrimaryButton
              title={t("onboarding.login")}
              variant="secondary"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  illustrationWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: 260,
    height: 260,
    borderRadius: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  innerGlow: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  textBlock: {
    gap: 16,
  },
  headline: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttons: {
    gap: 12,
  },
});

export default OnboardingScreen;
