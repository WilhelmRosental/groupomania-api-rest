/**
 * Database configuration for user service
 */

// Try to load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, use environment variables directly
}

module.exports = {
  database: process.env.USER_DB_NAME || 'groupomania_users',
  username: process.env.USER_DB_USER || 'postgres',
  password: process.env.USER_DB_PASSWORD || '',
  host: process.env.USER_DB_HOST || 'localhost',
  port: process.env.USER_DB_PORT || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};