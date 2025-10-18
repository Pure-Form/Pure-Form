import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "@/components/PrimaryButton";
import { useCoach } from "@/context/CoachContext";
import { useTheme } from "@/context/ThemeContext";
import type { PlannerStackParamList } from "@/navigation/PlannerNavigator";
import {
  WEEK_DAYS,
  type BodyFocus,
  type DietMeal,
  type WeekdayKey,
  type WorkoutSession,
} from "@/types/coach";

const JS_WEEKDAY_TO_KEY: WeekdayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

type Props = NativeStackScreenProps<PlannerStackParamList, "CoachPlan">;

type FocusDescriptor = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const focusCopy: Record<BodyFocus, FocusDescriptor> = {
  lean: {
    title: "Forma Sok Modu",
    subtitle: "Yağ oranını azaltırken kaslarını koru.",
    icon: "flame-outline",
  },
  athletic: {
    title: "Atletik Performans",
    subtitle: "Kuvvet, hız ve mobilite dengesini sağla.",
    icon: "rocket-outline",
  },
  power: {
    title: "Güç Odaklı",
    subtitle: "Maksimum kuvvet ve patlayıcılığı artır.",
    icon: "fitness-outline",
  },
};

const CoachPlanScreen = ({ navigation }: Props) => {
  const { state, loading, regeneratePlans } = useCoach();
  const { theme } = useTheme();

  const profile = state.profile;
  const summary = state.summary;
  const schedule = state.schedule;

  const today = useMemo(() => {
    const todayKey = JS_WEEKDAY_TO_KEY[new Date().getDay()];
    return (
      schedule.find((item) => item.dayKey === todayKey) ?? schedule[0] ?? null
    );
  }, [schedule]);

  const focus = profile ? focusCopy[profile.focus] : null;

  if (!profile || !summary) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      >
        <View style={[styles.emptyState, { paddingHorizontal: 24 }]}>
          <Ionicons
            name="body-outline"
            size={42}
            color={theme.colors.subText}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            Henüz koç planı yok
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.subText }]}>
            Hedeflerini belirle, kalori açığını hesaplayalım ve diyet +
            antrenman programını takvime yerleştirelim.
          </Text>
          <PrimaryButton
            title="Koçunu başlat"
            onPress={() => navigation.navigate("CoachSetup")}
          />
        </View>
      </SafeAreaView>
    );
  }

  const macroTargets = summary.macroTargets;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 48 }]}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Kişisel Koç Planın
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.subText }]}>
              Günlük hedeflerin kaydedildi. Takvime yerleştirilmiş planını takip
              et.
            </Text>
          </View>
          <View style={styles.inlineButton}>
            <PrimaryButton
              title="Ayarları düzenle"
              onPress={() => navigation.navigate("CoachSetup")}
              variant="secondary"
            />
          </View>
        </View>

        {focus ? (
          <View
            style={[
              styles.focusCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.focusIcon}>
              <Ionicons
                name={focus.icon}
                size={26}
                color={theme.colors.accent}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.focusTitle, { color: theme.colors.text }]}>
                {focus.title}
              </Text>
              <Text
                style={[styles.focusSubtitle, { color: theme.colors.subText }]}
              >
                {focus.subtitle}
              </Text>
            </View>
          </View>
        ) : null}

        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>
            Günlük hedefler
          </Text>
          <View style={styles.summaryRow}>
            <SummaryMetric
              label="Kalori"
              value={`${summary.targetCalories}`}
              unit="kcal"
            />
            <SummaryMetric
              label="Kalori açığı"
              value={`${summary.calorieDelta}`}
              unit="kcal"
            />
            <SummaryMetric
              label="Su"
              value={`${summary.hydrationLiters}`}
              unit="L"
            />
          </View>
          <View
            style={[styles.macroRow, { borderTopColor: theme.colors.border }]}
          >
            <SummaryMetric
              label="Protein"
              value={`${macroTargets.proteinGrams}`}
              unit="g"
              compact
            />
            <SummaryMetric
              label="Karbonhidrat"
              value={`${macroTargets.carbsGrams}`}
              unit="g"
              compact
            />
            <SummaryMetric
              label="Yağ"
              value={`${macroTargets.fatGrams}`}
              unit="g"
              compact
            />
            <SummaryMetric
              label="Lif"
              value={`${macroTargets.fiberGrams}`}
              unit="g"
              compact
            />
          </View>
        </View>

        {today ? (
          <View
            style={[
              styles.todayCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>
              Bugün (
              {WEEK_DAYS.find((d) => d.key === today.dayKey)?.label ??
                today.dayKey}
              )
            </Text>
            <WorkoutRow
              label="Antrenman"
              focus={today.workout.label}
              duration={today.workout.durationMinutes}
              intensity={today.workout.intensity}
              description={today.workout.description}
              isRest={today.workout.isRestDay}
            />
            {today.diet ? (
              <DietRow
                label="Beslenme"
                calories={today.diet.totalCalories}
                meals={today.diet.meals
                  .slice(0, 2)
                  .map((meal) => meal.name)
                  .join(" • ")}
              />
            ) : null}
          </View>
        ) : null}

        <View style={styles.listHeader}>
          <Text style={[styles.sectionHeading, { color: theme.colors.text }]}>
            Haftalık Takvim
          </Text>
          <View style={styles.inlineButton}>
            <PrimaryButton
              title="Planı yenile"
              onPress={regeneratePlans}
              loading={loading}
              variant="secondary"
            />
          </View>
        </View>

        {schedule.map((day) => (
          <DayScheduleCard
            key={day.dayKey}
            dayKey={day.dayKey}
            workout={day.workout}
            dietCalories={day.diet?.totalCalories ?? 0}
            meals={day.diet?.meals ?? []}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

type SummaryMetricProps = {
  label: string;
  value: string;
  unit: string;
  compact?: boolean;
};

const SummaryMetric = ({
  label,
  value,
  unit,
  compact = false,
}: SummaryMetricProps) => {
  const { theme } = useTheme();
  return (
    <View style={styles.metric}>
      <Text
        style={[
          compact ? styles.metricLabelCompact : styles.metricLabel,
          { color: compact ? theme.colors.subText : theme.colors.text },
        ]}
      >
        {label}
      </Text>
      <Text style={[styles.metricValue, { color: theme.colors.text }]}>
        {value}
        <Text style={styles.metricUnit}> {unit}</Text>
      </Text>
    </View>
  );
};

type WorkoutRowProps = {
  label: string;
  focus: string;
  duration: number;
  intensity: "low" | "medium" | "high";
  description: string;
  isRest: boolean;
};

const intensityColors: Record<"low" | "medium" | "high", string> = {
  low: "#3DD598",
  medium: "#FFC542",
  high: "#FF575F",
};

const WorkoutRow = ({
  label,
  focus,
  duration,
  intensity,
  description,
  isRest,
}: WorkoutRowProps) => {
  const { theme } = useTheme();
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons
          name={isRest ? "bed-outline" : "barbell-outline"}
          size={20}
          color={theme.colors.accent}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.detailLabel, { color: theme.colors.subText }]}>
          {label}
        </Text>
        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
          {focus}
        </Text>
        <Text
          style={[styles.detailDescription, { color: theme.colors.subText }]}
        >
          {description}
        </Text>
      </View>
      <View
        style={[
          styles.detailBadge,
          { borderColor: intensityColors[intensity] },
        ]}
      >
        <Text
          style={[
            styles.detailBadgeText,
            { color: intensityColors[intensity] },
          ]}
        >
          {isRest ? "Rest" : `${duration} dk`}
        </Text>
      </View>
    </View>
  );
};

type DietRowProps = {
  label: string;
  calories: number;
  meals: string;
};

const DietRow = ({ label, calories, meals }: DietRowProps) => {
  const { theme } = useTheme();
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons
          name="nutrition-outline"
          size={20}
          color={theme.colors.accent}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.detailLabel, { color: theme.colors.subText }]}>
          {label}
        </Text>
        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
          {calories} kcal
        </Text>
        <Text
          style={[styles.detailDescription, { color: theme.colors.subText }]}
        >
          {meals}
        </Text>
      </View>
    </View>
  );
};

