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
import { Appearance } from "react-native";

import { AppTheme, darkTheme, lightTheme, ThemeMode } from "@/theme";

const STORAGE_KEY = "@purelife:theme";

type ThemeContextValue = {
  theme: AppTheme;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = stored as ThemeMode;
          setMode(parsed);
          return;
        }
        const system = Appearance.getColorScheme();
        if (system === "dark") {
          setMode("dark");
        }
      } catch (error) {
        console.warn("Failed to load theme", error);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, mode).catch((error: unknown) => {
      console.warn("Failed to persist theme", error);
    });
  }, [mode]);

  const theme = useMemo<AppTheme>(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode],
  );

  const toggleTheme = useCallback(() => {
    setMode((prev: ThemeMode) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setThemeMode = useCallback((next: ThemeMode) => {
    setMode(next);
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, setThemeMode }),
    [theme, toggleTheme, setThemeMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
