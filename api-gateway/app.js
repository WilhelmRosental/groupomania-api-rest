/**
 * API Gateway for Groupomania microservices
 * Routes requests to appropriate microservices
 */

const fastify = require('fastify')({ logger: true });

/**
 * Build API Gateway application
 */
async function buildGateway() {
  // Security plugins
  await fastify.register(require('@fastify/helmet'));
  
  // CORS configuration for frontend
  await fastify.register(require('@fastify/cors'), {
    origin: "http://localhost:3001", // Frontend URL
    credentials: true
  });

  // Global rate limiting
  await fastify.register(require('@fastify/rate-limit'), {
    max: 200,
    timeWindow: '15 minutes'
  });

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return { status: 'OK', timestamp: new Date().toISOString() };
  });

  // Proxy to User Service
  await fastify.register(require('@fastify/http-proxy'), {
    upstream: 'http://localhost:3001',
    prefix: '/api/auth',
    http2: false
  });

  // Proxy to Post Service
  await fastify.register(require('@fastify/http-proxy'), {
    upstream: 'http://localhost:3002',
    prefix: '/api/posts',
    http2: false
  });

  // Proxy for images from Post Service
  await fastify.register(require('@fastify/http-proxy'), {
    upstream: 'http://localhost:3002',
    prefix: '/images',
    http2: false
  });

  return fastify;
}

module.exports = buildGateway;