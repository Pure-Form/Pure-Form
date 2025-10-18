import {
  NavigationContainer,
  Theme as NavigationTheme,
  type LinkingOptions,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createURL } from "expo-linking";
import React from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import DashboardTabs from "@/navigation/DashboardTabs";
import LoginScreen from "@/screens/LoginScreen";
import OnboardingScreen from "@/screens/OnboardingScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import ResetPasswordScreen from "@/screens/ResetPasswordScreen";

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  App: undefined;
  PasswordReset: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { theme } = useTheme();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const { user, loading, pendingPasswordReset } = useAuth();
  const [navReady, setNavReady] = React.useState(false);
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
        text: theme.colors.text,
      },
    }),
    [theme],
  );

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [createURL("/"), "purelife://", "exp+purelife://"],
    config: {
      screens: {
        Onboarding: "onboarding",
        Login: "login",
        Register: "register",
        PasswordReset: "password-reset",
        App: {
          path: "app",
          screens: {},
        },
      },
    },
  };

  React.useEffect(() => {
    if (!navReady || !pendingPasswordReset) {
      return;
    }

    const currentRoute = navigationRef.getCurrentRoute();
    if (currentRoute?.name !== "PasswordReset") {
      navigationRef.navigate("PasswordReset");
    }
  }, [navReady, navigationRef, pendingPasswordReset]);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer
      theme={navigationTheme}
      linking={linking}
      ref={navigationRef}
      onReady={() => setNavReady(true)}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={DashboardTabs} />
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: t("auth.login") }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: t("auth.register") }}
            />
          </>
        )}
        <Stack.Screen name="PasswordReset" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
