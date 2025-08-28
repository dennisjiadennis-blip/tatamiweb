/**
 * Professional logging system for Tatami Labs
 * Replaces console statements with proper logging in production
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogContext {
  userId?: string;
  requestId?: string;
  component?: string;
  action?: string;
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.level = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${levelStr}: ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);

    if (this.isDevelopment) {
      // In development, use console for better debugging
      switch (level) {
        case LogLevel.ERROR:
          // eslint-disable-next-line no-console
          console.error(formattedMessage, error || '');
          break;
        case LogLevel.WARN:
          // eslint-disable-next-line no-console
          console.warn(formattedMessage);
          break;
        case LogLevel.INFO:
          // eslint-disable-next-line no-console
          console.info(formattedMessage);
          break;
        case LogLevel.DEBUG:
          // eslint-disable-next-line no-console
          console.debug(formattedMessage);
          break;
      }
    } else {
      // In production, you can integrate with external logging services
      // For now, we'll use structured logging that can be easily parsed
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel[level],
        message,
        context,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : undefined,
      };

      // In production, send to logging service (e.g., Winston, Pino, etc.)
      // For now, we'll output to stdout for container logging
      process.stdout.write(JSON.stringify(logEntry) + '\n');
    }
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  // Helper method for API routes
  apiError(message: string, error: Error, context?: LogContext): void {
    this.error(message, { ...context, type: 'api_error' }, error);
  }

  // Helper method for database operations
  dbError(message: string, error: Error, context?: LogContext): void {
    this.error(message, { ...context, type: 'database_error' }, error);
  }

  // Helper method for authentication
  authError(message: string, context?: LogContext): void {
    this.error(message, { ...context, type: 'auth_error' });
  }

  // Helper method for request logging
  request(method: string, path: string, context?: LogContext): void {
    this.info(`${method} ${path}`, { ...context, type: 'request' });
  }

  // Helper method for response logging
  response(method: string, path: string, status: number, duration?: number, context?: LogContext): void {
    this.info(`${method} ${path} - ${status}`, {
      ...context,
      type: 'response',
      status,
      duration,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions for easier usage
export const logError = (message: string, context?: LogContext, error?: Error) => 
  logger.error(message, context, error);

export const logWarn = (message: string, context?: LogContext) => 
  logger.warn(message, context);

export const logInfo = (message: string, context?: LogContext) => 
  logger.info(message, context);

export const logDebug = (message: string, context?: LogContext) => 
  logger.debug(message, context);

// API-specific logging helpers
export const logApiError = (message: string, error: Error, context?: LogContext) =>
  logger.apiError(message, error, context);

export const logDbError = (message: string, error: Error, context?: LogContext) =>
  logger.dbError(message, error, context);

export const logAuthError = (message: string, context?: LogContext) =>
  logger.authError(message, context);

export const logRequest = (method: string, path: string, context?: LogContext) =>
  logger.request(method, path, context);

export const logResponse = (method: string, path: string, status: number, duration?: number, context?: LogContext) =>
  logger.response(method, path, status, duration, context);