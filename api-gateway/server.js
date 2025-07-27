/**
 * API Gateway server startup
 */

const buildGateway = require('./app');

async function start() {
  try {
    const fastify = await buildGateway();
    
    const port = process.env.API_GATEWAY_PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`API Gateway listening on ${host}:${port}`);
  } catch (err) {
    console.error('Error starting API Gateway:', err);
    process.exit(1);
  }
}

start();