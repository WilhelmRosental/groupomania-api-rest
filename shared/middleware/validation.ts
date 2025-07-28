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
    } catch (error: unknown) {
      if (error !== null && typeof error === 'object' && 'errors' in error) {
        const zodError = error as ZodError;
        await reply.status(400).send({
          success: false,
          message: 'Validation failed',
          errors: zodError.errors
        });
        return;
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
    } catch (error: unknown) {
      if (error !== null && typeof error === 'object' && 'errors' in error) {
        const zodError = error as ZodError;
        await reply.status(400).send({
          success: false,
          message: 'Invalid parameters',
          errors: zodError.errors
        });
        return;
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
    const scriptTagPattern = /<script[\s\S]*?<\/script>/gi;
    return str
      .replace(scriptTagPattern, '')
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
      const entries = Object.entries(obj as Record<string, unknown>);
      for (const [key, value] of entries) {
        if (typeof key === 'string') {
          sanitized[key] = sanitizeObject(value);
        }
      }
      return sanitized;
    }
    return obj;
  };

  // Sanitize request data
  if (request.body !== null && request.body !== undefined) {
    request.body = sanitizeObject(request.body);
  }
  if (request.query !== null && request.query !== undefined) {
    request.query = sanitizeObject(request.query);
  }
  if (request.params !== null && request.params !== undefined) {
    request.params = sanitizeObject(request.params);
  }

  done();
};
