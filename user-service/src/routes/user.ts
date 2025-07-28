/**
 * User routes for microservice architecture
 * Defines all REST endpoints for user operations
 */

import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { userController } from '../controllers/user';
import { auth } from '../middleware/auth';

export default function userRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions): void {
  // User registration
  fastify.post('/signup', {
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return userController.signup(request as any, reply);
    }
  });

  // User login
  fastify.post('/login', {
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return userController.login(request as any, reply);
    }
  });

  // Get user profile (requires authentication)
  fastify.get('/profile', {
    preHandler: auth,
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return userController.getProfile(request as any, reply);
    }
  });

  // Update user profile (requires authentication)
  fastify.put('/profile', {
    preHandler: auth,
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return userController.updateProfile(request as any, reply);
    }
  });

  // Delete user account (requires authentication)
  fastify.delete('/account', {
    preHandler: auth,
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return userController.deleteAccount(request as any, reply);
    }
  });

  // Get all users (admin only)
  fastify.get('/all', {
    preHandler: auth,
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return userController.getAllUsers(request as any, reply);
    }
  });
}
