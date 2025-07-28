/**
 * Jest setup file for enterprise testing
 * This file runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';
process.env.LOG_PRETTY = 'false';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set up global test timeout
jest.setTimeout(10000);

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidDate(): R;
      toBeValidUUID(): R;
    }
  }
}

// Custom matchers
expect.extend({
  toBeValidDate(received: unknown): jest.CustomMatcherResult {
    const pass = received instanceof Date && !isNaN(received.getTime());
    if (pass) {
      return {
        message: (): string => `expected ${received} not to be a valid date`,
        pass: true,
      };
    } else {
      return {
        message: (): string => `expected ${received} to be a valid date`,
        pass: false,
      };
    }
  },

  toBeValidUUID(received: unknown): jest.CustomMatcherResult {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = typeof received === 'string' && uuidRegex.test(received);

    if (pass) {
      return {
        message: (): string => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: (): string => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },
});

// Mock external dependencies for testing
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    query: jest.fn(),
    release: jest.fn(),
    end: jest.fn(),
  })),
}));

// Cleanup after tests
afterEach((): void => {
  jest.clearAllMocks();
});

afterAll(async (): Promise<void> => {
  // Close any open connections, clean up resources
  await new Promise(resolve => setTimeout(resolve, 500));
});
