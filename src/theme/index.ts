export type ThemeMode = "light" | "dark";

export type AppTheme = {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    subText: string;
    accent: string;
    accentSoft: string;
    success: string;
    warning: string;
    danger: string;
    border: string;
    chartGradient: [string, string];
  };
};

const electricBlue = "#00B6FF";
const midnightBlack = "#020205";
const jetBlack = "#04030A";
const lightBackground = "#F5F7FA";
const lightSurface = "#FFFFFF";
const darkSurface = "#0F111A";
const lightText = "#1B1E2B";
const darkText = "#E6F2FF";

export const lightTheme: AppTheme = {
  mode: "light",
  colors: {
    background: lightBackground,
    surface: lightSurface,
    card: "#FFFFFF",
    text: lightText,
    subText: "#5C6470",
    accent: electricBlue,
    accentSoft: "rgba(0, 182, 255, 0.12)",
    success: "#3DD598",
    warning: "#FFC542",
    danger: "#FF575F",
    border: "#E0E6ED",
    chartGradient: ["rgba(0, 182, 255, 0.6)", "rgba(0, 182, 255, 0.1)"],
  },
};

export const darkTheme: AppTheme = {
  mode: "dark",
  colors: {
    background: midnightBlack,
    surface: darkSurface,
    card: jetBlack,
    text: darkText,
    subText: "#8594AD",
    accent: electricBlue,
    accentSoft: "rgba(0, 182, 255, 0.2)",
    success: "#3DD598",
    warning: "#FFC542",
    danger: "#FF575F",
    border: "#1F2332",
    chartGradient: ["rgba(0, 182, 255, 0.7)", "rgba(0, 182, 255, 0.05)"],
  },
};
