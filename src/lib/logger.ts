/**
 * Production-ready logging utility
 * Provides different log levels and environment-aware logging
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class Logger {
  private currentLevel: LogLevel
  
  constructor() {
    this.currentLevel = this.getLogLevel()
  }

  private getLogLevel(): LogLevel {
    if (process.env.NODE_ENV === 'production') {
      return LogLevel.WARN
    }
    if (process.env.NODE_ENV === 'test') {
      return LogLevel.ERROR
    }
    return LogLevel.DEBUG
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.currentLevel
  }

  private formatMessage(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString()
    const formatted = `[${timestamp}] ${level}: ${message}`
    
    if (process.env.NODE_ENV === 'production') {
      // In production, you might want to send logs to a service like Sentry, LogRocket, etc.
      // For now, we'll still use console but with proper formatting
      console.log(formatted, ...args)
    } else {
      console.log(formatted, ...args)
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.formatMessage('ERROR', message, ...args)
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.formatMessage('WARN', message, ...args)
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.formatMessage('INFO', message, ...args)
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.formatMessage('DEBUG', message, ...args)
    }
  }
}

// Export a singleton instance
export const logger = new Logger()

// Helper function for development-only logging
export const devLog = (...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

// Helper function for error reporting in production
export const reportError = (error: Error, context?: Record<string, any>): void => {
  logger.error('Application Error', { error: error.message, stack: error.stack, context })
  
  // In production, you would send this to an error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: context })
  }
}