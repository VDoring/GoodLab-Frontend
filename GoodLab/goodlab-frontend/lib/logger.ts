/**
 * Logger utility for error and debug logging
 * In production, this can be extended to send logs to external services like Sentry
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, context?: LogContext) {
    // In production, you would send this to a logging service
    // For now, we only log in development
    if (this.isDevelopment) {
      const timestamp = new Date().toISOString();
      const contextStr = context ? JSON.stringify(context, null, 2) : '';

      switch (level) {
        case 'error':
          console.error(`[${timestamp}] ERROR:`, message, contextStr);
          break;
        case 'warn':
          console.warn(`[${timestamp}] WARN:`, message, contextStr);
          break;
        case 'info':
          console.info(`[${timestamp}] INFO:`, message, contextStr);
          break;
        case 'debug':
          console.debug(`[${timestamp}] DEBUG:`, message, contextStr);
          break;
      }
    }

    // TODO: In production, send to error tracking service
    // Example: Sentry.captureMessage(message, { level, extra: context });
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }
}

// Export singleton instance
export const logger = new Logger();
