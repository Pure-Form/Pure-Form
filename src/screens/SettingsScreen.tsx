import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import { RootStackParamList } from "@/navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user, signOut, deleteAccount } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const { hasPermission, requestPermission } = useNotifications();
  const [language, setLanguage] = useState(
    i18n.language.startsWith("tr") ? "tr" : "en",
  );
  const [notificationsEnabled, setNotificationsEnabled] =
    useState(hasPermission);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const extras =
    (Constants.expoConfig?.extra as Record<string, string | undefined>) ??
    (Constants.manifest?.extra as Record<string, string | undefined>) ??
    (Constants.manifestExtra as Record<string, string | undefined> | undefined) ??
    {};

  const privacyPolicyUrl =
    extras?.privacyPolicyUrl ??
    "https://pure-form.github.io/Pure-Form/privacy-policy.html";
  const termsOfServiceUrl =
    extras?.termsOfServiceUrl ??
    "https://pure-form.github.io/Pure-Form/terms-of-service.html";
  const supportEmail = extras?.supportEmail ?? "ahmetsametyuzlu@gmail.com";

  const handleLanguageChange = async (next: "en" | "tr") => {
    setLanguage(next);
    await i18n.changeLanguage(next);
  };

  const openLink = (url: string) => {
    if (!url) {
      Alert.alert(
        t("settings.linkUnavailableTitle") ?? "Link unavailable",
        t("settings.linkUnavailableMessage") ??
          "This resource is not reachable right now.",
      );
      return;
    }

    Linking.openURL(url).catch((error) => {
      console.warn("Failed to open external link", error);
      Alert.alert(
        t("settings.linkUnavailableTitle") ?? "Link unavailable",
        t("settings.linkUnavailableMessage") ??
          "This resource is not reachable right now.",
      );
    });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t("settings.deleteAccountTitle") ?? "Delete account",
      t("settings.deleteAccountMessage") ??
        "This will permanently remove your profile, workout logs, and AI plans.",
      [
        {
          text: t("common.cancel") ?? "Cancel",
          style: "cancel",
        },
        {
          text: t("settings.deleteAccountConfirm") ?? "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeletingAccount(true);
            try {
              const result = await deleteAccount();
              if (!result.ok) {
                Alert.alert(
                  t("settings.deleteAccountErrorTitle") ?? "Failed",
                  result.error ||
                    (t("settings.deleteAccountErrorMessage", {
                      email: supportEmail,
                    }) ?? "Please try again or email support."),
                );
                return;
              }

              Alert.alert(
                t("settings.deleteAccountSuccessTitle") ?? "Account deleted",
                t("settings.deleteAccountSuccessMessage") ??
                  "Your data has been erased and you have been signed out.",
              );
            } catch (error) {
              console.warn("deleteAccount failed", error);
              Alert.alert(
                t("settings.deleteAccountErrorTitle") ?? "Failed",
                t("settings.deleteAccountErrorMessage", {
                  email: supportEmail,
                }) ?? "Please try again or email support.",
              );
            } finally {
              setIsDeletingAccount(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable
          style={styles.profileCard}
          onPress={() => navigation.navigate("ProfileEdit")}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.accentSoft },
            ]}
          >
            <Ionicons name="person" size={28} color={theme.colors.accent} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {user?.name ?? "Pure Athlete"}
            </Text>
            <Text style={[styles.email, { color: theme.colors.subText }]}>
              {user?.email ?? "guest@pure.life"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.subText}
          />
        </Pressable>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>
            {t("settings.theme")}
          </Text>
          <View
            style={[
              styles.row,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.rowText, { color: theme.colors.text }]}>
              {theme.mode === "dark" ? t("settings.dark") : t("settings.light")}
            </Text>
            <Switch
              value={theme.mode === "dark"}
              onValueChange={toggleTheme}
              thumbColor={
                theme.mode === "dark" ? theme.colors.accent : "#f4f3f4"
              }
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accentSoft,
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>
            {t("settings.notifications")}
          </Text>
          <View
            style={[
              styles.row,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={theme.colors.text}
              />
              <Text style={[styles.rowText, { color: theme.colors.text }]}>
                {t("settings.workoutReminders")}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={async (value) => {
                if (value) {
                  const granted = await requestPermission();
                  setNotificationsEnabled(granted);
                } else {
                  setNotificationsEnabled(false);
                }
              }}
              thumbColor={
                notificationsEnabled ? theme.colors.accent : "#f4f3f4"
              }
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accentSoft,
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>
            {t("settings.language")}
          </Text>
          <View style={styles.languageRow}>
            {[
              { code: "en" as const, label: "English" },
              { code: "tr" as const, label: "Türkçe" },
            ].map((option) => {
              const isActive = option.code === language;
              return (
                <Pressable
                  key={option.code}
                  onPress={() => {
                    handleLanguageChange(option.code).catch((error) => {
                      console.warn("Language change failed", error);
                    });
                  }}
                  style={({ pressed }: { pressed: boolean }) => [
                    styles.languageChip,
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
                      styles.languageText,
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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>
            {t("settings.legal") || "Legal"}
          </Text>
          <Pressable
            onPress={() => openLink(privacyPolicyUrl)}
            style={[
              styles.row,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.rowText, { color: theme.colors.text }]}>
              {t("settings.privacyPolicy") || "Privacy Policy"}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.subText}
            />
          </Pressable>
          <Pressable
            onPress={() => openLink(termsOfServiceUrl)}
            style={[
              styles.row,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.rowText, { color: theme.colors.text }]}>
              {t("settings.termsOfService") || "Terms of Service"}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.subText}
            />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>
            {t("settings.support") || "Support"}
          </Text>
          <Pressable
            onPress={() => {
              const mailto = `mailto:${supportEmail}?subject=Pure%20Form%20Support`;
              Linking.openURL(mailto).catch((error) => {
                console.warn("Failed to open email", error);
              });
            }}
            style={[
              styles.row,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.rowText, { color: theme.colors.text }]}>
              {t("settings.contactUs") || "Contact Us"}
            </Text>
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.colors.subText}
            />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>
            {t("settings.dataAndPrivacy") || "Data & Privacy"}
          </Text>
          <Text
            style={[styles.sectionDescription, { color: theme.colors.subText }]}
          >
            {t("settings.deleteAccountDescription") ||
              "Erase your account, workout logs, and AI plans from our servers."}
          </Text>
          <Pressable
            disabled={isDeletingAccount}
            onPress={handleDeleteAccount}
            style={[
              styles.row,
              styles.destructiveRow,
              {
                borderColor: theme.colors.danger,
                backgroundColor: theme.colors.danger + "11",
                opacity: isDeletingAccount ? 0.7 : 1,
              },
            ]}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="trash-outline"
                size={22}
                color={theme.colors.danger}
              />
              <Text
                style={[styles.rowText, { color: theme.colors.danger }]}
              >
                {t("settings.deleteAccount") || "Delete account"}
              </Text>
            </View>
            {isDeletingAccount ? (
              <ActivityIndicator
                size="small"
                color={theme.colors.danger}
              />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.danger}
              />
            )}
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            signOut().catch((error) => {
              console.warn("Failed to sign out", error);
            });
          }}
          style={({ pressed }: { pressed: boolean }) => [
            styles.signOut,
            {
              backgroundColor: theme.colors.danger,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={theme.colors.background}
          />
          <Text
            style={[styles.signOutText, { color: theme.colors.background }]}
          >
            {t("settings.signOut") || "Sign out"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 24,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  email: {
    fontSize: 13,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    textTransform: "uppercase",
  },
  row: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowText: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  languageRow: {
    flexDirection: "row",
    gap: 12,
  },
  languageChip: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600",
  },
  signOut: {
    marginTop: "auto",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "600",
  },
  destructiveRow: {
    borderStyle: "dashed",
  },
});

export default SettingsScreen;
