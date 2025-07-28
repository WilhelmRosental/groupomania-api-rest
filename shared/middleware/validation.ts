/**
 * Simplified validation middleware for microservices
 */

interface ValidationSchemas {
  [key: string]: unknown;
}

export function createValidationMiddleware(_schemas: ValidationSchemas) {
  return (request: Record<string, unknown>, reply: { status: (code: number) => { send: (body: unknown) => void } }): void => {
    try {
      if (typeof request === 'object' && request !== null && 'body' in request && typeof (request as { body?: unknown }).body === 'object' && (request as { body?: unknown }).body !== null) {
        const sanitizedBody = JSON.parse(JSON.stringify((request as { body: unknown }).body));
        (request as { body: unknown }).body = sanitizedBody;
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
  if (typeof req === 'object' && req !== null && 'body' in req && typeof (req as { body?: unknown }).body === 'object' && (req as { body?: unknown }).body !== null) {
    const sanitizedBody = Object.fromEntries(
      Object.entries((req as { body: Record<string, unknown> }).body).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value
      ])
    );
    (req as { body: Record<string, unknown> }).body = sanitizedBody;
  }
  
  return req;
}
