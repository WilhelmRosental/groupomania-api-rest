/**
 * User Controller for microservice architecture
 * Handles all user-related operations
 */

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const userController = {
  // User registration
  async signup(request, reply) {
    try {
      const { email, password, firstName, lastName } = request.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return reply.code(400).send({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }

      // Hash password
      const hashedPassword = await argon2.hash(password);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName
      });

      reply.code(201).send({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error.message
      });
    }
  },

  // User login
  async login(request, reply) {
    try {
      const { email, password } = request.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return reply.code(401).send({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Check password
      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) {
        return reply.code(401).send({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          isAdmin: user.isAdmin || false
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      reply.send({
        success: true,
        message: 'Connexion réussie',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin
          }
        }
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la connexion',
        error: error.message
      });
    }
  },

  // Get user profile
  async getProfile(request, reply) {
    try {
      const user = await User.findByPk(request.user.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return reply.code(404).send({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      reply.send({
        success: true,
        data: user
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la récupération du profil',
        error: error.message
      });
    }
  },

  // Update user profile
  async updateProfile(request, reply) {
    try {
      const { firstName, lastName, email } = request.body;
      const userId = request.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return reply.code(404).send({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Check if email is already taken by another user
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return reply.code(400).send({
            success: false,
            message: 'Cet email est déjà utilisé'
          });
        }
      }

      // Update user
      await user.update({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email
      });

      reply.send({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la mise à jour du profil',
        error: error.message
      });
    }
  },

  // Delete user account
  async deleteAccount(request, reply) {
    try {
      const userId = request.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        return reply.code(404).send({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      await user.destroy();

      reply.send({
        success: true,
        message: 'Compte supprimé avec succès'
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la suppression du compte',
        error: error.message
      });
    }
  },

  // Get all users (admin only)
  async getAllUsers(request, reply) {
    try {
      if (!request.user.isAdmin) {
        return reply.code(403).send({
          success: false,
          message: 'Accès non autorisé'
        });
      }

      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });

      reply.send({
        success: true,
        data: users
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message
      });
    }
  }
};

module.exports = userController;