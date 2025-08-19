/**
 * Production Monitoring and Logging System for Perry Eden Group
 * Comprehensive monitoring, alerting, and log management
 */

import { NextRequest } from 'next/server';

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

interface LogEntry {
  timestamp: string;
  level: keyof LogLevel;
  message: string;
  meta?: any;
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
}

interface MetricEntry {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  tags?: Record<string, string>;
}

interface AlertConfig {
  enabled: boolean;
  webhookUrl?: string;
  slackChannel?: string;
  emailTo?: string[];
  thresholds: {
    errorRate: number;
    responseTime: number;
    memoryUsage: number;
    diskUsage: number;
  };
}

export class ProductionMonitor {
  private static instance: ProductionMonitor;
  private logs: LogEntry[] = [];
  private metrics: MetricEntry[] = [];
  private alertConfig: AlertConfig;
  private requestMetrics = new Map<string, number>();
  
  constructor() {
    this.alertConfig = {
      enabled: process.env.NODE_ENV === 'production',
      webhookUrl: process.env.MONITORING_WEBHOOK_URL,
      slackChannel: process.env.SLACK_ALERT_CHANNEL,
      emailTo: process.env.ALERT_EMAILS?.split(',') || [],
      thresholds: {
        errorRate: parseFloat(process.env.ERROR_RATE_THRESHOLD || '5'), // 5%
        responseTime: parseInt(process.env.RESPONSE_TIME_THRESHOLD || '2000'), // 2s
        memoryUsage: parseFloat(process.env.MEMORY_USAGE_THRESHOLD || '80'), // 80%
        diskUsage: parseFloat(process.env.DISK_USAGE_THRESHOLD || '85') // 85%
      }
    };
    
    // Start metric collection interval
    if (process.env.NODE_ENV === 'production') {
      this.startMetricCollection();
    }
  }
  
  static getInstance(): ProductionMonitor {
    if (!ProductionMonitor.instance) {
      ProductionMonitor.instance = new ProductionMonitor();
    }
    return ProductionMonitor.instance;
  }
  
  /**
   * Log an entry with structured data
   */
  log(level: keyof LogLevel, message: string, meta?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      requestId: this.generateRequestId()
    };
    
    // Store in memory (in production, send to external service)
    this.logs.push(entry);
    
    // Keep only last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
    
    // Console output with formatting
    this.outputToConsole(entry);
    
