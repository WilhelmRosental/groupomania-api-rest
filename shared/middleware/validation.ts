/**
 * Shared validation middleware for microservices
 * Provides request sanitization and validation utilities
 */

import { FastifyRequest, FastifyReply } from 'fastify';

// Types for Zod (without importing zod directly to avoid dependency issues)
interface ZodError {
  errors: Array<{
    code: string;
    path: (string | number)[];
    message: string;
  }>;
}

interface ZodSchema {
  parse(data: unknown): unknown;
}

/**
 * Validation middleware factory for request body
 */
export function validateBody(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      request.body = schema.parse(request.body);
    } catch (error) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as ZodError;
        return reply.status(400).send({
          success: false,
          message: 'Validation failed',
          errors: zodError.errors
        });
      }
      throw error;
    }
  };
}

/**
 * Validation middleware factory for request parameters
 */
export function validateParams(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      request.params = schema.parse(request.params);
    } catch (error) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as ZodError;
        return reply.status(400).send({
          success: false,
          message: 'Invalid parameters',
          errors: zodError.errors
        });
      }
      throw error;
    }
  };
}

/**
 * Request sanitization middleware
 * Removes potentially harmful content from request data
 */
export const sanitizeRequest = (request: FastifyRequest, reply: FastifyReply, done: () => void): void => {
  const sanitizeString = (str: unknown): unknown => {
    if (typeof str !== 'string') return str;
    
    // Remove script tags and other potentially harmful content
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  const sanitizeObject = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') return sanitizeString(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  // Sanitize request data
  if (request.body) request.body = sanitizeObject(request.body);
  if (request.query) request.query = sanitizeObject(request.query);
  if (request.params) request.params = sanitizeObject(request.params);

  done();
};
