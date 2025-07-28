import { FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodSchema } from 'zod';

export interface ValidationSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
  headers?: ZodSchema;
}

export function createValidationMiddleware(schemas: ValidationSchemas) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Validate request body
      if (schemas.body) {
        request.body = schemas.body.parse(request.body);
      }

      // Validate request params
      if (schemas.params) {
        request.params = schemas.params.parse(request.params);
      }

      // Validate request query
      if (schemas.query) {
        request.query = schemas.query.parse(request.query);
      }

      // Validate request headers
      if (schemas.headers) {
        const validHeaders = schemas.headers.parse(request.headers);
        Object.assign(request.headers, validHeaders);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: 'Invalid request data',
          details: error.issues.map((err: z.ZodIssue) => ({
            path: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        });
      }

      // Re-throw unexpected errors
      throw error;
    }
  };
}

// Schémas de validation couramment utilisés
export const commonSchemas = {
  id: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),

  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),

  auth: z.object({
    authorization: z.string().regex(/^Bearer .+/, 'Invalid authorization header format'),
  }),
};
