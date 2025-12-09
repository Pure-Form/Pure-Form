// expo-notifications removed - not supported by Personal Apple Developer accounts
// This file is kept for future use when upgrading to paid Apple Developer account
import { Platform } from "react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type NotificationContextType = {
  expoPushToken: string | null;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  scheduleWorkoutReminder: (day: string, hour: number, minute: number) => Promise<string | null>;
  cancelNotification: (identifier: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Notifications disabled - Personal Apple Developer accounts don't support Push Notifications
  const checkPermission = async () => {
    console.log("Notifications disabled - Personal Apple Developer account limitation");
  };

  const requestPermission = async (): Promise<boolean> => {
    console.log("Notifications disabled - Personal Apple Developer account limitation");
    return false;
  };

  const registerForPushNotifications = async () => {
    console.log("Notifications disabled - Personal Apple Developer account limitation");
  };

  const scheduleWorkoutReminder = async (
    day: string,
    hour: number,
    minute: number,
  ): Promise<string | null> => {
    console.log("Notifications disabled - Personal Apple Developer account limitation");
    return null;
  };

  const cancelNotification = async (identifier: string) => {
    console.log("Notifications disabled - Personal Apple Developer account limitation");
  };

  const cancelAllNotifications = async () => {
    console.log("Notifications disabled - Personal Apple Developer account limitation");
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        hasPermission,
        requestPermission,
        scheduleWorkoutReminder,
        cancelNotification,
        cancelAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
