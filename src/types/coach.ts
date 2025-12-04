export type Sex = "male" | "female";

export type BodyGoal = "lose_weight" | "gain_weight" | "build_muscle";

export type BodyFocus = "lean" | "athletic" | "power";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "athlete";

export type TrainingExperience = "beginner" | "intermediate" | "advanced";

export type DietPreference =
  | "omnivore"
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "keto";

export type EquipmentAccess =
  | "full_gym"
  | "basic_gym"
  | "home_dumbbells"
  | "bodyweight";

export type WeekdayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type WeekdayShape = {
  key: WeekdayKey;
  label: string;
  shortLabel: string;
};

export const WEEK_DAYS: WeekdayShape[] = [
  { key: "monday", label: "Monday", shortLabel: "Mon" },
  { key: "tuesday", label: "Tuesday", shortLabel: "Tue" },
  { key: "wednesday", label: "Wednesday", shortLabel: "Wed" },
  { key: "thursday", label: "Thursday", shortLabel: "Thu" },
  { key: "friday", label: "Friday", shortLabel: "Fri" },
  { key: "saturday", label: "Saturday", shortLabel: "Sat" },
  { key: "sunday", label: "Sunday", shortLabel: "Sun" },
];

export type GoalProfile = {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  goal: BodyGoal;
  focus: BodyFocus;
  activityLevel: ActivityLevel;
  workoutsPerWeek: number;
  experience: TrainingExperience;
  equipment: EquipmentAccess;
  dietPreference: DietPreference;
  injuries?: string;
};

export type MacroTargets = {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
};

export type GoalSummary = {
  maintenanceCalories: number;
  targetCalories: number;
  calorieDelta: number;
  activityFactor: number;
  macroTargets: MacroTargets;
  hydrationLiters: number;
};

export type LocaleCopy = {
  tr: string;
  en: string;
};

export type LocaleStringList = {
  tr: string[];
  en: string[];
};

export type AiPlanMetadata = {
  generatedAt: string;
  locale: "tr" | "en";
};

export type AiWorkoutPlanItem = {
  day: WeekdayKey | string;
  title: LocaleCopy;
  details: LocaleCopy;
  intensity: "low" | "medium" | "high";
};

export type AiWeekPlan = {
  week: number;
  focus: LocaleCopy;
  workouts: AiWorkoutPlanItem[];
  nutrition: {
    dailyCalories: number;
    tips: LocaleCopy;
    sampleMeals: LocaleStringList;
  };
};

export type AiCoachPlan = {
  metadata: AiPlanMetadata;
  summary: LocaleCopy;
  weeklyPlan: AiWeekPlan[];
  habitFocus: LocaleStringList;
};

export type FoodItem = {
  id: string;
  name: string;
  category: string;
  categoryKey?: string;
  portion: string;
  portionGrams?: number | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  imageUrl?: string;
  dataSource?: string;
  dataSourceKey?: string;
};

export type DietMealItem = {
  foodId: string;
  foodName: string;
  portionText: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type DietMeal = {
  name: string;
  calories: number;
  macroSummary: MacroTargets;
  items: DietMealItem[];
};

export type DailyDietPlan = {
  dayKey: WeekdayKey;
  totalCalories: number;
  meals: DietMeal[];
};

export type WeeklyDietPlan = Record<WeekdayKey, DailyDietPlan>;

export type WorkoutFocus =
  | "rest"
  | "full_body"
  | "upper_push"
  | "upper_pull"
  | "lower_body"
  | "conditioning"
  | "mobility"
  | "core";

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
  category: "strength" | "cardio" | "mobility" | "core";
};

export type WorkoutSession = {
  dayKey: WeekdayKey;
  focus: WorkoutFocus;
  label: string;
  durationMinutes: number;
  intensity: "low" | "medium" | "high";
  isRestDay: boolean;
  description: string;
  exercises: Exercise[];
};

export type WeeklyWorkoutPlan = Record<WeekdayKey, WorkoutSession>;

export type DailySchedule = {
  dayKey: WeekdayKey;
  diet: DailyDietPlan | null;
  workout: WorkoutSession;
};

export type FocusItem = {
  title: string;
  subtitle: string;
  time: string;
  icon: "barbell" | "nutrition" | "calendar" | "recovery";
};

export type StoredCoachState = {
  profile: GoalProfile;
  summary: GoalSummary;
  dietPlan: WeeklyDietPlan;
  workoutPlan: WeeklyWorkoutPlan;
  aiPlan?: AiCoachPlan | null;
};

export const WORKOUT_FOCUS_ORDER: WorkoutFocus[] = [
  "full_body",
  "upper_push",
  "upper_pull",
  "lower_body",
  "conditioning",
  "mobility",
  "core",
  "rest",
];
