import { z } from 'zod';

// Configuration schema pour validation
const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default('groupomania'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().min(1, 'Database password is required'),

  // Services ports
  API_GATEWAY_PORT: z.coerce.number().default(3000),
  USER_SERVICE_PORT: z.coerce.number().default(3001),
  POST_SERVICE_PORT: z.coerce.number().default(3002),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),

  // Rate limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.string().default('15m'),

  // CORS
  CORS_ORIGIN: z.string().default('*'),

  // File upload
  MAX_FILE_SIZE: z.coerce.number().default(5242880), // 5MB
  UPLOAD_PATH: z.string().default('./uploads'),
});

export type Config = z.infer<typeof configSchema>;

// Fonction pour valider et retourner la configuration
export function validateConfig(): Config {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      
      throw new Error(`Configuration validation failed:\n${missingVars}`);
    }
    throw error;
  }
}// Configuration globale
export const config = validateConfig();

// Utilitaires de configuration
export const isDevelopment = () => config.NODE_ENV === 'development';
export const isProduction = () => config.NODE_ENV === 'production';
export const isTest = () => config.NODE_ENV === 'test';

// Configuration de base de données
export const getDatabaseUrl = () =>
  `postgresql://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;

// Configuration du logger
export const getLoggerConfig = () => ({
  level: config.LOG_LEVEL,
  transport: isDevelopment() ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    }
  } : undefined,
});
