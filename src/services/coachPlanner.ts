import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getFoodById } from "@/services/nutritionLibrary";
import {
  ActivityLevel,
  type AiCoachPlan,
  BodyGoal,
  DailySchedule,
  DietMeal,
  DietMealItem,
  GoalProfile,
  GoalSummary,
  MacroTargets,
  WeekdayKey,
  WEEK_DAYS,
  WeeklyDietPlan,
  WeeklyWorkoutPlan,
  WorkoutFocus,
  WorkoutSession,
  WORKOUT_FOCUS_ORDER,
} from "@/types/coach";

type MealBlueprint = {
  name: string;
  calorieShare: number;
  items: {
    foodId: string;
    basePortion: number;
  }[];
};

type GoalBlueprint = MealBlueprint[][];

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

const GOAL_DELTA_MAP: Record<BodyGoal, number> = {
  lose_weight: -450,
  gain_weight: 350,
  build_muscle: 250,
};

const PROTEIN_MULTIPLIER: Record<BodyGoal, number> = {
  lose_weight: 1.8,
  gain_weight: 1.6,
  build_muscle: 2.0,
};

const FAT_RATIO: Record<BodyGoal, number> = {
  lose_weight: 0.25,
  gain_weight: 0.3,
  build_muscle: 0.27,
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const roundTo = (value: number, precision = 0) => {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
};

const MEAL_BLUEPRINTS: Record<BodyGoal, GoalBlueprint> = {
  lose_weight: [
    [
      {
        name: "Kahvalti",
        calorieShare: 0.25,
        items: [
          { foodId: "oats", basePortion: 1 },
          { foodId: "berries", basePortion: 1 },
          { foodId: "egg_whites", basePortion: 1 },
        ],
      },
      {
        name: "Ara ogun",
        calorieShare: 0.15,
        items: [
          { foodId: "almonds", basePortion: 0.8 },
          { foodId: "apple", basePortion: 1 },
        ],
      },
      {
        name: "Ogle",
        calorieShare: 0.3,
        items: [
          { foodId: "chicken_breast", basePortion: 1 },
          { foodId: "quinoa", basePortion: 0.8 },
          { foodId: "spinach", basePortion: 1 },
        ],
      },
      {
        name: "Aksam",
        calorieShare: 0.3,
        items: [
          { foodId: "salmon", basePortion: 0.8 },
          { foodId: "broccoli", basePortion: 1 },
          { foodId: "sweet_potato", basePortion: 0.7 },
        ],
      },
    ],
    [
      {
        name: "Kahvalti",
        calorieShare: 0.23,
        items: [
          { foodId: "protein_pancake", basePortion: 1 },
          { foodId: "berries", basePortion: 1 },
        ],
      },
      {
        name: "Ara ogun",
        calorieShare: 0.17,
        items: [
          { foodId: "greek_yogurt", basePortion: 1 },
          { foodId: "chia_seed", basePortion: 0.5 },
        ],
      },
      {
        name: "Ogle",
        calorieShare: 0.3,
        items: [
          { foodId: "turkey_breast", basePortion: 1 },
          { foodId: "brown_rice", basePortion: 0.8 },
          { foodId: "broccoli", basePortion: 1 },
        ],
      },
      {
        name: "Aksam",
        calorieShare: 0.3,
        items: [
          { foodId: "lentil_soup", basePortion: 1 },
          { foodId: "spinach", basePortion: 1 },
          { foodId: "avocado", basePortion: 0.5 },
        ],
      },
    ],
    [
      {
        name: "Kahvalti",
        calorieShare: 0.24,
        items: [
          { foodId: "oats", basePortion: 0.8 },
          { foodId: "whey_shake", basePortion: 1 },
          { foodId: "banana", basePortion: 0.5 },
        ],
      },
      {
        name: "Ara ogun",
        calorieShare: 0.16,
        items: [
          { foodId: "cottage_cheese", basePortion: 1 },
          { foodId: "berries", basePortion: 0.5 },
        ],
      },
      {
        name: "Ogle",
        calorieShare: 0.3,
        items: [
          { foodId: "chickpeas", basePortion: 0.8 },
          { foodId: "quinoa", basePortion: 0.8 },
          { foodId: "spinach", basePortion: 1 },
        ],
      },
      {
        name: "Aksam",
        calorieShare: 0.3,
        items: [
          { foodId: "chicken_breast", basePortion: 1 },
          { foodId: "sweet_potato", basePortion: 0.7 },
          { foodId: "broccoli", basePortion: 1 },
        ],
      },
    ],
  ],
  gain_weight: [
    [
      {
        name: "Kahvalti",
        calorieShare: 0.28,
        items: [
          { foodId: "protein_pancake", basePortion: 1 },
          { foodId: "whole_egg", basePortion: 1 },
          { foodId: "banana", basePortion: 1 },
        ],
      },
      {
        name: "Ara ogun",
        calorieShare: 0.17,
        items: [
          { foodId: "whey_shake", basePortion: 1 },
          { foodId: "almonds", basePortion: 1 },
        ],
      },
      {
        name: "Ogle",
        calorieShare: 0.28,
        items: [
          { foodId: "chicken_breast", basePortion: 1 },
          { foodId: "brown_rice", basePortion: 1 },
          { foodId: "avocado", basePortion: 0.5 },
        ],
      },
      {
        name: "Aksam",
        calorieShare: 0.27,
        items: [
          { foodId: "salmon", basePortion: 1 },
          { foodId: "sweet_potato", basePortion: 1 },
          { foodId: "olive_oil", basePortion: 0.5 },
        ],
      },
    ],
    [
      {
        name: "Kahvalti",
        calorieShare: 0.26,
        items: [
          { foodId: "oats", basePortion: 1 },
          { foodId: "greek_yogurt", basePortion: 1 },
          { foodId: "chia_seed", basePortion: 0.7 },
        ],
      },
      {
        name: "Ara ogun",
        calorieShare: 0.18,
        items: [
          { foodId: "cottage_cheese", basePortion: 1 },
          { foodId: "berries", basePortion: 1 },
        ],
      },
      {
        name: "Ogle",
        calorieShare: 0.28,
        items: [
          { foodId: "turkey_breast", basePortion: 1 },
          { foodId: "quinoa", basePortion: 1 },
          { foodId: "olive_oil", basePortion: 0.4 },
        ],
      },
      {
        name: "Aksam",
        calorieShare: 0.28,
        items: [
          { foodId: "chickpeas", basePortion: 1 },
          { foodId: "sweet_potato", basePortion: 1 },
          { foodId: "avocado", basePortion: 0.6 },
        ],
      },
    ],
    [
      {
        name: "Kahvalti",
        calorieShare: 0.27,
        items: [
          { foodId: "protein_pancake", basePortion: 1 },
          { foodId: "whey_shake", basePortion: 1 },
          { foodId: "berries", basePortion: 0.8 },
        ],
      },
      {
        name: "Ara ogun",
        calorieShare: 0.18,
        items: [
          { foodId: "almonds", basePortion: 1 },
          { foodId: "apple", basePortion: 1 },
        ],
      },
      {
        name: "Ogle",
        calorieShare: 0.27,
        items: [
          { foodId: "chicken_breast", basePortion: 1 },
          { foodId: "brown_rice", basePortion: 1 },
          { foodId: "spinach", basePortion: 1 },
          { foodId: "olive_oil", basePortion: 0.4 },
        ],
      },
      {
        name: "Aksam",
        calorieShare: 0.28,
        items: [
          { foodId: "salmon", basePortion: 1 },
          { foodId: "quinoa", basePortion: 1 },
          { foodId: "avocado", basePortion: 0.6 },
        ],
      },
    ],
  ],
  build_muscle: [
    [
      {
        name: "Kahvalti",
        calorieShare: 0.26,
        items: [
          { foodId: "oats", basePortion: 1 },
          { foodId: "whey_shake", basePortion: 1 },
          { foodId: "banana", basePortion: 1 },
        ],
      },
      {
        name: "Ara ogun",
        calorieShare: 0.16,
        items: [
          { foodId: "greek_yogurt", basePortion: 1 },
          { foodId: "almonds", basePortion: 0.8 },
        ],
      },
      {
        name: "Ogle",
        calorieShare: 0.3,
        items: [
          { foodId: "chicken_breast", basePortion: 1 },
          { foodId: "quinoa", basePortion: 1 },
          { foodId: "spinach", basePortion: 1 },
        ],
      },
      {
        name: "Aksam",
        calorieShare: 0.28,
        items: [
          { foodId: "turkey_breast", basePortion: 1 },
          { foodId: "sweet_potato", basePortion: 1 },
          { foodId: "broccoli", basePortion: 1 },
        ],
      },
    ],
    [
      {
        name: "Kahvalti",
        calorieShare: 0.25,
        items: [
          { foodId: "protein_pancake", basePortion: 1 },
          { foodId: "berries", basePortion: 1 },
        ],
      },
      {
        name: "Ara ogun",
        calorieShare: 0.17,
        items: [
          { foodId: "cottage_cheese", basePortion: 1 },
          { foodId: "chia_seed", basePortion: 0.5 },
        ],
      },
      {
        name: "Ogle",
        calorieShare: 0.3,
        items: [
          { foodId: "salmon", basePortion: 1 },
          { foodId: "brown_rice", basePortion: 1 },
          { foodId: "broccoli", basePortion: 1 },
        ],
      },
      {
        name: "Aksam",
        calorieShare: 0.28,
        items: [
          { foodId: "chickpeas", basePortion: 1 },
          { foodId: "quinoa", basePortion: 1 },
          { foodId: "spinach", basePortion: 1 },
        ],
      },
    ],
    [
      {
        name: "Kahvalti",
        calorieShare: 0.26,
        items: [
          { foodId: "oats", basePortion: 1 },
          { foodId: "egg_whites", basePortion: 1 },
          { foodId: "whole_egg", basePortion: 0.5 },
        ],
      },
      {
        name: "Ara ogun",
        calorieShare: 0.17,
        items: [
          { foodId: "whey_shake", basePortion: 1 },
          { foodId: "banana", basePortion: 1 },
        ],
      },
      {
        name: "Ogle",
        calorieShare: 0.29,
        items: [
          { foodId: "turkey_breast", basePortion: 1 },
          { foodId: "brown_rice", basePortion: 1 },
          { foodId: "broccoli", basePortion: 1 },
        ],
      },
      {
        name: "Aksam",
        calorieShare: 0.28,
        items: [
          { foodId: "salmon", basePortion: 1 },
          { foodId: "sweet_potato", basePortion: 1 },
          { foodId: "spinach", basePortion: 1 },
        ],
      },
    ],
  ],
};

const WORKOUT_LIBRARY: Record<
  Exclude<WorkoutFocus, "rest">,
  WorkoutSession["exercises"]
> = {
  full_body: [
    { name: "Goblet squat", sets: 3, reps: "10-12", category: "strength" },
    { name: "Romanian deadlift", sets: 3, reps: "10", category: "strength" },
    { name: "Push-up", sets: 3, reps: "12-15", category: "strength" },
    { name: "Dumbbell row", sets: 3, reps: "12", category: "strength" },
    { name: "Plank", sets: 3, reps: "45 sn", category: "core" },
  ],
  upper_push: [
    {
      name: "Incline dumbbell press",
      sets: 4,
      reps: "8-10",
      category: "strength",
    },
    { name: "Overhead press", sets: 3, reps: "8-10", category: "strength" },
    { name: "Cable fly", sets: 3, reps: "12", category: "strength" },
    {
      name: "Triceps rope pushdown",
      sets: 3,
      reps: "12",
      category: "strength",
    },
    { name: "Side plank", sets: 3, reps: "30 sn", category: "core" },
  ],
  upper_pull: [
    {
      name: "Pull-up / assisted pull-up",
      sets: 3,
      reps: "6-8",
      category: "strength",
    },
    { name: "Bent-over row", sets: 3, reps: "10", category: "strength" },
    { name: "Face pull", sets: 3, reps: "12", category: "strength" },
    { name: "Biceps curl", sets: 3, reps: "12", category: "strength" },
    { name: "Hollow body hold", sets: 3, reps: "40 sn", category: "core" },
  ],
  lower_body: [
    { name: "Back squat", sets: 4, reps: "6-8", category: "strength" },
    { name: "Walking lunge", sets: 3, reps: "12 adim", category: "strength" },
    { name: "Hip thrust", sets: 3, reps: "10-12", category: "strength" },
    { name: "Leg curl", sets: 3, reps: "12", category: "strength" },
    { name: "Hanging knee raise", sets: 3, reps: "12", category: "core" },
  ],
  conditioning: [
    {
      name: "Interval kosu (1 dk hizli / 1 dk yavas)",
      sets: 8,
      reps: "ayni",
      category: "cardio",
    },
    { name: "Kettlebell swing", sets: 3, reps: "15", category: "cardio" },
    { name: "Battle rope", sets: 3, reps: "30 sn", category: "cardio" },
    { name: "Mountain climber", sets: 3, reps: "45 sn", category: "cardio" },
  ],
  mobility: [
    {
      name: "Dinamik esneme serisi",
      sets: 1,
      reps: "10-12 tekrar",
      category: "mobility",
    },
    {
      name: "Derin squat stretch",
      sets: 3,
      reps: "45 sn",
      category: "mobility",
    },
    {
      name: "Omuz mobilitesi bant calismasi",
      sets: 3,
      reps: "12",
      category: "mobility",
    },
    { name: "Cat-cow", sets: 3, reps: "12", category: "mobility" },
  ],
  core: [
    { name: "Dead bug", sets: 3, reps: "12", category: "core" },
    { name: "Cable woodchopper", sets: 3, reps: "12", category: "core" },
    { name: "Side plank reach", sets: 3, reps: "12", category: "core" },
    { name: "Farmer carry", sets: 3, reps: "40 sn", category: "core" },
  ],
};

const WORKOUT_SEQUENCES: Record<BodyGoal, WorkoutFocus[]> = {
  lose_weight: [
    "conditioning",
    "full_body",
    "lower_body",
    "conditioning",
    "full_body",
    "mobility",
  ],
  gain_weight: [
    "full_body",
    "upper_push",
    "lower_body",
    "upper_pull",
    "conditioning",
    "mobility",
  ],
  build_muscle: [
    "upper_push",
    "lower_body",
    "upper_pull",
    "full_body",
    "conditioning",
    "core",
  ],
};

const ACTIVE_DAY_PATTERNS: Record<number, WeekdayKey[]> = {
  1: ["wednesday"],
  2: ["tuesday", "friday"],
  3: ["monday", "wednesday", "friday"],
  4: ["monday", "tuesday", "thursday", "saturday"],
  5: ["monday", "tuesday", "thursday", "friday", "saturday"],
  6: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  7: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ],
};

