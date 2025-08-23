import { NextRequest, NextResponse } from 'next/server'
import { checkDatabaseHealth, getDatabaseStats } from '@/lib/db-production'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  version: string
  environment: string
  services: {
    database: any
    memory: {
      used: number
      total: number
      percentage: number
    }
    disk: {
      available: boolean
    }
  }
}

function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage()
    return {
      used: Math.round(usage.heapUsed / 1024 / 1024), // MB
      total: Math.round(usage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((usage.heapUsed / usage.heapTotal) * 100)
    }
  }
  return { used: 0, total: 0, percentage: 0 }
}

function getUptimeInSeconds() {
  if (typeof process !== 'undefined' && process.uptime) {
    return Math.floor(process.uptime())
  }
  return 0
}

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check database health
    const dbHealth = await checkDatabaseHealth()
    const dbStats = getDatabaseStats()
    
    // Get system metrics
    const memory = getMemoryUsage()
    const uptime = getUptimeInSeconds()
    
    // Determine overall health status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    
    if (dbHealth.status === 'unhealthy') {
      status = 'unhealthy'
    } else if (memory.percentage > 85) {
      status = 'degraded'
    }
    
    const healthStatus: HealthStatus = {
      status,
      timestamp: new Date().toISOString(),
      uptime,
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          ...dbHealth,
          ...dbStats
        },
        memory,
        disk: {
          available: true // In real production, you'd check actual disk space
        }
      }
    }
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      ...healthStatus,
      responseTime: `${responseTime}ms`
    }, {
      status: status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown health check error',
      environment: process.env.NODE_ENV || 'development'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  }
}
