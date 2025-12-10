import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";
import { useWorkoutLog } from "@/context/WorkoutLogContext";
import { getPlannerItems, type PlannerItem } from "@/services/mockData";

const PlannerScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const data = getPlannerItems();
  const { isWorkoutCompleted, completeWorkout, uncompleteWorkout } =
    useWorkoutLog();

  const handleToggleWorkout = async (item: PlannerItem) => {
    const isCompleted = isWorkoutCompleted(item.day);
    if (isCompleted) {
      await uncompleteWorkout(item.day);
    } else {
      await completeWorkout(item.day, item.focus);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t("planner.title")}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.subText }]}>
            Stay consistent with a balanced split.
          </Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item: PlannerItem) => item.day}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }: { item: PlannerItem }) => {
            const intensityColors: Record<typeof item.intensity, string> = {
              low: "#3DD598",
              medium: "#FFC542",
              high: "#FF575F",
            };
            const isCompleted = isWorkoutCompleted(item.day);

            return (
              <Pressable
                onPress={() => handleToggleWorkout(item)}
                style={[
                  styles.row,
                  {
                    borderColor: isCompleted
                      ? theme.colors.accent
                      : theme.colors.border,
                    backgroundColor: isCompleted
                      ? `${theme.colors.accent}15`
                      : theme.colors.surface,
                  },
                ]}
              >
                <View style={styles.dayBadge}>
                  <Text
                    style={[styles.dayText, { color: theme.colors.accent }]}
                  >
                    {item.day}
                  </Text>
                </View>
                <View style={styles.middle}>
                  <Text style={[styles.focus, { color: theme.colors.text }]}>
                    {item.focus}
                  </Text>
                  <Text
                    style={[styles.duration, { color: theme.colors.subText }]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={theme.colors.subText}
                    />{" "}
                    {item.duration} min
                  </Text>
                </View>
                <View style={styles.rightSection}>
                  <View
                    style={[
                      styles.intensityBadge,
                      { borderColor: intensityColors[item.intensity] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.intensityText,
                        { color: intensityColors[item.intensity] },
                      ]}
                    >
                      {item.intensity.toUpperCase()}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handleToggleWorkout(item)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={
                        isCompleted ? "checkmark-circle" : "ellipse-outline"
                      }
                      size={28}
                      color={
                        isCompleted ? theme.colors.accent : theme.colors.subText
                      }
                    />
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  dayBadge: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(0, 182, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "700",
  },
  middle: {
    flex: 1,
    gap: 4,
  },
  focus: {
    fontSize: 18,
    fontWeight: "600",
  },
  duration: {
    fontSize: 13,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  intensityBadge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  intensityText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

export default PlannerScreen;
