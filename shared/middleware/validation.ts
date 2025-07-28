/**
 * Simplified validation middleware for microservices
 */

import type { FastifyRequest, FastifyReply } from 'fastify';

interface ValidationSchemas {
  [key: string]: any;
}

export function createValidationMiddleware(_schemas: ValidationSchemas) {
  return async (request: any, reply: any): Promise<void> => {
    try {
      if (request.body && typeof request.body === 'object') {
        const sanitizedBody = JSON.parse(JSON.stringify(request.body));
        request.body = sanitizedBody;
      }
    } catch (error) {
      // Silent fail for validation
      const validationError = error as Error;
      reply.status(400).send({ error: validationError.message });
    }
  };
}

export const commonSchemas = {
  // Add common validation schemas here
};

export function sanitizeRequest(req: Record<string, unknown>): Record<string, unknown> {
  // Basic request sanitization
  if (req.body && typeof req.body === 'object') {
    const sanitizedBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value
      ])
    );
    req.body = sanitizedBody;
  }
  
  return req;
}
