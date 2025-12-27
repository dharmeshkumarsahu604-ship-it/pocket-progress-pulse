// Secure logger utility that gates console output based on environment
// In production, sensitive information is not logged to the console

const isDevelopment = import.meta.env.DEV;

export const secureLog = {
  // General info logging - only in development
  info: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  // Warning logging - only in development
  warn: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  // Error logging - sanitized in production
  error: (message: string, error?: unknown): void => {
    if (isDevelopment) {
      console.error(message, error);
    } else {
      // In production, log only generic error message without details
      console.error('An error occurred');
    }
  },
  
  // Debug logging - only in development
  debug: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

export default secureLog;
