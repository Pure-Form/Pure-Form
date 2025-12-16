import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  buildSchedule,
  calculateSummary,
  generateDietPlan,
  generateWorkoutPlan,
  requestAiCoachPlan,
} from "@/services/coachPlanner";
import {
  type AiCoachPlan,
  DailySchedule,
  GoalProfile,
  GoalSummary,
  WeeklyDietPlan,
  WeeklyWorkoutPlan,
} from "@/types/coach";

const STORAGE_KEY = "@pureform:coach";

type CoachState = {
  profile: GoalProfile | null;
  summary: GoalSummary | null;
  dietPlan: WeeklyDietPlan | null;
  workoutPlan: WeeklyWorkoutPlan | null;
  schedule: DailySchedule[];
  aiPlan: AiCoachPlan | null;
};

type CompleteState = CoachState & {
  profile: GoalProfile;
  summary: GoalSummary;
  dietPlan: WeeklyDietPlan;
  workoutPlan: WeeklyWorkoutPlan;
  aiPlan: AiCoachPlan | null;
};

type CoachContextValue = {
  state: CoachState;
  loading: boolean;
  saveProfile: (profile: GoalProfile) => Promise<void>;
  regeneratePlans: () => Promise<void>;
  resetCoach: () => Promise<void>;
};

type StoredState = {
  profile: GoalProfile;
  summary: GoalSummary;
  dietPlan: WeeklyDietPlan;
  workoutPlan: WeeklyWorkoutPlan;
  aiPlan?: AiCoachPlan | null;
};

const emptyState: CoachState = {
  profile: null,
  summary: null,
  dietPlan: null,
  workoutPlan: null,
  schedule: [],
  aiPlan: null,
};

const CoachContext = createContext<CoachContextValue | undefined>(undefined);

type CoachProviderProps = {
  children: ReactNode;
};

const buildFullState = async (profile: GoalProfile): Promise<CompleteState> => {
  const summary = calculateSummary(profile);
  const dietPlan = generateDietPlan(profile, summary);
  const workoutPlan = generateWorkoutPlan(profile);
  const schedule = buildSchedule(dietPlan, workoutPlan);

  let aiPlan: AiCoachPlan | null = null;
  try {
    aiPlan = await requestAiCoachPlan({ profile, summary, locale: "tr" });
  } catch (error) {
    console.warn("AI coach plan generation failed", error);
  }

  return {
    profile,
    summary,
    dietPlan,
    workoutPlan,
    schedule,
    aiPlan,
  };
};

export const CoachProvider = ({ children }: CoachProviderProps) => {
  const [state, setState] = useState<CoachState>(emptyState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) {
          return;
        }
        const parsed = JSON.parse(stored) as StoredState;
        const schedule = buildSchedule(parsed.dietPlan, parsed.workoutPlan);
        setState({
          profile: parsed.profile,
          summary: parsed.summary,
          dietPlan: parsed.dietPlan,
          workoutPlan: parsed.workoutPlan,
          schedule,
          aiPlan: parsed.aiPlan ?? null,
        });
      } catch (error) {
        console.warn("Coach state restore failed", error);
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []);

  const persist = useCallback(async (next: StoredState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn("Coach state persist failed", error);
    }
  }, []);

  const saveProfile = useCallback(
    async (profile: GoalProfile) => {
      setLoading(true);
      try {
        const fullState = await buildFullState(profile);
        setState(fullState);
        await persist({
          profile: fullState.profile,
          summary: fullState.summary,
          dietPlan: fullState.dietPlan,
          workoutPlan: fullState.workoutPlan,
          aiPlan: fullState.aiPlan ?? null,
        });
      } finally {
        setLoading(false);
      }
    },
    [persist],
  );

  const regeneratePlans = useCallback(async () => {
    if (!state.profile) {
      return;
    }
    setLoading(true);
    try {
      const fullState = await buildFullState(state.profile);
      setState(fullState);
      await persist({
        profile: fullState.profile,
        summary: fullState.summary,
        dietPlan: fullState.dietPlan,
        workoutPlan: fullState.workoutPlan,
        aiPlan: fullState.aiPlan ?? null,
      });
    } finally {
      setLoading(false);
    }
  }, [persist, state.profile]);

  const resetCoach = useCallback(async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Coach state reset failed", error);
    } finally {
      setState(emptyState);
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      loading,
      saveProfile,
      regeneratePlans,
      resetCoach,
    }),
    [loading, regeneratePlans, resetCoach, saveProfile, state],
  );

  return (
    <CoachContext.Provider value={value}>{children}</CoachContext.Provider>
  );
};

export const useCoach = () => {
  const context = useContext(CoachContext);
  if (!context) {
    throw new Error("useCoach must be used within CoachProvider");
  }
  return context;
};
