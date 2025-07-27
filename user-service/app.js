/**
 * User microservice application configuration
 * Handles user authentication, registration, and profile management
 */

const fastify = require('fastify')({ logger: true });

/**
 * Register plugins and routes for user service
 */
async function buildUserApp() {
  // Security plugins
  await fastify.register(require('@fastify/helmet'));
  
  // CORS configuration
  await fastify.register(require('@fastify/cors'), {
    origin: ["http://localhost:3000", "http://localhost:3001"], // API Gateway + Frontend
    credentials: true
  });

  // Cookie support
  await fastify.register(require('@fastify/cookie'));

  // Rate limiting
  await fastify.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '15 minutes'
  });

  // Custom validation hook
  fastify.addHook('preHandler', async (request, reply) => {
    const { sanitizeRequest } = require('../shared/middleware/validation');
    sanitizeRequest(request, reply, () => {});
  });

  // Register user routes
  await fastify.register(require('./routes/user'), { prefix: '/api/auth' });

  return fastify;
}

module.exports = buildUserApp;