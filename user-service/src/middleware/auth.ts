/**
 * Authentication middleware for user service
 * Validates JWT tokens and extracts user information
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { JwtPayload, UserPayload } from '../types';

interface AuthenticatedRequest extends FastifyRequest {
  user: UserPayload;
}

export const auth = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const token = request.headers.authorization;
    
    if (token === undefined || token === null) {
      await reply.code(401).send({
        success: false,
        message: 'Token d\'authentification manquant'
      });
      return;
    }

    // Remove "Bearer " prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    const decodedToken = jwt.verify(cleanToken, process.env.JWT_SECRET ?? 'your-secret-key') as JwtPayload;
    
    (request as AuthenticatedRequest).user = {
      id: decodedToken.userId,
      isAdmin: decodedToken.isAdmin ?? false
    };
    
  } catch {
    await reply.code(401).send({
      success: false,
      message: 'Token invalide'
    });
  }
};

export default auth;
