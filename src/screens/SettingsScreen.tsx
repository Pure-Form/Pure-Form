import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const [language, setLanguage] = useState(i18n.language.startsWith("tr") ? "tr" : "en");

  const handleLanguageChange = async (next: "en" | "tr") => {
    setLanguage(next);
    await i18n.changeLanguage(next);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}> 
      <ScrollView contentContainerStyle={styles.container}> 
        <View style={styles.profileCard}> 
          <View style={[styles.avatar, { backgroundColor: theme.colors.accentSoft }]}> 
            <Ionicons name="person" size={28} color={theme.colors.accent} />
          </View>
          <View>
            <Text style={[styles.name, { color: theme.colors.text }]}>{user?.name ?? "Pure Athlete"}</Text>
            <Text style={[styles.email, { color: theme.colors.subText }]}>{user?.email ?? "guest@pure.life"}</Text>
          </View>
        </View>

        <View style={styles.section}> 
          <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>{t("settings.theme")}</Text>
          <View style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
            <Text style={[styles.rowText, { color: theme.colors.text }]}>{theme.mode === "dark" ? t("settings.dark") : t("settings.light")}</Text>
            <Switch
              value={theme.mode === "dark"}
              onValueChange={toggleTheme}
              thumbColor={theme.mode === "dark" ? theme.colors.accent : "#f4f3f4"}
              trackColor={{ false: theme.colors.border, true: theme.colors.accentSoft }}
            />
          </View>
        </View>

        <View style={styles.section}> 
          <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>{t("settings.language")}</Text>
          <View style={styles.languageRow}>
            {(
              [
                { code: "en" as const, label: "English" },
                { code: "tr" as const, label: "Türkçe" }
              ]
            ).map((option) => {
              const isActive = option.code === language;
              return (
                <Pressable
                  key={option.code}
                  onPress={() => {
                    void handleLanguageChange(option.code);
                  }}
                  style={({ pressed }: { pressed: boolean }) => [
                    styles.languageChip,
                    {
                      backgroundColor: isActive ? theme.colors.accent : theme.colors.surface,
                      borderColor: isActive ? theme.colors.accent : theme.colors.border,
                      opacity: pressed ? 0.85 : 1
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.languageText,
                      { color: isActive ? theme.colors.background : theme.colors.text }
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={() => {
            void signOut();
          }}
          style={({ pressed }: { pressed: boolean }) => [
            styles.signOut,
            {
              backgroundColor: theme.colors.danger,
              opacity: pressed ? 0.85 : 1
            }
          ]}
        >
          <Ionicons name="log-out-outline" size={18} color={theme.colors.background} />
          <Text style={[styles.signOutText, { color: theme.colors.background }]}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 24
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  name: {
    fontSize: 18,
    fontWeight: "700"
  },
  email: {
    fontSize: 13
  },
  section: {
    gap: 12
  },
  sectionTitle: {
    fontSize: 14,
    textTransform: "uppercase"
  },
  row: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rowText: {
    fontSize: 16,
    fontWeight: "600"
  },
  languageRow: {
    flexDirection: "row",
    gap: 12
  },
  languageChip: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: "center"
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600"
  },
  signOut: {
    marginTop: "auto",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "600"
  }
});

export default SettingsScreen;
