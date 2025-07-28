import pino from 'pino';
import { getLoggerConfig, isDevelopment } from './config';

export type LoggerInstance = pino.Logger;

// Create logger instance with proper config
const loggerConfig = getLoggerConfig();
export const logger: LoggerInstance = pino({
  level: loggerConfig.level,
  ...(isDevelopment() && loggerConfig.transport ? { transport: loggerConfig.transport } : {}),
});

// Export logger factory for custom instances
export const createLogger = (name: string): LoggerInstance => {
  return logger.child({ service: name });
};

// Request logger for Fastify
export const requestLogger = {
  logger: logger,
  loggerInstance: logger,
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
};
