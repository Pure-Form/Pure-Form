import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";

import { aiCoachEnabled } from "@/constants/featureFlags";
import { useTheme } from "@/context/ThemeContext";
import PlannerNavigator from "@/navigation/PlannerNavigator";
import CoachChatScreen from "@/screens/CoachChatScreen";
import DashboardScreen from "@/screens/DashboardScreen";
import NutritionLibraryScreen from "@/screens/NutritionLibraryScreen";
import SettingsScreen from "@/screens/SettingsScreen";

export type DashboardTabParamList = {
  Dashboard: undefined;
  Planner: undefined;
  Nutrition: undefined;
  CoachAI: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabParamList>();

const DashboardTabs = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: { name: keyof DashboardTabParamList };
      }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.subText,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];
          const iconMap: Record<keyof DashboardTabParamList, IoniconsName> = {
            Dashboard: "speedometer-outline",
            Planner: "barbell-outline",
            Nutrition: "restaurant-outline",
            CoachAI: "chatbox-ellipses-outline",
            Settings: "settings-outline",
          };
          const iconName = iconMap[route.name as keyof DashboardTabParamList];
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: t("dashboard.todayPlan") }}
      />
      <Tab.Screen
        name="Planner"
        component={PlannerNavigator}
        options={{ title: t("dashboard.plannerHeading") }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionLibraryScreen}
        options={{ title: t("nutrition.tabTitle") }}
      />
      {aiCoachEnabled ? (
        <Tab.Screen
          name="CoachAI"
          component={CoachChatScreen}
          options={{ title: t("dashboard.aiCoachHeading") }}
        />
      ) : null}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t("settings.theme") }}
      />
    </Tab.Navigator>
  );
};

export default DashboardTabs;
