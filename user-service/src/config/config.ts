/**
 * Database configuration for user service
 */

import dotenv from 'dotenv';

// Try to load dotenv if available
try {
  dotenv.config();
} catch {
  // dotenv not available, use environment variables directly
}

export interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  dialect: 'postgres';
  logging: boolean | ((...args: unknown[]) => void);
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

const config: DatabaseConfig = {
  database: process.env.USER_DB_NAME ?? 'groupomania_users',
  username: process.env.USER_DB_USER ?? 'postgres',
  password: process.env.USER_DB_PASSWORD ?? '',
  host: process.env.USER_DB_HOST ?? 'localhost',
  port: parseInt(process.env.USER_DB_PORT ?? '5432', 10),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.error : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default config;
