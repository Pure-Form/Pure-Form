import type { FocusItem } from "@/types/coach";

export type DailySummary = {
  caloriesRemaining: number;
  workoutsCompleted: number;
  hydrationLiters: number;
  streak: number;
};

export type PlannerItem = {
  day: string;
  focus: string;
  duration: number;
  intensity: "low" | "medium" | "high";
};

export type ProgressPoint = {
  label: string;
  weight: number;
  bodyFat: number;
  steps: number;
};

export const getDailySummary = (): DailySummary => ({
  caloriesRemaining: 320,
  workoutsCompleted: 3,
  hydrationLiters: 2.4,
  streak: 7,
});

export const getFocusItems = (): FocusItem[] => [
  {
    title: "Lower Body Strength",
    subtitle: "Compound lifts & plyometrics",
    time: "45 min",
    icon: "barbell",
  },
  {
    title: "Macro Check-in",
    subtitle: "Stay within deficit",
    time: "All day",
    icon: "nutrition",
  },
];

export const getPlannerItems = (): PlannerItem[] => [
  { day: "Mon", focus: "Push", duration: 50, intensity: "high" },
  { day: "Tue", focus: "Cardio", duration: 35, intensity: "medium" },
  { day: "Wed", focus: "Pull", duration: 45, intensity: "high" },
  { day: "Thu", focus: "Core", duration: 30, intensity: "medium" },
  { day: "Fri", focus: "Legs", duration: 60, intensity: "high" },
  { day: "Sat", focus: "Mobility", duration: 25, intensity: "low" },
  { day: "Sun", focus: "Rest", duration: 0, intensity: "low" },
];

export const getProgressData = (): ProgressPoint[] => [
  { label: "Week 1", weight: 78.4, bodyFat: 22.4, steps: 5600 },
  { label: "Week 2", weight: 77.9, bodyFat: 21.9, steps: 6200 },
  { label: "Week 3", weight: 77.1, bodyFat: 21.4, steps: 6800 },
  { label: "Week 4", weight: 76.6, bodyFat: 20.9, steps: 7100 },
];
