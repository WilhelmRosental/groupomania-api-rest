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
    // Check authorization header
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; isAdmin?: boolean };
        (request as any).userId = decoded.userId;
        (request as any).isAdmin = decoded.isAdmin;
        
        // Check if token and user are valid
        if (!token || !decoded || !decoded.userId) {
          return reply.status(401).send({
            success: false,
            message: 'Token invalide'
          });
        }

      } catch {
        await reply.status(401).send({
          error: 'Invalid token.'
        });
        return;
      }
    } else {
      return reply.status(401).send({
        success: false,
        message: 'Token requis'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    await reply.status(500).send({
      error: 'Internal server error during authentication.'
    });
  }
};

// Add type declaration for FastifyRequest extension
declare module 'fastify' {
  interface FastifyRequest {
    userId?: number;
    isAdmin?: boolean;
  }
}
