import fastify, { FastifyInstance } from 'fastify';
import path from 'path';
import postRoutes from './routes/post';

/**
 * Register plugins and routes for post service
 */
async function buildPostApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger:
      process.env.NODE_ENV === 'development'
        ? {
            level: process.env.LOG_LEVEL ?? 'info',
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            },
          }
        : {
            level: process.env.LOG_LEVEL ?? 'info',
          },
  });

  // Security plugins
  await app.register(require('@fastify/helmet'));

  // CORS configuration
  await app.register(require('@fastify/cors'), {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // API Gateway + Frontend
    credentials: true,
  });

  // Cookie support
  await app.register(require('@fastify/cookie'));

  // Static files for images
  await app.register(require('@fastify/static'), {
    root: path.join(__dirname, '../images'),
    prefix: '/images/',
  });

  // Rate limiting
  await app.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '15 minutes',
  });

  // Multipart support for file uploads
  await app.register(require('@fastify/multipart'));

  // Register post routes
  await app.register(postRoutes, { prefix: '/api/posts' });

  // Custom validation hook
  app.addHook('preHandler', async (request, reply): Promise<void> => {
    // Import dynamically to avoid circular dependencies
    try {
      const validationModule = (await import('@groupomania/shared/middleware/validation')) as {
        createValidationMiddleware?: (
          options: Record<string, unknown>
        ) => (request: unknown, reply: unknown) => void;
      };
      const createValidationMiddleware = validationModule.createValidationMiddleware;
      if (typeof createValidationMiddleware === 'function') {
        const middleware = createValidationMiddleware({});
        await middleware(request, reply);
      }
    } catch {
      request.log.warn('Validation middleware not available');
    }
  });

  // Error handler
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    const statusCode = error.statusCode ?? 500;
    const message = statusCode === 500 ? 'Internal Server Error' : error.message;

    // Send error response
    reply.status(statusCode).send({ error: message });
  });

  return app;
}

export default buildPostApp;
