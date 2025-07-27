/**
 * Post microservice application configuration
 * Handles post CRUD operations and file uploads
 */

const fastify = require('fastify')({ logger: true });
const path = require('path');

/**
 * Register plugins and routes for post service
 */
async function buildPostApp() {
  // Security plugins
  await fastify.register(require('@fastify/helmet'));
  
  // CORS configuration
  await fastify.register(require('@fastify/cors'), {
    origin: ["http://localhost:3000", "http://localhost:3001"], // API Gateway + Frontend
    credentials: true
  });

  // Cookie support
  await fastify.register(require('@fastify/cookie'));

  // Static files for images
  await fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'images'),
    prefix: '/images/'
  });

  // Rate limiting
  await fastify.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '15 minutes'
  });

  // Multipart support for file uploads
  await fastify.register(require('@fastify/multipart'));

  // Custom validation hook
  fastify.addHook('preHandler', async (request, reply) => {
    const { sanitizeRequest } = require('../shared/middleware/validation');
    sanitizeRequest(request, reply, () => {});
  });

  // Register post routes
  await fastify.register(require('./routes/post'), { prefix: '/api/posts' });

  return fastify;
}

module.exports = buildPostApp;