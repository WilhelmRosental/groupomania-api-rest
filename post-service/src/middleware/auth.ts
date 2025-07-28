/**
 * Authentication middleware for post service
 * Verifies JWT tokens and extracts user information
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key';

/**
 * Authentication middleware
 * Verifies JWT token and adds user info to request
 */
export const auth = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      await reply.status(401).send({
        error: 'Access denied. No token provided or invalid format.'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      
      // Add user info to request object
      request.userId = decoded.userId;
      request.isAdmin = decoded.isAdmin;
      
    } catch {
      await reply.status(401).send({
        error: 'Invalid token.'
      });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    await reply.status(500).send({
      error: 'Internal server error during authentication.'
    });
  }
};
