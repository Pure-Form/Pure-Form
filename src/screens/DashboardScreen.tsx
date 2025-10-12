import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/StatCard";
import FocusCard from "@/components/FocusCard";
import { getDailySummary, getFocusItems } from "@/services/mockData";

const DashboardScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const summary = getDailySummary();
  const focus = getFocusItems();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}> 
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 32 }]}> 
        <View style={styles.header}> 
          <View>
            <Text style={[styles.welcome, { color: theme.colors.subText }]}>{t("dashboard.greeting", { name: user?.name?.split(" ")[0] ?? "Pure Athlete" })}</Text>
            <Text style={[styles.headline, { color: theme.colors.text }]}>Pure Life</Text>
          </View>
          <View style={[styles.streak, { backgroundColor: theme.colors.accentSoft }]}> 
            <Ionicons name="flame" size={18} color={theme.colors.accent} />
            <Text style={[styles.streakText, { color: theme.colors.accent }]}>{summary.streak} {t("dashboard.streak")}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <StatCard
            title={t("dashboard.calories")}
            value={summary.caloriesRemaining.toString()}
            unit="kcal"
            variant="primary"
            icon={<Ionicons name="flash-outline" size={20} color={theme.colors.text} />}
          />
          <StatCard
            title={t("dashboard.workouts")}
            value={summary.workoutsCompleted.toString()}
            unit="/week"
            icon={<Ionicons name="barbell-outline" size={20} color={theme.colors.accent} />}
          />
        </View>

        <View style={styles.row}>
          <StatCard
            title={t("dashboard.hydration")}
            value={summary.hydrationLiters.toString()}
            unit="L"
            icon={<Ionicons name="water-outline" size={20} color={theme.colors.accent} />}
          />
          <StatCard
            title={t("dashboard.todayPlan")}
            value="45"
            unit="min"
            icon={<Ionicons name="timer-outline" size={20} color={theme.colors.accent} />}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t("dashboard.todayPlan")}</Text>
          <Text style={[styles.sectionAction, { color: theme.colors.accent }]}>{t("dashboard.viewAll")}</Text>
        </View>
        {focus.map((item) => (
          <FocusCard key={item.title} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    paddingHorizontal: 20,
    gap: 24
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  welcome: {
    fontSize: 16
  },
  headline: {
    fontSize: 28,
    fontWeight: "700"
  },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14
  },
  streakText: {
    fontSize: 13,
    fontWeight: "600"
  },
  row: {
    flexDirection: "row"
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700"
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "600"
  }
});

export default DashboardScreen;
