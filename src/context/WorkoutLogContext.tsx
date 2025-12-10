import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";

import { supabase } from "@/lib/supabase";

export type WorkoutLog = {
  id: string;
  userId: string;
  day: string;
  focus: string;
  completedAt: string;
  exercises?: ExerciseLog[];
};

export type ExerciseLog = {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
};

type WorkoutLogContextType = {
  completedWorkouts: Record<string, WorkoutLog>;
  isWorkoutCompleted: (day: string) => boolean;
  completeWorkout: (
    day: string,
    focus: string,
    exercises?: ExerciseLog[],
  ) => Promise<void>;
  uncompleteWorkout: (day: string) => Promise<void>;
  loading: boolean;
};

const WorkoutLogContext = createContext<WorkoutLogContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "@pure_life_workout_logs";

export const WorkoutLogProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [completedWorkouts, setCompletedWorkouts] = useState<
    Record<string, WorkoutLog>
  >({});
  const [loading, setLoading] = useState(true);

  const loadWorkoutLogs = useCallback(async () => {
    try {
      setLoading(true);

      // First, load from local storage (fast)
      const storedLogs = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLogs) {
        setCompletedWorkouts(JSON.parse(storedLogs));
      }

      // Then sync with Supabase
      if (user) {
        const { data, error } = await supabase
          .from("workout_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false });

        if (error) {
          console.error("Error loading workout logs:", error);
        } else if (data) {
          const logsMap: Record<string, WorkoutLog> = {};
          data.forEach((log) => {
            logsMap[log.day] = {
              id: log.id,
              userId: log.user_id,
              day: log.day,
              focus: log.focus,
              completedAt: log.completed_at,
              exercises: log.exercises,
            };
          });
          setCompletedWorkouts(logsMap);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logsMap));
        }
      }
    } catch (error) {
      console.error("Error loading workout logs:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load completed workouts from AsyncStorage and Supabase
  useEffect(() => {
    if (user) {
      loadWorkoutLogs();
    }
  }, [loadWorkoutLogs, user]);

  const isWorkoutCompleted = (day: string): boolean => {
    return !!completedWorkouts[day];
  };

  const completeWorkout = async (
    day: string,
    focus: string,
    exercises?: ExerciseLog[],
  ) => {
    try {
      if (!user) return;

      const completedAt = new Date().toISOString();
      const newLog: WorkoutLog = {
        id: `${user.id}_${day}_${Date.now()}`,
        userId: user.id,
        day,
        focus,
        completedAt,
        exercises,
      };

      // Update local state
      const updatedLogs = { ...completedWorkouts, [day]: newLog };
      setCompletedWorkouts(updatedLogs);

      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));

      // Save to Supabase
      const { error } = await supabase.from("workout_logs").insert({
        user_id: user.id,
        day,
        focus,
        completed_at: completedAt,
        exercises,
      });

      if (error) {
        console.error("Error saving workout log:", error);
        // Optionally revert local state if Supabase fails
      }
    } catch (error) {
      console.error("Error completing workout:", error);
    }
  };

  const uncompleteWorkout = async (day: string) => {
    try {
      if (!user) return;

      const logToDelete = completedWorkouts[day];
      if (!logToDelete) return;

      // Update local state
      const updatedLogs = { ...completedWorkouts };
      delete updatedLogs[day];
      setCompletedWorkouts(updatedLogs);

      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));

      // Delete from Supabase
      const { error } = await supabase
        .from("workout_logs")
        .delete()
        .eq("user_id", user.id)
        .eq("day", day);

      if (error) {
        console.error("Error deleting workout log:", error);
      }
    } catch (error) {
      console.error("Error uncompleting workout:", error);
    }
  };

  return (
    <WorkoutLogContext.Provider
      value={{
        completedWorkouts,
        isWorkoutCompleted,
        completeWorkout,
        uncompleteWorkout,
        loading,
      }}
    >
      {children}
    </WorkoutLogContext.Provider>
  );
};

export const useWorkoutLog = () => {
  const context = useContext(WorkoutLogContext);
  if (!context) {
    throw new Error("useWorkoutLog must be used within WorkoutLogProvider");
  }
  return context;
};
