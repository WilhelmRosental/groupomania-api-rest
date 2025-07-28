// Global type augmentations
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      POST_SERVICE_PORT?: string;
      HOST?: string;
      POST_DB_NAME?: string;
      POST_DB_USER?: string;
      POST_DB_PASSWORD?: string;
      POST_DB_HOST?: string;
      POST_DB_PORT?: string;
      JWT_SECRET?: string;
    }
  }
}

// Fastify module augmentation
declare module 'fastify' {
  interface FastifyRequest {
    userId?: number;
    isAdmin?: boolean;
  }
}

export {};
