/**
 * User microservice application configuration
 * Handles user authentication, registration, and profile management
 */

import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import userRoutes from './routes/user';

/**
 * Register plugins and routes for user service
 */
async function buildUserApp(): Promise<FastifyInstance> {
  const app = fastify({ logger: true });

  // Security plugins
  await app.register(require('@fastify/helmet'));
  
  // CORS configuration
  await app.register(require('@fastify/cors'), {
    origin: ["http://localhost:3000", "http://localhost:3001"], // API Gateway + Frontend
    credentials: true
  });

  // Cookie support
  await app.register(require('@fastify/cookie'));

  // Rate limiting
  await app.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '15 minutes'
  });

  // Custom validation hook
  app.addHook('preHandler', (request: FastifyRequest, reply: FastifyReply, done: () => void): void => {
    // Import dynamically to avoid circular dependencies
    const { sanitizeRequest } = require('../../shared/middleware/validation') as { sanitizeRequest: (req: FastifyRequest, res: FastifyReply, callback: () => void) => void };
    sanitizeRequest(request, reply, done);
  });

  // Register user routes
  await app.register(userRoutes, { prefix: '/api/auth' });

  return app;
}

export default buildUserApp;