const toMealItem = (
  foodId: string,
  multiplier: number,
): DietMealItem | null => {
  const food = getFoodById(foodId);
  if (!food) {
    return null;
  }
  const portionMultiplier = roundTo(multiplier, 1);
  return {
    foodId: food.id,
    foodName: food.name,
    portionText: `${portionMultiplier} x ${food.portion}`,
    calories: roundTo(food.calories * multiplier, 0),
    protein: roundTo(food.protein * multiplier, 1),
    carbs: roundTo(food.carbs * multiplier, 1),
    fat: roundTo(food.fat * multiplier, 1),
  };
};

const buildMeal = (
  blueprint: MealBlueprint,
  targetCalories: number,
): DietMeal => {
  const desiredCalories = targetCalories * blueprint.calorieShare;
  const baseTotal = blueprint.items.reduce((sum, ref) => {
    const food = getFoodById(ref.foodId);
    if (!food) {
      return sum;
    }
    return sum + food.calories * ref.basePortion;
  }, 0);

  const scale = baseTotal > 0 ? desiredCalories / baseTotal : 1;
  const items: DietMealItem[] = blueprint.items
    .map((ref) =>
      toMealItem(ref.foodId, Math.max(scale * ref.basePortion, 0.5)),
    )
    .filter((item): item is DietMealItem => Boolean(item));

  const macroSummary = items.reduce<MacroTargets>(
    (acc, item) => ({
      proteinGrams: acc.proteinGrams + item.protein,
      carbsGrams: acc.carbsGrams + item.carbs,
      fatGrams: acc.fatGrams + item.fat,
      fiberGrams: acc.fiberGrams,
    }),
    { proteinGrams: 0, carbsGrams: 0, fatGrams: 0, fiberGrams: 0 },
  );

  return {
    name: blueprint.name,
    calories: roundTo(
      items.reduce((sum, item) => sum + item.calories, 0),
      0,
    ),
    macroSummary,
    items,
  };
};

