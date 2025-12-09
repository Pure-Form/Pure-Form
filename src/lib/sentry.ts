import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

export const initSentry = () => {
  const dsn = Constants.expoConfig?.extra?.sentryDsn ?? process.env.EXPO_PUBLIC_SENTRY_DSN;
  
  // Only initialize Sentry in production or if DSN is explicitly provided
  if (!dsn) {
    console.log("[Sentry] DSN not found, skipping initialization");
    return;
  }

  Sentry.init({
    dsn,
    // Enable tracing for performance monitoring
    tracesSampleRate: __DEV__ ? 0 : 1.0,
    // Enable automatic session tracking
    enableAutoSessionTracking: true,
    // Sessions close after app is 10 seconds in the background
    sessionTrackingIntervalMillis: 10000,
    // Debug mode (only in development)
    debug: __DEV__,
    // Environment
    environment: __DEV__ ? "development" : "production",
    // App info
    dist: Constants.expoConfig?.version,
    release: `${Constants.expoConfig?.slug}@${Constants.expoConfig?.version}`,
    // Integrations
    integrations: [
      Sentry.reactNavigationIntegration(),
    ],
    // beforeSend to filter out sensitive data
    beforeSend(event) {
      // Remove sensitive data from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
          if (breadcrumb.data) {
            // Remove potential passwords, tokens, etc.
            const { password, token, authorization, ...safeData } = breadcrumb.data;
            return { ...breadcrumb, data: safeData };
          }
          return breadcrumb;
        });
      }

      // Remove sensitive data from request headers
      if (event.request?.headers) {
        const { authorization, Authorization, ...safeHeaders } = event.request.headers;
        event.request.headers = safeHeaders;
      }

      return event;
    },
  });

  console.log("[Sentry] Initialized successfully");
};

export default Sentry;
