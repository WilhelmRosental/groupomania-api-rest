/**
 * User routes for microservice architecture
 * Defines all REST endpoints for user operations
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { userController } from '../controllers/user';
import { auth } from '../middleware/auth';
import { UserSignupBody, UserLoginBody, UserUpdateBody, AuthenticatedRequest } from '../types';

// Handler functions with proper return types
const signupHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  userController.signup(request as FastifyRequest<{ Body: UserSignupBody }>, reply);
};

const loginHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  userController.login(request as FastifyRequest<{ Body: UserLoginBody }>, reply);
};

const getProfileHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  userController.getProfile(request as AuthenticatedRequest, reply);
};

const updateProfileHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  userController.updateProfile(request as AuthenticatedRequest & { Body: UserUpdateBody }, reply);
};

const updatePasswordHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  userController.updatePassword(request as AuthenticatedRequest & { Body: { password: string } }, reply);
};

const deleteAccountHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  userController.deleteAccount(request as AuthenticatedRequest, reply);
};

const getAllUsersHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  userController.getAllUsers(request as AuthenticatedRequest, reply);
};

export default async function userRoutes(fastify: FastifyInstance): Promise<void> {
  // Register routes
  fastify.post('/api/auth/signup', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    return signupHandler(request, reply);
  });

  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    return loginHandler(request, reply);
  });

  fastify.get('/profile', { 
    preHandler: [auth] 
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    return getProfileHandler(request, reply);
  });

  fastify.put('/profile', { 
    preHandler: [auth],
    schema: {
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string', minLength: 2, maxLength: 50 },
          lastName: { type: 'string', minLength: 2, maxLength: 50 },
          email: { type: 'string', format: 'email', minLength: 5, maxLength: 100 }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    return updateProfileHandler(request, reply);
  });

  fastify.put('/password', { 
    preHandler: [auth],
    schema: {
      body: {
        type: 'object',
        required: ['password'],
        properties: {
          password: { type: 'string', minLength: 8, maxLength: 128 }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    return updatePasswordHandler(request, reply);
  });

  fastify.delete('/account', { 
    preHandler: [auth] 
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    return deleteAccountHandler(request, reply);
  });

  fastify.get('/admin/users', { 
    preHandler: [auth] 
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    return getAllUsersHandler(request, reply);
  });
}