export const calculateSummary = (profile: GoalProfile): GoalSummary => {
  const sexAdjustment = profile.sex === "male" ? 5 : -161;
  const bmr =
    10 * profile.weightKg +
    6.25 * profile.heightCm -
    5 * profile.age +
    sexAdjustment;
  const activityFactor = ACTIVITY_FACTORS[profile.activityLevel];
  const maintenanceCalories = bmr * activityFactor;
  const delta = GOAL_DELTA_MAP[profile.goal];
  const targetCalories = clamp(maintenanceCalories + delta, 1500, 4200);

  const referenceWeight =
    profile.goal === "gain_weight" ? profile.targetWeightKg : profile.weightKg;
  const proteinGrams = referenceWeight * PROTEIN_MULTIPLIER[profile.goal];
  const fatCalories = targetCalories * FAT_RATIO[profile.goal];
  const fatGrams = fatCalories / 9;
  const remainingCalories = targetCalories - proteinGrams * 4 - fatCalories;
  const carbsGrams = clamp(remainingCalories / 4, 80, targetCalories / 2 / 4);
  const fiberGrams = clamp(Math.round((targetCalories / 1000) * 14), 20, 40);

  const hydrationLiters = roundTo(
    Math.max(2.5, profile.weightKg * 0.035 + profile.workoutsPerWeek * 0.25),
    1,
  );

  return {
    maintenanceCalories: roundTo(maintenanceCalories, 0),
    targetCalories: roundTo(targetCalories, 0),
    calorieDelta: Math.round(delta),
    activityFactor,
    macroTargets: {
      proteinGrams: roundTo(proteinGrams, 1),
      carbsGrams: roundTo(carbsGrams, 1),
      fatGrams: roundTo(fatGrams, 1),
      fiberGrams,
    },
    hydrationLiters,
  };
};

