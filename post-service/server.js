/**
 * Post service server startup
 */

const buildPostApp = require('./app');

async function start() {
  try {
    const fastify = await buildPostApp();
    
    const port = process.env.POST_SERVICE_PORT || 3002;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`Post Service listening on ${host}:${port}`);
  } catch (err) {
    console.error('Error starting post service:', err);
    process.exit(1);
  }
}

start();