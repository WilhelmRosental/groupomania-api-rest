/**
 * User Controller for microservice architecture
 * Handles all user-related operations
 */

import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models';
import { 
  UserSignupBody, 
  UserLoginBody, 
  UserUpdateBody, 
  AuthenticatedRequest
} from '../types';

interface UserController {
  signup(request: FastifyRequest<{ Body: UserSignupBody }>, reply: FastifyReply): Promise<void>;
  login(request: FastifyRequest<{ Body: UserLoginBody }>, reply: FastifyReply): Promise<void>;
  getProfile(request: AuthenticatedRequest, reply: FastifyReply): Promise<void>;
  updateProfile(request: AuthenticatedRequest & { Body: UserUpdateBody }, reply: FastifyReply): Promise<void>;
  deleteAccount(request: AuthenticatedRequest, reply: FastifyReply): Promise<void>;
  getAllUsers(request: AuthenticatedRequest, reply: FastifyReply): Promise<void>;
}

export const userController: UserController = {
  // User registration
  async signup(request: FastifyRequest<{ Body: UserSignupBody }>, reply: FastifyReply): Promise<void> {
    try {
      const { email, password, firstName, lastName } = request.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        reply.code(400).send({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
        return;
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
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // User login
  async login(request: FastifyRequest<{ Body: UserLoginBody }>, reply: FastifyReply): Promise<void> {
    try {
      const { email, password } = request.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        reply.code(401).send({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
        return;
      }

      // Check password
      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) {
        reply.code(401).send({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          isAdmin: user.isAdmin ?? false
        },
        process.env.JWT_SECRET ?? 'your-secret-key',
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
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get user profile
  async getProfile(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    try {
      const user = await User.findByPk(request.user.id);
      if (!user) {
        reply.code(404).send({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }

      reply.send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la récupération du profil',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Update user profile
  async updateProfile(request: AuthenticatedRequest & { Body: UserUpdateBody }, reply: FastifyReply): Promise<void> {
    try {
      const requestWithBody = request as AuthenticatedRequest & { body: UserUpdateBody };
      const { firstName, lastName, email } = requestWithBody.body;
      const userId = request.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        reply.code(404).send({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }

      // Update only provided fields
      const updateData: Partial<UserUpdateBody> = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (email !== undefined) updateData.email = email;

      await user.update(updateData);

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
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Delete user account
  async deleteAccount(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        reply.code(404).send({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
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
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get all users (admin only)
  async getAllUsers(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    try {
      if (!request.user.isAdmin) {
        reply.code(403).send({
          success: false,
          message: 'Accès interdit - Droits administrateur requis'
        });
        return;
      }

      const users = await User.findAll({
        attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin', 'createdAt']
      });

      reply.send({
        success: true,
        data: users
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

export default userController;