type DayScheduleCardProps = {
  dayKey: WeekdayKey;
  workout: WorkoutSession;
  dietCalories: number;
  meals: DietMeal[];
};

const DayScheduleCard = ({
  dayKey,
  workout,
  dietCalories,
  meals,
}: DayScheduleCardProps) => {
  const { theme } = useTheme();
  const meta = WEEK_DAYS.find((day) => day.key === dayKey);

  return (
    <View
      style={[
        styles.dayCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.dayHeader}>
        <Text style={[styles.dayLabel, { color: theme.colors.text }]}>
          {meta?.label ?? dayKey}
        </Text>
        <View style={styles.daySummary}>
          <Ionicons
            name="time-outline"
            size={14}
            color={theme.colors.subText}
          />
          <Text
            style={[styles.daySummaryText, { color: theme.colors.subText }]}
          >
            {workout.isRestDay
              ? "Dinlenme"
              : `${workout.durationMinutes} dk • ${workout.intensity.toUpperCase()}`}
          </Text>
        </View>
      </View>

      <View style={styles.dayBody}>
        <Text style={[styles.dayFocus, { color: theme.colors.text }]}>
          {workout.isRestDay ? "Aktif Dinlenme" : workout.label}
        </Text>
        <Text style={[styles.dayDescription, { color: theme.colors.subText }]}>
          {workout.description}
        </Text>
        <View style={styles.dayNutrition}>
          <Ionicons
            name="nutrition-outline"
            size={16}
            color={theme.colors.accent}
          />
          <Text style={[styles.dayNutritionText, { color: theme.colors.text }]}>
            {dietCalories} kcal
          </Text>
        </View>
        {meals.slice(0, 3).map((meal) => (
          <Text
            key={meal.name}
            style={[styles.dayMeal, { color: theme.colors.subText }]}
          >
            • {meal.name}
          </Text>
        ))}
      </View>
    </View>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
  },
  focusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  focusIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 182, 255, 0.12)",
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  focusSubtitle: {
    fontSize: 13,
  },
  summaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  metricLabelCompact: {
    fontSize: 12,
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: "500",
  },
  todayCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inlineButton: {
    width: 160,
    alignSelf: "flex-start",
  },
  detailRow: {
    flexDirection: "row",
    gap: 12,
  },
  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 182, 255, 0.1)",
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  detailDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  detailBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    alignSelf: "center",
  },
  detailBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  list: {
    gap: 16,
  },
  dayCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginTop: 12,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  daySummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  daySummaryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dayBody: {
    marginTop: 10,
    gap: 6,
  },
  dayFocus: {
    fontSize: 15,
    fontWeight: "600",
  },
  dayDescription: {
    fontSize: 12,
  },
  dayNutrition: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  dayNutritionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dayMeal: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default CoachPlanScreen;
