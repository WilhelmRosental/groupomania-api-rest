/**
 * Shared validation middleware for microservices
 * Provides validation functions and sanitization
 */

const { ZodError } = require('zod');

/**
 * Creates a validation middleware for request body (Fastify version)
 * @param {Object} schema - Zod schema to validate against
 * @returns {Function} Fastify middleware function
 */
const validateBody = (schema) => {
  return async (request, reply) => {
    try {
      const validatedData = schema.parse(request.body);
      request.body = validatedData;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors?.map(err => ({
          field: err.path.join('.'),
          message: err.message
        })) || [{ field: 'unknown', message: error.message || 'Validation error' }];
        return reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: errorMessages
        });
      }
      return reply.code(500).send({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  };
};

/**
 * Creates a validation middleware for request parameters (Fastify version)
 * @param {Object} schema - Zod schema to validate against
 * @returns {Function} Fastify middleware function
 */
const validateParams = (schema) => {
  return async (request, reply) => {
    try {
      const validatedData = schema.parse(request.params);
      request.params = validatedData;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors?.map(err => ({
          field: err.path.join('.'),
          message: err.message
        })) || [{ field: 'unknown', message: error.message || 'Validation error' }];
        return reply.code(400).send({
          success: false,
          error: 'Invalid parameters',
          details: errorMessages
        });
      }
      return reply.code(500).send({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  };
};

/**
 * Sanitization middleware for Fastify
 * Removes potentially harmful content from requests
 */
const sanitizeRequest = (request, reply, done) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    // Remove script tags and other potentially harmful content
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  const sanitizeObject = (obj) => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') return sanitizeString(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
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

module.exports = {
  validateBody,
  validateParams,
  sanitizeRequest
};