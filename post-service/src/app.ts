/**
 * Post microservice application configuration
 * Handles post CRUD operations and file uploads
 */

import fastify, { FastifyInstance } from 'fastify';
import path from 'path';
import postRoutes from './routes/post';

/**
 * Register plugins and routes for post service
 */
async function buildPostApp(): Promise<FastifyInstance> {
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

  // Static files for images
  await app.register(require('@fastify/static'), {
    root: path.join(__dirname, '../images'),
    prefix: '/images/'
  });

  // Rate limiting
  await app.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '15 minutes'
  });

  // Multipart support for file uploads
  await app.register(require('@fastify/multipart'));

  // Custom validation hook
  app.addHook('preHandler', (request, reply, done) => {
    const { sanitizeRequest } = require('../../shared/middleware/validation') as { sanitizeRequest: (req: any, rep: any, callback: () => void) => void };
    sanitizeRequest(request, reply, done);
  });

  // Register post routes
  await app.register(postRoutes, { prefix: '/api/posts' });

  return app;
}

export default buildPostApp;
