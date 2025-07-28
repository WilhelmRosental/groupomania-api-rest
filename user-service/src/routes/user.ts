/**
 * User routes for microservice architecture
 * Defines all REST endpoints for user operations
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { userController } from '../controllers/user';
import { auth } from '../middleware/auth';
import { signupSchema, loginSchema, updateProfileSchema, updatePasswordSchema } from '../schemas/userSchemas';
import { UserSignupBody, UserLoginBody, UserUpdateBody, AuthenticatedRequest } from '../types';

// Define proper route handlers with correct types
async function signupHandler(request: FastifyRequest<{ Body: UserSignupBody }>, reply: FastifyReply) {
  return userController.signup(request, reply);
}

async function loginHandler(request: FastifyRequest<{ Body: UserLoginBody }>, reply: FastifyReply) {
  return userController.login(request, reply);
}

async function getProfileHandler(request: AuthenticatedRequest, reply: FastifyReply) {
  return userController.getProfile(request, reply);
}

async function updateProfileHandler(request: AuthenticatedRequest & { Body: UserUpdateBody }, reply: FastifyReply) {
  return userController.updateProfile(request, reply);
}

async function updatePasswordHandler(request: AuthenticatedRequest & { Body: { password: string } }, reply: FastifyReply) {
  return userController.updatePassword(request, reply);
}

async function deleteAccountHandler(request: AuthenticatedRequest, reply: FastifyReply) {
  return userController.deleteAccount(request, reply);
}

async function getAllUsersHandler(request: AuthenticatedRequest, reply: FastifyReply) {
  return userController.getAllUsers(request, reply);
}

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', {
    schema: {
      body: signupSchema
    }
  }, async (request, reply) => {
    return userController.signup(request as FastifyRequest<{ Body: UserSignupBody }>, reply);
  });

  fastify.post('/login', {
    schema: {
      body: loginSchema
    }
  }, async (request, reply) => {
    return userController.login(request as FastifyRequest<{ Body: UserLoginBody }>, reply);
  });

  fastify.get('/profile', { 
    preHandler: [auth] 
  }, async (request, reply) => {
    return userController.getProfile(request as AuthenticatedRequest, reply);
  });

  fastify.put('/profile', { 
    preHandler: [auth],
    schema: {
      body: updateProfileSchema
    }
  }, async (request, reply) => {
    return userController.updateProfile(request as AuthenticatedRequest & { Body: UserUpdateBody }, reply);
  });

  fastify.put('/password', { 
    preHandler: [auth],
    schema: {
      body: updatePasswordSchema
    }
  }, async (request, reply) => {
    return userController.updatePassword(request as AuthenticatedRequest & { Body: { password: string } }, reply);
  });

  fastify.delete('/account', { 
    preHandler: [auth] 
  }, async (request, reply) => {
    return userController.deleteAccount(request as AuthenticatedRequest, reply);
  });

  fastify.get('/admin/users', { 
    preHandler: [auth] 
  }, async (request, reply) => {
    return userController.getAllUsers(request as AuthenticatedRequest, reply);
  });
}
