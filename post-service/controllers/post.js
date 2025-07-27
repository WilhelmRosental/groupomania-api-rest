/**
 * Post Controller for microservice architecture
 * Handles all post-related operations
 */

const { Post } = require('../models');

const postController = {
  // Create a new post
  async createPost(request, reply) {
    try {
      const { title, content, imageUrl } = request.body;
      const userId = request.user.id;

      const post = await Post.create({
        userId,
        title,
        content,
        imageUrl
      });

      reply.code(201).send({
        success: true,
        message: 'Post créé avec succès',
        data: post
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la création du post',
        error: error.message
      });
    }
  },

  // Get all posts with pagination
  async getAllPosts(request, reply) {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: posts } = await Post.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      reply.send({
        success: true,
        data: {
          posts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: limit
          }
        }
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la récupération des posts',
        error: error.message
      });
    }
  },

  // Get a specific post by ID
  async getOnePost(request, reply) {
    try {
      const { id } = request.params;
      
      const post = await Post.findByPk(id);
      
      if (!post) {
        return reply.code(404).send({
          success: false,
          message: 'Post non trouvé'
        });
      }

      reply.send({
        success: true,
        data: post
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la récupération du post',
        error: error.message
      });
    }
  },

  // Get all posts for a specific user
  async getUserAllPosts(request, reply) {
    try {
      const { id: userId } = request.params;
      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: posts } = await Post.findAndCountAll({
        where: { userId },
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      reply.send({
        success: true,
        data: {
          posts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: limit
          }
        }
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la récupération des posts de l\'utilisateur',
        error: error.message
      });
    }
  },

  // Delete a post
  async deletePost(request, reply) {
    try {
      const { id } = request.params;
      const userId = request.user.id;
      const isAdmin = request.user.isAdmin;

      const post = await Post.findByPk(id);
      
      if (!post) {
        return reply.code(404).send({
          success: false,
          message: 'Post non trouvé'
        });
      }

      // Check if user owns the post or is admin
      if (post.userId !== userId && !isAdmin) {
        return reply.code(403).send({
          success: false,
          message: 'Non autorisé à supprimer ce post'
        });
      }

      await post.destroy();

      reply.send({
        success: true,
        message: 'Post supprimé avec succès'
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la suppression du post',
        error: error.message
      });
    }
  }
};

module.exports = postController;