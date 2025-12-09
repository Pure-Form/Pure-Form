import * as Notifications from "expo-notifications";
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

// Configure how notifications are handled when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      setHasPermission(existingStatus === "granted");

      if (existingStatus === "granted") {
        await registerForPushNotifications();
      }
    } catch (error) {
      console.error("NotificationError:", "NotificationContext.checkPermission");
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        setHasPermission(false);
        return false;
      }

      setHasPermission(true);
      await registerForPushNotifications();
      return true;
    } catch (error) {
      console.error("NotificationError:", "NotificationContext.requestPermission");
      return false;
    }
  };

  const registerForPushNotifications = async () => {
    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#00B6FF",
        });
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      console.log("Expo Push Token:", token);
    } catch (error) {
      console.error("NotificationError:", "NotificationContext.registerForPushNotifications");
    }
  };

  const scheduleWorkoutReminder = async (
    day: string,
    hour: number,
    minute: number,
  ): Promise<string | null> => {
    try {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) return null;
      }

      // Map day to weekday number (1 = Monday, 7 = Sunday)
      const dayMap: Record<string, number> = {
        MON: 1,
        TUE: 2,
        WED: 3,
        THU: 4,
        FRI: 5,
        SAT: 6,
        SUN: 7,
      };

      const weekday = dayMap[day] || 1;

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🏋️ Workout Time!",
          body: `Time for your ${day} workout. Let's crush it!`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { day, type: "workout" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          weekday,
          hour,
          minute,
          repeats: true,
        },
      });

      console.log(`Scheduled workout reminder for ${day} at ${hour}:${minute}`);
      return identifier;
    } catch (error) {
      console.error("NotificationError:", "NotificationContext.scheduleWorkoutReminder");
      return null;
    }
  };

  const cancelNotification = async (identifier: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error("NotificationError:", "NotificationContext.cancelNotification");
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("NotificationError:", "NotificationContext.cancelAllNotifications");
    }
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
