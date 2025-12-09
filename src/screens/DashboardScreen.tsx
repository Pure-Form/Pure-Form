import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FocusCard from "@/components/FocusCard";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/context/AuthContext";
import { useCoach } from "@/context/CoachContext";
import { useTheme } from "@/context/ThemeContext";
import { useWorkoutLog } from "@/context/WorkoutLogContext";
import { getDailySummary } from "@/services/mockData";
import { WEEK_DAYS, type FocusItem, type WeekdayKey } from "@/types/coach";

const JS_WEEKDAY_TO_KEY: WeekdayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const FALLBACK_FOCUS: FocusItem[] = [
  {
    title: "Aktif Yaşam",
    subtitle: "Hafif yürüyüşle toparlanmayı destekle.",
    time: "30 dk",
    icon: "recovery",
  },
  {
    title: "Makro Kontrol",
    subtitle: "Protein hedefini yakalamayı unutma.",
    time: "Tüm gün",
    icon: "nutrition",
  },
];

const DashboardScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { state } = useCoach();
  const { completedWorkouts } = useWorkoutLog();

  const fallbackSummary = getDailySummary();
  const profile = state.profile;
  const summary = state.summary;
  const schedule = state.schedule;

  // Calculate this week's completed workouts
  const weeklyCompletedCount = Object.keys(completedWorkouts).length;

  const todayKey = JS_WEEKDAY_TO_KEY[new Date().getDay()];
  const todaySchedule = useMemo(
    () =>
      schedule.find((item) => item.dayKey === todayKey) ?? schedule[0] ?? null,
    [schedule, todayKey],
  );

  const focusItems: FocusItem[] = useMemo(() => {
    if (!todaySchedule || !summary) {
      return FALLBACK_FOCUS;
    }

    const items: FocusItem[] = [];
    const workout = todaySchedule.workout;
    items.push({
      title: workout.isRestDay ? "Rekor Toparlanma" : workout.label,
      subtitle: workout.isRestDay
        ? "Esneme, yürüyüş ve uykuya odaklan."
        : workout.description,
      time: workout.isRestDay ? "Tüm gün" : `${workout.durationMinutes} dk`,
      icon: workout.isRestDay ? "recovery" : "barbell",
    });

    if (todaySchedule.diet) {
      const topMeals = todaySchedule.diet.meals
        .slice(0, 2)
        .map((meal) => meal.name)
        .join(" • ");
      items.push({
        title: "Beslenme Planı",
        subtitle: `${todaySchedule.diet.totalCalories} kcal • ${topMeals}`,
        time: "Tüm gün",
        icon: "nutrition",
      });
    }

    const nextWorkout = schedule
      .filter((item) => item.dayKey !== todaySchedule.dayKey)
      .find((item) => !item.workout.isRestDay);

    if (nextWorkout) {
      const label =
        WEEK_DAYS.find((day) => day.key === nextWorkout.dayKey)?.label ??
        nextWorkout.dayKey;
      items.push({
        title: "Sıradaki Antrenman",
        subtitle: nextWorkout.workout.label,
        time: label,
        icon: "calendar",
      });
    }

    return items;
  }, [schedule, summary, todaySchedule]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 32 }]}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcome, { color: theme.colors.subText }]}>
              {t("dashboard.greeting", {
                name: user?.name?.split(" ")[0] ?? "Pure Athlete",
              })}
            </Text>
            <Text style={[styles.headline, { color: theme.colors.text }]}>
              Pure Life
            </Text>
          </View>
          <View
            style={[
              styles.streak,
              { backgroundColor: theme.colors.accentSoft },
            ]}
          >
            <Ionicons name="flame" size={18} color={theme.colors.accent} />
            <Text style={[styles.streakText, { color: theme.colors.accent }]}>
              {profile
                ? Math.max(1, profile.workoutsPerWeek)
                : fallbackSummary.streak}{" "}
              {t("dashboard.streak")}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <StatCard
            title={t("dashboard.calories")}
            value={(
              summary?.targetCalories ?? fallbackSummary.caloriesRemaining
            ).toString()}
            unit="kcal"
            variant="primary"
            icon={
              <Ionicons
                name="flash-outline"
                size={20}
                color={theme.colors.text}
              />
            }
          />
          <StatCard
            title={t("dashboard.workouts")}
            value={weeklyCompletedCount.toString()}
            unit={`/${profile?.workoutsPerWeek ?? 5}`}
            icon={
              <Ionicons
                name="barbell-outline"
                size={20}
                color={theme.colors.accent}
              />
            }
          />
        </View>

        <View style={styles.row}>
          <StatCard
            title={t("dashboard.hydration")}
            value={(
              summary?.hydrationLiters ?? fallbackSummary.hydrationLiters
            ).toString()}
            unit="L"
            icon={
              <Ionicons
                name="water-outline"
                size={20}
                color={theme.colors.accent}
              />
            }
          />
          <StatCard
            title={t("dashboard.calories")}
            value={Math.abs(summary?.calorieDelta ?? -350).toString()}
            unit="kcal"
            icon={
              <Ionicons
                name="timer-outline"
                size={20}
                color={theme.colors.accent}
              />
            }
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("dashboard.todayPlan")}
          </Text>
          <Text style={[styles.sectionAction, { color: theme.colors.accent }]}>
            {t("dashboard.viewAll")}
          </Text>
        </View>
        {focusItems.map((item) => (
          <FocusCard key={item.title} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcome: {
    fontSize: 16,
  },
  headline: {
    fontSize: 28,
    fontWeight: "700",
  },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  streakText: {
    fontSize: 13,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default DashboardScreen;
