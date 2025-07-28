#!/usr/bin/env node

/**
 * Health check script for Groupomania microservices
 * Vérifie l'état de tous les services et de la base de données
 */

import { Client } from 'pg';
import http from 'http';
// Configuration simplifiée pour les scripts
const config = {
  API_GATEWAY_PORT: parseInt(process.env.API_GATEWAY_PORT || '3000'),
  USER_SERVICE_PORT: parseInt(process.env.USER_SERVICE_PORT || '3001'),
  POST_SERVICE_PORT: parseInt(process.env.POST_SERVICE_PORT || '3002')
};

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

interface ServiceCheck {
  name: string;
  url: string;
  port: number;
}

// Configuration des services
const services: ServiceConfig[] = [
  {
    name: 'API Gateway',
    url: `http://localhost:${process.env.API_GATEWAY_PORT || '3000'}/health`,
    timeout: 5000
  },
  {
    name: 'User Service',
    url: `http://localhost:${process.env.USER_SERVICE_PORT || '3001'}/health`,
    timeout: 5000
  },
  {
    name: 'Post Service',
    url: `http://localhost:${process.env.POST_SERVICE_PORT || '3002'}/health`,
    timeout: 5000
  }
];

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'groupomania',
  connectionTimeoutMillis: 5000
};

/**
 * Vérifie l'état d'un service HTTP
 */
async function checkServiceHealth(service: ServiceConfig): Promise<HealthStatus> {
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
          error: `HTTP ${res.statusCode}`
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
  } catch (error: any) {
    return {
      service: 'PostgreSQL Database',
      status: 'unhealthy',
      error: error.message
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
  console.log('🔍 Groupomania Health Check');
  console.log('================================');
  
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
      const responseInfo = result.responseTime ? ` (${result.responseTime}ms)` : '';
      const errorInfo = result.error ? ` - ${result.error}` : '';
      
      console.log(`${statusIcon} ${result.service}${responseInfo}${errorInfo}`);
      
      if (result.status !== 'healthy') {
        allHealthy = false;
      }
    });
    
    console.log('================================');
    console.log(`🕐 Total check time: ${totalTime}ms`);
    
    if (allHealthy) {
      console.log('🎉 All services are healthy!');
      process.exit(0);
    } else {
      console.log('⚠️  Some services are unhealthy');
      process.exit(1);
    }
    
  } catch (error: any) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

// Exécuter le health check
if (require.main === module) {
  performHealthCheck();
}

export { performHealthCheck, checkServiceHealth, checkDatabaseHealth };