export const generateDietPlan = (
  profile: GoalProfile,
  summary: GoalSummary,
): WeeklyDietPlan => {
  const rotation = MEAL_BLUEPRINTS[profile.goal];
  const plan = {} as WeeklyDietPlan;

  WEEK_DAYS.forEach((day, index) => {
    const blueprint = rotation[index % rotation.length];
    const meals = blueprint.map((entry) =>
      buildMeal(entry, summary.targetCalories),
    );
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    plan[day.key] = {
      dayKey: day.key,
      totalCalories: roundTo(totalCalories, 0),
      meals,
    };
  });

  return plan;
};

const buildWorkoutSession = (
  dayKey: WeekdayKey,
  focus: WorkoutFocus,
  profile: GoalProfile,
): WorkoutSession => {
  if (focus === "rest") {
    return {
      dayKey,
      focus,
      label: "Dinlenme",
      durationMinutes: 0,
      intensity: "low",
      isRestDay: true,
      description: "Kaslarin toparlanmasi icin aktif dinlenme gunu.",
      exercises: [],
    };
  }

  const baseExercises = WORKOUT_LIBRARY[focus] ?? [];
  const intensityMap: Record<
    Exclude<WorkoutFocus, "rest">,
    WorkoutSession["intensity"]
  > = {
    full_body: "medium",
    upper_push: "high",
    upper_pull: "high",
    lower_body: "high",
    conditioning: profile.goal === "lose_weight" ? "high" : "medium",
    mobility: "low",
    core: "medium",
  };

  const durationMap: Record<Exclude<WorkoutFocus, "rest">, number> = {
    full_body: 50,
    upper_push: 55,
    upper_pull: 55,
    lower_body: 60,
    conditioning: 35,
    mobility: 25,
    core: 30,
  };

  const labels: Record<Exclude<WorkoutFocus, "rest">, string> = {
    full_body: "Full body guc",
    upper_push: "Ust vucut - itme",
    upper_pull: "Ust vucut - cekme",
    lower_body: "Alt vucut",
    conditioning: "Kardiyo / HIIT",
    mobility: "Mobilite ve esneme",
    core: "Core stabilizasyon",
  };

  return {
    dayKey,
    focus,
    label: labels[focus],
    durationMinutes: durationMap[focus],
    intensity: intensityMap[focus],
    isRestDay: false,
    description:
      focus === "conditioning"
        ? "Kalp hizini yukselten metabolik calisma."
        : "Kas gelisimi icin hedefli antrenman.",
    exercises: baseExercises,
  };
};

