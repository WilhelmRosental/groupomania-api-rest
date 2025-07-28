#!/usr/bin/env node

/**
 * Health check script for Groupomania microservices
 * Vérifie l'état de tous les services et de la base de données
 */

import { Client } from 'pg';
import http from 'http';

interface ServiceConfig {
  name: string;
  url: string;
  timeout: number;
}

interface HealthStatus {
  service: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime?: number;
  error?: string;
}

// Configuration des services
const services: ServiceConfig[] = [
  {
    name: 'API Gateway',
    url: `http://localhost:${process.env.API_GATEWAY_PORT ?? '3000'}/health`,
    timeout: 5000
  },
  {
    name: 'User Service',
    url: `http://localhost:${process.env.USER_SERVICE_PORT ?? '3001'}/health`,
    timeout: 5000
  },
  {
    name: 'Post Service',
    url: `http://localhost:${process.env.POST_SERVICE_PORT ?? '3002'}/health`,
    timeout: 5000
  }
];

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_NAME ?? 'groupomania',
  connectionTimeoutMillis: 5000
};

/**
 * Vérifie l'état d'un service HTTP
 */
function checkServiceHealth(service: ServiceConfig): Promise<HealthStatus> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = http.get(service.url, { timeout: service.timeout }, (res) => {
      const responseTime = Date.now() - startTime;
      
      if (res.statusCode === 200) {
        resolve({
          service: service.name,
          status: 'healthy',
          responseTime
        });
      } else {
        resolve({
          service: service.name,
          status: 'unhealthy',
          responseTime,
          error: `HTTP ${res.statusCode ?? 'unknown'}`
        });
      }
    });

    req.on('error', (error) => {
      resolve({
        service: service.name,
        status: 'unhealthy',
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        service: service.name,
        status: 'unhealthy',
        error: 'Request timeout'
      });
    });
  });
}

/**
 * Vérifie l'état de la base de données
 */
async function checkDatabaseHealth(): Promise<HealthStatus> {
  const client = new Client(dbConfig);
  const startTime = Date.now();

  try {
    await client.connect();
    await client.query('SELECT 1');
    const responseTime = Date.now() - startTime;
    
    return {
      service: 'PostgreSQL Database',
      status: 'healthy',
      responseTime
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      service: 'PostgreSQL Database',
      status: 'unhealthy',
      error: errorMessage
    };
  } finally {
    try {
      await client.end();
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Effectue le health check complet
 */
async function performHealthCheck(): Promise<void> {
  console.error('🔍 Groupomania Health Check');
  console.error('================================');
  
  const startTime = Date.now();
  const healthChecks: Promise<HealthStatus>[] = [
    checkDatabaseHealth(),
    ...services.map(service => checkServiceHealth(service))
  ];

  try {
    const results = await Promise.all(healthChecks);
    const totalTime = Date.now() - startTime;
    
    // Afficher les résultats
    let allHealthy = true;
    
    results.forEach(result => {
      const statusIcon = result.status === 'healthy' ? '✅' : '❌';
      const responseInfo = result.responseTime !== undefined ? ` (${result.responseTime}ms)` : '';
      const errorInfo = result.error !== undefined ? ` - ${result.error}` : '';
      
      console.error(`${statusIcon} ${result.service}${responseInfo}${errorInfo}`);
      
      if (result.status !== 'healthy') {
        allHealthy = false;
      }
    });
    
    console.error('================================');
    console.error(`🕐 Total check time: ${totalTime}ms`);
    
    if (allHealthy) {
      console.error('🎉 All services are healthy!');
      process.exit(0);
    } else {
      console.error('⚠️  Some services are unhealthy');
      process.exit(1);
    }
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Health check failed:', errorMessage);
    process.exit(1);
  }
}

// Exécuter le health check
if (require.main === module) {
  performHealthCheck();
}

export { performHealthCheck, checkServiceHealth, checkDatabaseHealth };
