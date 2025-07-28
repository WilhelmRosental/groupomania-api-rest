/**
 * Post routes for microservice architecture
 * Defines all REST endpoints for post operations
 */

import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { postController } from '../controllers/post';
import { auth } from '../middleware/auth';
import { PostCreationAttributes, PaginationQuery } from '../types';

// Type definitions for request objects
interface CreatePostRequest extends FastifyRequest {
  body: PostCreationAttributes;
}

interface PostParamsRequest extends FastifyRequest {
  params: { id: string };
}

interface UserPostsRequest extends FastifyRequest {
  params: { id: string };
  query: PaginationQuery;
}

interface PostsRequest extends FastifyRequest {
  query: PaginationQuery;
}

export default function postRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions): void {
  // Create a new post (requires authentication)
  fastify.post('/', {
    preHandler: auth,
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return postController.createPost(request as CreatePostRequest, reply);
    },
  });

  // Get all posts with pagination
  fastify.get('/', {
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return postController.getAllPosts(request as PostsRequest, reply);
    },
  });

  // Get a specific post by ID
  fastify.get('/:id', {
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return postController.getOnePost(request as PostParamsRequest, reply);
    },
  });

  // Get all posts for a specific user
  fastify.get('/user/:id', {
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return postController.getUserAllPosts(request as UserPostsRequest, reply);
    },
  });

  // Delete a post (requires authentication and ownership/admin)
  fastify.delete('/:id', {
    preHandler: auth,
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      return postController.deletePost(request as PostParamsRequest, reply);
    },
  });
}
