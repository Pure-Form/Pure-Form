import Sentry from "@/lib/sentry";

/**
 * Log an error to Sentry
 * @param error Error object or string
 * @param context Additional context for debugging
 */
export const logError = (error: Error | string, context?: Record<string, any>) => {
  if (typeof error === "string") {
    Sentry.captureMessage(error, {
      level: "error",
      contexts: context ? { additional: context } : undefined,
    });
  } else {
    Sentry.captureException(error, {
      contexts: context ? { additional: context } : undefined,
    });
  }

  // Also log to console in development
  if (__DEV__) {
    console.error("[Error]", error, context);
  }
};

/**
 * Log a warning to Sentry
 * @param message Warning message
 * @param context Additional context
 */
export const logWarning = (message: string, context?: Record<string, any>) => {
  Sentry.captureMessage(message, {
    level: "warning",
    contexts: context ? { additional: context } : undefined,
  });

  if (__DEV__) {
    console.warn("[Warning]", message, context);
  }
};

/**
 * Log an info message to Sentry
 * @param message Info message
 * @param context Additional context
 */
export const logInfo = (message: string, context?: Record<string, any>) => {
  Sentry.captureMessage(message, {
    level: "info",
    contexts: context ? { additional: context } : undefined,
  });

  if (__DEV__) {
    console.log("[Info]", message, context);
  }
};

/**
 * Add breadcrumb for tracking user actions
 * @param message Breadcrumb message
 * @param category Category (e.g., 'navigation', 'user-action', 'network')
 * @param data Additional data
 */
export const addBreadcrumb = (
  message: string,
  category: string = "user-action",
  data?: Record<string, any>,
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level: "info",
    data,
  });
};

/**
 * Set user context for better error tracking
 * @param userId User ID
 * @param email User email
 * @param additionalData Additional user data
 */
export const setUserContext = (
  userId: string | null,
  email?: string,
  additionalData?: Record<string, any>,
) => {
  if (userId) {
    Sentry.setUser({
      id: userId,
      email,
      ...additionalData,
    });
  } else {
    Sentry.setUser(null);
  }
};

/**
 * Set custom tag for filtering errors in Sentry
 * @param key Tag key
 * @param value Tag value
 */
export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

/**
 * Set custom context for errors
 * @param name Context name
 * @param data Context data
 */
export const setContext = (name: string, data: Record<string, any>) => {
  Sentry.setContext(name, data);
};

/**
 * Wrapper for async functions with automatic error logging
 * @param fn Async function to wrap
 * @param errorMessage Custom error message
 * @returns Wrapped function
 */
export const withErrorLogging = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string,
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error(String(error)),
        {
          function: fn.name,
          arguments: args,
          customMessage: errorMessage,
        },
      );
      throw error;
    }
  }) as T;
};
