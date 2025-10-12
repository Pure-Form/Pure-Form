import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import DashboardScreen from "@/screens/DashboardScreen";
import PlannerScreen from "@/screens/PlannerScreen";
import ProgressScreen from "@/screens/ProgressScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { useTheme } from "@/context/ThemeContext";

export type DashboardTabParamList = {
  Dashboard: undefined;
  Planner: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabParamList>();

const DashboardTabs = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: keyof DashboardTabParamList } }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.subText,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border
        },
  tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          const iconMap: Record<keyof DashboardTabParamList, keyof typeof Ionicons.glyphMap> = {
            Dashboard: "speedometer-outline",
            Planner: "barbell-outline",
            Progress: "stats-chart-outline",
            Settings: "settings-outline"
          };
          const iconName = iconMap[route.name as keyof DashboardTabParamList];
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: t("dashboard.todayPlan") }} />
      <Tab.Screen name="Planner" component={PlannerScreen} options={{ title: t("dashboard.plannerHeading") }} />
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: t("dashboard.progressHeading") }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t("settings.theme") }} />
    </Tab.Navigator>
  );
};

export default DashboardTabs;
