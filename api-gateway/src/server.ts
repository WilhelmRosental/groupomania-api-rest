/**
 * API Gateway server startup
 */

import buildGateway from './app';

async function start(): Promise<void> {
  try {
    const fastify = await buildGateway();
    
    const port = parseInt(process.env.API_GATEWAY_PORT ?? '3000', 10);
    const host = process.env.HOST ?? '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.error(`API Gateway listening on ${host}:${port}`);
  } catch (err) {
    console.error('Error starting API Gateway:', err);
    process.exit(1);
  }
}

start();
