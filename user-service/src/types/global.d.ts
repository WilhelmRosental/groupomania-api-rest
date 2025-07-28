// Global type augmentations
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production';
      USER_SERVICE_PORT?: string;
      HOST?: string;
      USER_DB_NAME?: string;
      USER_DB_USER?: string;
      USER_DB_PASSWORD?: string;
      USER_DB_HOST?: string;
      USER_DB_PORT?: string;
      JWT_SECRET?: string;
    }
  }
}

// Fastify module augmentation
declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
    isAdmin?: boolean;
  }
}

export {};
