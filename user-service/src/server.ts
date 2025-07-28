/**
 * User service server startup
 */

import buildUserApp from './app';

async function start(): Promise<void> {
  try {
    const fastify = await buildUserApp();
    
    const port = parseInt(process.env.USER_SERVICE_PORT ?? '3001');
    const host = process.env.HOST ?? '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.error(`User Service listening on ${host}:${port}`);
  } catch (err) {
    console.error('Error starting user service:', err);
    process.exit(1);
  }
}

start();