    // Send to external services in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalLogging(entry);
    }
    
    // Check for alerts
    if (level === 'ERROR') {
      this.checkErrorRateAlert();
    }
  }
  
  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, unit: string = 'count', tags?: Record<string, string>): void {
    const metric: MetricEntry = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      tags
    };
    
    this.metrics.push(metric);
    
    // Keep only last 10000 metrics in memory
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-10000);
    }
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(metric);
    }
  }
  
  /**
   * Track API request performance
   */
  trackRequest(request: NextRequest, startTime: number, statusCode: number, endTime: number): void {
    const duration = endTime - startTime;
    const path = request.nextUrl.pathname;
    const method = request.method;
    
    // Record metrics
    this.recordMetric('api_request_duration', duration, 'ms', {
      path,
      method,
      status: statusCode.toString()
    });
    
    this.recordMetric('api_request_count', 1, 'count', {
      path,
      method,
      status: statusCode.toString()
    });
    
    // Store for rate calculations
    const key = `${method}:${path}`;
    this.requestMetrics.set(key, (this.requestMetrics.get(key) || 0) + 1);
    
    // Check performance thresholds
    if (duration > this.alertConfig.thresholds.responseTime) {
      this.log('WARN', `Slow API response detected`, {
        path,
        method,
        duration,
        threshold: this.alertConfig.thresholds.responseTime
      });
    }
    
    // Log request details
    this.log('INFO', `API Request: ${method} ${path}`, {
      duration,
      statusCode,
      ip: request.ip,
      userAgent: request.headers.get('user-agent')
    });
  }
  
  /**
   * Get system health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
    metrics: {
      uptime: number;
      memoryUsage: number;
      errorRate: number;
      avgResponseTime: number;
    };
  }> {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();
    const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    
    // Calculate error rate (last hour)
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recentLogs = this.logs.filter(log => log.timestamp > hourAgo);
    const errorLogs = recentLogs.filter(log => log.level === 'ERROR');
    const errorRate = recentLogs.length > 0 ? (errorLogs.length / recentLogs.length) * 100 : 0;
    
    // Calculate average response time
    const recentMetrics = this.metrics.filter(m => 
      m.name === 'api_request_duration' && m.timestamp > hourAgo
    );
    const avgResponseTime = recentMetrics.length > 0 ? 
      recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length : 0;
    
    const checks = {
      uptime: uptime > 60, // At least 1 minute uptime
      memory: memoryUsagePercent < this.alertConfig.thresholds.memoryUsage,
      errorRate: errorRate < this.alertConfig.thresholds.errorRate,
      responseTime: avgResponseTime < this.alertConfig.thresholds.responseTime
    };
    
    const healthyChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyChecks === totalChecks) {
      status = 'healthy';
    } else if (healthyChecks >= totalChecks / 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }
    
    return {
      status,
      checks,
      metrics: {
        uptime,
        memoryUsage: memoryUsagePercent,
        errorRate,
        avgResponseTime
      }
    };
  }
  
  /**
   * Get monitoring dashboard data
   */
  getDashboardData(timeRange: string = '1h'): {
    logs: LogEntry[];
    metrics: MetricEntry[];
    summary: any;
  } {
    const now = new Date();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };
    
    const rangeMs = ranges[timeRange as keyof typeof ranges] || ranges['1h'];
    const cutoff = new Date(now.getTime() - rangeMs).toISOString();
    
    const filteredLogs = this.logs.filter(log => log.timestamp > cutoff);
    const filteredMetrics = this.metrics.filter(metric => metric.timestamp > cutoff);
    
    const summary = {
      totalLogs: filteredLogs.length,
      errorCount: filteredLogs.filter(log => log.level === 'ERROR').length,
      warnCount: filteredLogs.filter(log => log.level === 'WARN').length,
      totalRequests: filteredMetrics.filter(m => m.name === 'api_request_count').length,
      avgResponseTime: this.calculateAverageMetric(filteredMetrics, 'api_request_duration')
    };
    
    return {
      logs: filteredLogs.slice(-100), // Last 100 logs
      metrics: filteredMetrics,
      summary
    };
  }
  
  /**
   * Private helper methods
   */
  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  private outputToConsole(entry: LogEntry): void {
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[36m',  // Cyan
      DEBUG: '\x1b[90m'  // Gray
    };
    
    const reset = '\x1b[0m';
    const color = colors[entry.level] || '';
    
    console.log(`${color}[${entry.timestamp}] ${entry.level}: ${entry.message}${reset}`);
    
    if (entry.meta) {
      console.log(`${color}Meta:${reset}`, JSON.stringify(entry.meta, null, 2));
    }
  }
  
  private async sendToExternalLogging(entry: LogEntry): Promise<void> {
    // In production, send to services like Sentry, LogRocket, etc.
    if (process.env.SENTRY_DSN) {
      // Example: Send to Sentry
      // Sentry.captureMessage(entry.message, entry.level);
    }
  }
  
  private async sendToMonitoringService(metric: MetricEntry): Promise<void> {
    // In production, send to services like New Relic, DataDog, etc.
    if (process.env.NEW_RELIC_LICENSE_KEY) {
      // Example: Send to New Relic
    }
  }
  
  private checkErrorRateAlert(): void {
    // Check if error rate exceeds threshold and send alerts
    if (this.alertConfig.enabled) {
      // Implementation for alerting logic
    }
  }
  
  private startMetricCollection(): void {
    // Collect system metrics every minute
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const memoryPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
      
      this.recordMetric('memory_usage_percent', memoryPercent, 'percent');
      this.recordMetric('memory_heap_used', memUsage.heapUsed, 'bytes');
      this.recordMetric('uptime', process.uptime(), 'seconds');
      
    }, 60000); // Every minute
  }
  
  private calculateAverageMetric(metrics: MetricEntry[], metricName: string): number {
    const filtered = metrics.filter(m => m.name === metricName);
    if (filtered.length === 0) return 0;
    return filtered.reduce((sum, m) => sum + m.value, 0) / filtered.length;
  }
}

/**
 * Express/Next.js middleware for request monitoring
 */
export function createMonitoringMiddleware() {
  const monitor = ProductionMonitor.getInstance();
  
  return function monitoringMiddleware(request: NextRequest) {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      // This would be implemented differently in actual middleware
      // For now, we'll just track the request
      monitor.log('INFO', 'Request started', {
        path: request.nextUrl.pathname,
        method: request.method,
        ip: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent')
      });
      
      resolve(null);
    });
  };
}

/**
 * Global error handler with monitoring
 */
export function handleError(error: Error, context?: any): void {
  const monitor = ProductionMonitor.getInstance();
  
  monitor.log('ERROR', error.message, {
    stack: error.stack,
    context,
    name: error.name
  });
}

// Export singleton instance
export const monitor = ProductionMonitor.getInstance();
export default ProductionMonitor;
