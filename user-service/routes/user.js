/**
 * User routes for microservice architecture
 * Defines all REST endpoints for user operations
 */

const userController = require('../controllers/user');
const auth = require('../middleware/auth');

async function userRoutes(fastify, options) {
  // User registration
  fastify.post('/signup', {
    handler: userController.signup
  });

  // User login
  fastify.post('/login', {
    handler: userController.login
  });

  // Get user profile (requires authentication)
  fastify.get('/profile', {
    preHandler: auth,
    handler: userController.getProfile
  });

  // Update user profile (requires authentication)
  fastify.put('/profile', {
    preHandler: auth,
    handler: userController.updateProfile
  });

  // Delete user account (requires authentication)
  fastify.delete('/account', {
    preHandler: auth,
    handler: userController.deleteAccount
  });

  // Get all users (admin only)
  fastify.get('/all', {
    preHandler: auth,
    handler: userController.getAllUsers
  });
}

module.exports = userRoutes;