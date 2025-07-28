/**
 * Shared validation middleware for microservices
 * Provides request sanitization and validation utilities
 */
import { FastifyRequest, FastifyReply } from 'fastify';
interface ZodSchema {
    parse(data: unknown): unknown;
}
/**
 * Validation middleware factory for request body
 */
export declare function validateBody(schema: ZodSchema): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
/**
 * Validation middleware factory for request parameters
 */
export declare function validateParams(schema: ZodSchema): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
/**
 * Request sanitization middleware
 * Removes potentially harmful content from request data
 */
export declare const sanitizeRequest: (request: FastifyRequest, reply: FastifyReply, done: () => void) => void;
export {};
//# sourceMappingURL=validation.d.ts.map