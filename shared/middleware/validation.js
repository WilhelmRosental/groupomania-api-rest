"use strict";
/**
 * Shared validation middleware for microservices
 * Provides request sanitization and validation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeRequest = void 0;
exports.validateBody = validateBody;
exports.validateParams = validateParams;
/**
 * Validation middleware factory for request body
 */
function validateBody(schema) {
    return async (request, reply) => {
        try {
            request.body = schema.parse(request.body);
        }
        catch (error) {
            if (error !== null && typeof error === 'object' && 'errors' in error) {
                const zodError = error;
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
function validateParams(schema) {
    return async (request, reply) => {
        try {
            request.params = schema.parse(request.params);
        }
        catch (error) {
            if (error !== null && typeof error === 'object' && 'errors' in error) {
                const zodError = error;
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
const sanitizeRequest = (request, reply, done) => {
    const sanitizeString = (str) => {
        if (typeof str !== 'string')
            return str;
        // Remove script tags and other potentially harmful content
        const scriptTagPattern = /<script[\s\S]*?<\/script>/gi;
        return str
            .replace(scriptTagPattern, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .trim();
    };
    const sanitizeObject = (obj) => {
        if (obj === null || obj === undefined)
            return obj;
        if (typeof obj === 'string')
            return sanitizeString(obj);
        if (Array.isArray(obj))
            return obj.map(sanitizeObject);
        if (typeof obj === 'object') {
            const sanitized = {};
            const entries = Object.entries(obj);
            for (const [key, value] of entries) {
                // Safe property assignment only for valid property names
                if (typeof key === 'string' && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
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
exports.sanitizeRequest = sanitizeRequest;
//# sourceMappingURL=validation.js.map