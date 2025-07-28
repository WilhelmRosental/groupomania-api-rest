/**
 * Post routes for microservice architecture
 * Defines all REST endpoints for post operations
 */

import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { postController } from '../controllers/post';
import { auth } from '../middleware/auth';

export default function postRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions): void {
  // Create a new post (requires authentication)
  fastify.post('/', {
    preHandler: auth,
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return postController.createPost(request as any, reply);
    }
  });

  // Get all posts with pagination
  fastify.get('/', {
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return postController.getAllPosts(request as any, reply);
    }
  });

  // Get a specific post by ID
  fastify.get('/:id', {
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return postController.getOnePost(request as any, reply);
    }
  });

  // Get all posts for a specific user
  fastify.get('/user/:id', {
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return postController.getUserAllPosts(request as any, reply);
    }
  });

  // Delete a post (requires authentication and ownership/admin)
  fastify.delete('/:id', {
    preHandler: auth,
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return postController.deletePost(request as any, reply);
    }
  });
}
