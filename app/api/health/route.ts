import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../src/lib/db';
import { contactSubmissions } from '../../../src/lib/schema';
import { monitor } from '../../../src/lib/monitoring';
import { sslHealthCheck } from '../../../src/lib/ssl-config';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get health status from monitoring system
    const healthStatus = await monitor.getHealthStatus();
    
    // Test database connection by running a simple query
    let databaseHealth: { healthy: boolean; latency: number; error: string | null } = { healthy: true, latency: 0, error: null };
    try {
      const dbStartTime = Date.now();
      await db.select().from(contactSubmissions).limit(1);
      databaseHealth.latency = Date.now() - dbStartTime;
    } catch (error) {
      databaseHealth = {
        healthy: false,
        latency: 0,
        error: error instanceof Error ? error.message : 'Database connection failed'
      };
    }
    
    // Check SSL/HTTPS configuration
    const sslHealth = await sslHealthCheck();
    
    // Calculate overall health score
    const checks = [
      healthStatus.status === 'healthy',
      databaseHealth.healthy,
      sslHealth.https
    ];
    
    const healthyCount = checks.filter(Boolean).length;
    const totalChecks = checks.length;
    const healthScore = Math.round((healthyCount / totalChecks) * 100);
    
    const overallStatus = healthScore >= 90 ? 'healthy' : 
                         healthScore >= 70 ? 'degraded' : 'unhealthy';
    
    const responseTime = Date.now() - startTime;
    
    const health = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      uptime: process.uptime(),
      responseTime,
      healthScore,
      
      services: {
        api: databaseHealth.healthy ? 'operational' : 'degraded',
        database: databaseHealth.healthy ? 'operational' : 'offline',
        authentication: 'operational',
        monitoring: healthStatus.status,
        ssl: sslHealth.https ? 'configured' : 'not_configured'
      },
      
      details: {
        database: {
          status: databaseHealth.healthy ? 'connected' : 'disconnected',
          latency: databaseHealth.latency,
          error: databaseHealth.error
        },
        application: {
          memoryUsage: healthStatus.metrics.memoryUsage,
          errorRate: healthStatus.metrics.errorRate,
          avgResponseTime: healthStatus.metrics.avgResponseTime
        },
        ssl: {
          certificate: sslHealth.certificate,
          hsts: sslHealth.hsts
        }
      }
    };

    // Log health check
    monitor.log('INFO', 'Health check completed', {
      status: overallStatus,
      healthScore,
      responseTime
    });
    
    // Record metrics
    monitor.recordMetric('health_check_duration', responseTime, 'ms');
    monitor.recordMetric('health_score', healthScore, 'percent');

    return NextResponse.json(health, { 
      status: overallStatus === 'unhealthy' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    const health = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        api: 'operational',
        database: 'error',
        authentication: 'unknown'
      }
    };

    return NextResponse.json(health, { status: 503 });
  }
}
