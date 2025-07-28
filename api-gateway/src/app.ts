/**
 * API Gateway for Groupomania microservices
 * Routes requests to appropriate microservices
 */

import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

/**
 * Build API Gateway application
 */
async function buildGateway(): Promise<FastifyInstance> {
  const app = fastify({ logger: true });

  // Security plugins
  await app.register(require('@fastify/helmet'));

  // CORS configuration for frontend
  await app.register(require('@fastify/cors'), {
    origin: 'http://localhost:3001', // Frontend URL
    credentials: true,
  });

  // Global rate limiting
  await app.register(require('@fastify/rate-limit'), {
    max: 200,
    timeWindow: '15 minutes',
  });

  // Health check endpoint
  app.get('/health', (_request: FastifyRequest, _reply: FastifyReply) => {
    return { status: 'OK', timestamp: new Date().toISOString() };
  });

  // Proxy to User Service
  await app.register(require('@fastify/http-proxy'), {
    upstream: 'http://localhost:3001',
    prefix: '/api/auth',
    http2: false,
  });

  // Proxy to Post Service
  await app.register(require('@fastify/http-proxy'), {
    upstream: 'http://localhost:3002',
    prefix: '/api/posts',
    http2: false,
  });

  // Proxy for images from Post Service
  await app.register(require('@fastify/http-proxy'), {
    upstream: 'http://localhost:3002',
    prefix: '/images',
    http2: false,
  });

  return app;
}

export default buildGateway;
