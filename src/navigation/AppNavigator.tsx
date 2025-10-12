import React from "react";
import { NavigationContainer, Theme as NavigationTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import OnboardingScreen from "@/screens/OnboardingScreen";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import DashboardTabs from "@/navigation/DashboardTabs";

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  const navigationTheme: NavigationTheme = React.useMemo(
    () => ({
      dark: theme.mode === "dark",
      colors: {
        background: theme.colors.background,
        border: theme.colors.border,
        card: theme.colors.card,
        notification: theme.colors.accent,
        primary: theme.colors.accent,
        text: theme.colors.text
      }
    }),
    [theme]
  );

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={DashboardTabs} />
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: t("auth.login") }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: t("auth.register") }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
