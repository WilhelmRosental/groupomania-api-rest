/**
 * Post routes for microservice architecture
 * Defines all REST endpoints for post operations
 */

const postController = require('../controllers/post');
const auth = require('../middleware/auth');

async function postRoutes(fastify, options) {
  // Create a new post (requires authentication)
  fastify.post('/', {
    preHandler: auth,
    handler: postController.createPost
  });

  // Get all posts with pagination
  fastify.get('/', {
    handler: postController.getAllPosts
  });

  // Get a specific post by ID
  fastify.get('/:id', {
    handler: postController.getOnePost
  });

  // Get all posts for a specific user
  fastify.get('/user/:id', {
    handler: postController.getUserAllPosts
  });

  // Delete a post (requires authentication and ownership/admin)
  fastify.delete('/:id', {
    preHandler: auth,
    handler: postController.deletePost
  });
}

module.exports = postRoutes;