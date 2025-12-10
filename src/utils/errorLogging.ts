// Sentry removed - Personal Apple Developer account limitation
// Error logging now only uses console

/**
 * Log an error to console (Sentry disabled)
 * @param error Error object or string
 * @param context Additional context for debugging
 */
export const logError = (
  error: Error | string,
  context?: Record<string, any>,
) => {
  // Log to console only
  if (__DEV__) {
    console.error("[Error]", error, context);
  }
};

/**
 * Log a warning to console (Sentry disabled)
 * @param message Warning message
 * @param context Additional context
 */
export const logWarning = (message: string, context?: Record<string, any>) => {
  if (__DEV__) {
    console.warn("[Warning]", message, context);
  }
};

/**
 * Log an info message to console (Sentry disabled)
 * @param message Info message
 * @param context Additional context
 */
export const logInfo = (message: string, context?: Record<string, any>) => {
  if (__DEV__) {
    console.log("[Info]", message, context);
  }
};

/**
 * Add breadcrumb for tracking user actions (disabled - Sentry removed)
 * @param message Breadcrumb message
 * @param category Category (e.g., 'navigation', 'user-action', 'network')
 * @param data Additional data
 */
export const addBreadcrumb = (
  message: string,
  category: string = "user-action",
  data?: Record<string, any>,
) => {
  // Breadcrumbs disabled - Sentry removed
  if (__DEV__) {
    console.log("[Breadcrumb]", category, message, data);
  }
};

/**
 * Set user context (disabled - Sentry removed)
 * @param userId User ID
 * @param email User email
 * @param additionalData Additional user data
 */
export const setUserContext = (
  userId: string | null,
  email?: string,
  additionalData?: Record<string, any>,
) => {
  // User context disabled - Sentry removed
  if (__DEV__) {
    console.log("[User Context]", { userId, email, ...additionalData });
  }
};

/**
 * Set custom tag (disabled - Sentry removed)
 * @param key Tag key
 * @param value Tag value
 */
export const setTag = (key: string, value: string) => {
  // Tags disabled - Sentry removed
  if (__DEV__) {
    console.log("[Tag]", key, value);
  }
};

/**
 * Set custom context (disabled - Sentry removed)
 * @param name Context name
 * @param data Context data
 */
export const setContext = (name: string, data: Record<string, any>) => {
  // Context disabled - Sentry removed
  if (__DEV__) {
    console.log("[Context]", name, data);
  }
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
      logError(error instanceof Error ? error : new Error(String(error)), {
        function: fn.name,
        arguments: args,
        customMessage: errorMessage,
      });
      throw error;
    }
  }) as T;
};
