/**
 * Database configuration for post service
 */

// Try to load dotenv if available
try {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  require('dotenv').config();
} catch {
  // dotenv not available, use environment variables directly
}

interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  dialect: 'postgres';
  logging: boolean | ((sql: string) => void);
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

const config: DatabaseConfig = {
  database: process.env.POST_DB_NAME ?? 'groupomania_posts',
  username: process.env.POST_DB_USER ?? 'postgres',
  password: process.env.POST_DB_PASSWORD ?? '',
  host: process.env.POST_DB_HOST ?? 'localhost',
  port: parseInt(process.env.POST_DB_PORT ?? '5432'),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? false : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export = config;
