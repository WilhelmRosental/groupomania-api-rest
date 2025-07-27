/**
 * Database configuration for Sequelize CLI
 * Format required by sequelize-cli db:migrate
 */

// Try to load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available, use environment variables directly
}

const config = {
  database: process.env.POST_DB_NAME || 'groupomania_posts',
  username: process.env.POST_DB_USER || 'groupomania',
  password: process.env.POST_DB_PASSWORD || 'groupomania',
  host: process.env.POST_DB_HOST || 'localhost',
  port: process.env.POST_DB_PORT || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

module.exports = {
  development: config,
  test: config,
  production: config
};