/**
 * User service server startup
 */

const buildUserApp = require('./app');

async function start() {
  try {
    const fastify = await buildUserApp();
    
    const port = process.env.USER_SERVICE_PORT || 3001;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`User Service listening on ${host}:${port}`);
  } catch (err) {
    console.error('Error starting user service:', err);
    process.exit(1);
  }
}

start();