const clampWorkoutsPerWeek = (value: number) => clamp(Math.round(value), 1, 6);

export const generateWorkoutPlan = (
  profile: GoalProfile,
): WeeklyWorkoutPlan => {
  const sessions = clampWorkoutsPerWeek(profile.workoutsPerWeek);
  const pattern = ACTIVE_DAY_PATTERNS[sessions] ?? ACTIVE_DAY_PATTERNS[3];
  const focusSequence = WORKOUT_SEQUENCES[profile.goal];

  const plan = {} as WeeklyWorkoutPlan;
  let sequenceIndex = 0;

  WEEK_DAYS.forEach((day) => {
    if (pattern.includes(day.key)) {
      const focus = focusSequence[sequenceIndex % focusSequence.length];
      plan[day.key] = buildWorkoutSession(day.key, focus, profile);
      sequenceIndex += 1;
    } else {
      plan[day.key] = buildWorkoutSession(day.key, "rest", profile);
    }
  });

  return plan;
};

export const buildSchedule = (
  dietPlan: WeeklyDietPlan | null,
  workoutPlan: WeeklyWorkoutPlan,
): DailySchedule[] =>
  WEEK_DAYS.map((day) => ({
    dayKey: day.key,
    diet: dietPlan ? (dietPlan[day.key] ?? null) : null,
    workout: workoutPlan[day.key],
  }));

type AiPlanRequestInput = {
  profile: GoalProfile;
  summary: GoalSummary;
  locale?: "tr" | "en";
  notes?: string;
};

export const requestAiCoachPlan = async ({
  profile,
  summary,
  locale = "tr",
  notes,
}: AiPlanRequestInput): Promise<AiCoachPlan> => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase configuration is missing");
  }

  try {
    const { data, error } = await supabase.functions.invoke<AiCoachPlan>(
      "generate-plan",
      {
        body: {
          profile,
          summary,
          locale,
          notes,
        },
      },
    );

    if (error) {
      throw new Error(error.message ?? "Failed to generate AI coach plan");
    }

    if (!data) {
      throw new Error("AI coach plan response is empty");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error while generating AI coach plan");
  }
};

export const cycleFocus = (current: WorkoutFocus): WorkoutFocus => {
  const index = WORKOUT_FOCUS_ORDER.findIndex((item) => item === current);
  if (index === -1) {
    return WORKOUT_FOCUS_ORDER[0];
  }
  return WORKOUT_FOCUS_ORDER[(index + 1) % WORKOUT_FOCUS_ORDER.length];
};
