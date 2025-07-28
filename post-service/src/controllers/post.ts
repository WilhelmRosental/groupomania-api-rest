/**
 * Post Controller for microservice architecture
 * Handles all post-related operations
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { Post } from '../models';
import { PostCreationAttributes, PaginationQuery } from '../types';
import { paginationQuerySchema, postIdSchema, userIdQuerySchema } from '../schemas/postSchemas';

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

export const postController = {
  // Create a new post
  async createPost(request: CreatePostRequest, reply: FastifyReply): Promise<void> {
    try {
      // Type assertion for request body
      const requestBody = request.body as { title: string; content: string; imageUrl?: string };
      const { title, content, imageUrl } = requestBody;
      const userId = String(request.userId);

      // Validate required fields
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return reply
          .status(400)
          .send({ error: 'Title is required and must be a non-empty string' });
      }

      // Create post data with proper typing
      const postData: PostCreationAttributes = {
        title,
        content,
        userId: parseInt(userId, 10),
      };

      if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
        postData.imageUrl = imageUrl;
      }

      // Create the post
      const post = await Post.create(postData);
      reply.status(201).send({
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        userId: post.userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      });
    } catch (error) {
      const appError = error as Error;
      reply.status(500).send({ error: appError.message });
    }
  },

  // Get all posts with pagination
  async getAllPosts(request: PostsRequest, reply: FastifyReply): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = paginationQuerySchema.parse(request.query);
      const page = validatedQuery.page;
      const limit = validatedQuery.limit;
      const offset = (page - 1) * limit;

      const { count, rows: posts } = await Post.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      reply.send({
        success: true,
        data: {
          posts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: limit,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      reply.status(500).send({
        success: false,
        message: 'Erreur lors de la récupération des posts',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Get a specific post by ID
  async getOnePost(request: PostParamsRequest, reply: FastifyReply): Promise<void> {
    try {
      // Validate parameters
      const validatedParams = postIdSchema.parse(request.params);
      const postId = validatedParams.id;

      const post = await Post.findByPk(postId);

      if (!post) {
        return reply.status(404).send({
          success: false,
          message: 'Post non trouvé',
        });
      }

      reply.send({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error('Get one post error:', error);
      reply.status(500).send({
        success: false,
        message: 'Erreur lors de la récupération du post',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Get all posts for a specific user
  async getUserAllPosts(request: UserPostsRequest, reply: FastifyReply): Promise<void> {
    try {
      // Validate parameters and query
      const validatedParams = userIdQuerySchema.parse({ userId: request.params.id });
      const validatedQuery = paginationQuerySchema.parse(request.query);

      const userId = validatedParams.userId;
      const page = validatedQuery.page;
      const limit = validatedQuery.limit;
      const offset = (page - 1) * limit;

      const { count, rows: posts } = await Post.findAndCountAll({
        where: { userId },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      reply.send({
        success: true,
        data: {
          posts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: limit,
          },
        },
      });
    } catch (error) {
      console.error('Get user posts error:', error);
      reply.status(500).send({
        success: false,
        message: "Erreur lors de la récupération des posts de l'utilisateur",
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Delete a post
  async deletePost(request: PostParamsRequest, reply: FastifyReply): Promise<void> {
    try {
      // Validate parameters
      const validatedParams = postIdSchema.parse(request.params);
      const postId = validatedParams.id;
      const userId = Number(request.userId);
      const isAdmin = request.isAdmin;

      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: 'User not authenticated',
        });
      }

      const post = await Post.findByPk(postId);

      if (!post) {
        return reply.status(404).send({
          success: false,
          message: 'Post non trouvé',
        });
      }

      // Check if user owns the post or is admin
      if (post.userId !== Number(userId) && isAdmin !== true) {
        return reply.status(403).send({
          success: false,
          message: 'Non autorisé à supprimer ce post',
        });
      }

      await post.destroy();

      reply.send({
        success: true,
        message: 'Post supprimé avec succès',
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      const errorObj = error instanceof Error ? error : new Error('Unknown error');

      if (errorObj.message) {
        reply.status(500).send({
          success: false,
          message: 'Erreur lors de la suppression du post',
          error: errorObj.message,
        });
      } else {
        reply.status(500).send({
          success: false,
          message: 'Erreur lors de la suppression du post',
          error: 'Unknown error',
        });
      }
    }
  },
};
