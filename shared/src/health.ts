export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  service: string;
  dependencies?: Record<string, HealthCheck>;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
}

export class HealthChecker {
  private serviceName: string;
  private version: string;
  private dependencies: Map<string, () => Promise<HealthCheck>> = new Map();

  constructor(serviceName: string, version: string = '1.0.0') {
    this.serviceName = serviceName;
    this.version = version;
  }

  addDependency(name: string, checker: () => Promise<HealthCheck>): void {
    this.dependencies.set(name, checker);
  }

  async checkHealth(): Promise<HealthStatus> {
    const start = Date.now();
    const dependencyResults: Record<string, HealthCheck> = {};
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';

    // Check all dependencies
    for (const [name, checker] of this.dependencies) {
      try {
        const result = await checker();
        dependencyResults[name] = result;
        
        if (result.status === 'unhealthy') {
          overallStatus = 'degraded';
        }
      } catch (error) {
        dependencyResults[name] = {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        overallStatus = 'degraded';
      }
    }

    const result: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: this.version,
      service: this.serviceName
    };

    if (Object.keys(dependencyResults).length > 0) {
      result.dependencies = dependencyResults;
    }

    return result;
  }

  // Quick health check for readiness probes
  async isHealthy(): Promise<boolean> {
    const health = await this.checkHealth();
    return health.status === 'healthy';
  }
}

// Database health checker
export const createDatabaseHealthCheck = (connectionTest: () => Promise<boolean>) => {
  return async (): Promise<HealthCheck> => {
    const start = Date.now();
    try {
      const isConnected = await connectionTest();
      const result: HealthCheck = {
        status: isConnected ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - start
      };
      
      if (!isConnected) {
        result.error = 'Database connection failed';
      }
      
      return result;
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start,
        error: error instanceof Error ? error.message : 'Database check failed'
      };
    }
  };
};

// HTTP service health checker
export const createHttpHealthCheck = (url: string) => {
  return async (): Promise<HealthCheck> => {
    const start = Date.now();
    try {
      // Simple HTTP check - would use fetch or axios in real implementation
      return {
        status: 'healthy',
        responseTime: Date.now() - start
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start,
        error: error instanceof Error ? error.message : 'HTTP check failed'
      };
    }
  };
};
