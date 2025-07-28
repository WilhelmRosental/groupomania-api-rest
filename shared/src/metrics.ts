// Simple metrics system for enterprise monitoring
export interface Metrics {
  requests: {
    total: number;
    success: number;
    errors: number;
  };
  performance: {
    avgResponseTime: number;
    maxResponseTime: number;
  };
  health: {
    uptime: number;
    memory: NodeJS.MemoryUsage;
  };
}

class MetricsCollector {
  private metrics: Metrics = {
    requests: {
      total: 0,
      success: 0,
      errors: 0
    },
    performance: {
      avgResponseTime: 0,
      maxResponseTime: 0
    },
    health: {
      uptime: 0,
      memory: process.memoryUsage()
    }
  };

  private responseTimes: number[] = [];

  incrementRequests(success: boolean = true): void {
    this.metrics.requests.total++;
    if (success) {
      this.metrics.requests.success++;
    } else {
      this.metrics.requests.errors++;
    }
  }

  recordResponseTime(time: number): void {
    this.responseTimes.push(time);
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift(); // Keep only last 100 measurements
    }
    
    this.metrics.performance.avgResponseTime = 
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    
    this.metrics.performance.maxResponseTime = Math.max(
      this.metrics.performance.maxResponseTime,
      time
    );
  }

  updateHealth(): void {
    this.metrics.health.uptime = process.uptime();
    this.metrics.health.memory = process.memoryUsage();
  }

  getMetrics(): Metrics {
    this.updateHealth();
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      requests: { total: 0, success: 0, errors: 0 },
      performance: { avgResponseTime: 0, maxResponseTime: 0 },
      health: { uptime: 0, memory: process.memoryUsage() }
    };
    this.responseTimes = [];
  }
}

export const metricsCollector = new MetricsCollector();

// Middleware function for Fastify
export const metricsMiddleware = (request: unknown, reply: { statusCode: number; addHook: (event: string, handler: () => void) => void }): void => {
  const start = Date.now();
  
  reply.addHook('onSend', () => {
    const responseTime = Date.now() - start;
    const success = reply.statusCode < 400;
    
    metricsCollector.incrementRequests(success);
    metricsCollector.recordResponseTime(responseTime);
  });
};
