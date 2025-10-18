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
} from "@/services/coachPlanner";
import {
  DailySchedule,
  GoalProfile,
  GoalSummary,
  WeeklyDietPlan,
  WeeklyWorkoutPlan,
} from "@/types/coach";

const STORAGE_KEY = "@purelife:coach";

type CoachState = {
  profile: GoalProfile | null;
  summary: GoalSummary | null;
  dietPlan: WeeklyDietPlan | null;
  workoutPlan: WeeklyWorkoutPlan | null;
  schedule: DailySchedule[];
};

type CompleteState = CoachState & {
  profile: GoalProfile;
  summary: GoalSummary;
  dietPlan: WeeklyDietPlan;
  workoutPlan: WeeklyWorkoutPlan;
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
};

const emptyState: CoachState = {
  profile: null,
  summary: null,
  dietPlan: null,
  workoutPlan: null,
  schedule: [],
};

const CoachContext = createContext<CoachContextValue | undefined>(undefined);

type CoachProviderProps = {
  children: ReactNode;
};

const buildFullState = (profile: GoalProfile): CompleteState => {
  const summary = calculateSummary(profile);
  const dietPlan = generateDietPlan(profile, summary);
  const workoutPlan = generateWorkoutPlan(profile);
  return {
    profile,
    summary,
    dietPlan,
    workoutPlan,
    schedule: buildSchedule(dietPlan, workoutPlan),
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
        const fullState = buildFullState(profile);
        setState(fullState);
        await persist({
          profile: fullState.profile,
          summary: fullState.summary,
          dietPlan: fullState.dietPlan,
          workoutPlan: fullState.workoutPlan,
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
      const fullState = buildFullState(state.profile);
      setState(fullState);
      await persist({
        profile: fullState.profile,
        summary: fullState.summary,
        dietPlan: fullState.dietPlan,
        workoutPlan: fullState.workoutPlan,
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
