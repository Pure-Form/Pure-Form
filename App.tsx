//import 'react-native-url-polyfill/auto';
//import 'react-native-url-polyfill/auto';
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "@/context/AuthContext";
import { CoachProvider } from "@/context/CoachContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WorkoutLogProvider } from "@/context/WorkoutLogContext";
import i18n from "@/i18n";
import { initSentry } from "@/lib/sentry";
import AppNavigator from "@/navigation/AppNavigator";

// Initialize Sentry
initSentry();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <WorkoutLogProvider>
                <CoachProvider>
                  <StatusBar style="light" />
                  <AppNavigator />
                </CoachProvider>
              </WorkoutLogProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

export default App;
