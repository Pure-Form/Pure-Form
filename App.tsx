import { StatusBar } from "expo-status-bar";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "@/context/AuthContext";
import { CoachProvider } from "@/context/CoachContext";
import { ThemeProvider } from "@/context/ThemeContext";
import i18n from "@/i18n";
import AppNavigator from "@/navigation/AppNavigator";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AuthProvider>
            <CoachProvider>
              <StatusBar style="light" />
              <AppNavigator />
            </CoachProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

export default App;
