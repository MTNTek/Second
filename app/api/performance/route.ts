import { NextRequest, NextResponse } from 'next/server'

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

interface PerformanceReport {
  timestamp: string
  url: string
  userAgent: string
  metrics: PerformanceMetric[]
  connection?: {
    effectiveType?: string
    downlink?: number
    rtt?: number
  }
}

// Core Web Vitals thresholds
const thresholds = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }  // Time to First Byte
}

function getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = thresholds[metricName as keyof typeof thresholds]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// In-memory storage for demo (use Redis/Database in production)
const performanceData: PerformanceReport[] = []
const MAX_STORED_REPORTS = 1000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metrics, url, connection } = body
    
    if (!metrics || !Array.isArray(metrics)) {
      return NextResponse.json({ error: 'Invalid metrics data' }, { status: 400 })
    }
    
    // Process and validate metrics
    const processedMetrics: PerformanceMetric[] = metrics.map((metric: any) => ({
      name: metric.name,
      value: parseFloat(metric.value) || 0,
      rating: getRating(metric.name, parseFloat(metric.value) || 0),
      timestamp: Date.now()
    }))
    
    const report: PerformanceReport = {
      timestamp: new Date().toISOString(),
      url: url || request.url,
      userAgent: request.headers.get('user-agent') || 'unknown',
      metrics: processedMetrics,
      connection: connection || {}
    }
    
    // Store the report (remove oldest if at capacity)
    performanceData.push(report)
    if (performanceData.length > MAX_STORED_REPORTS) {
      performanceData.shift()
    }
    
    // Log poor performance
    const poorMetrics = processedMetrics.filter(m => m.rating === 'poor')
    if (poorMetrics.length > 0) {
      console.warn('Poor performance detected:', {
        url: report.url,
        poorMetrics: poorMetrics.map(m => `${m.name}: ${m.value}`)
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      processed: processedMetrics.length,
      timestamp: report.timestamp
    })
    
  } catch (error) {
    console.error('Performance tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to process performance data' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const metric = searchParams.get('metric')
    
    // Filter and limit data
    let data = performanceData.slice(-limit)
    
    if (metric) {
      data = data.map(report => ({
        ...report,
        metrics: report.metrics.filter(m => m.name === metric)
      })).filter(report => report.metrics.length > 0)
    }
    
    // Calculate summary statistics
    const summary = calculatePerformanceSummary(performanceData)
    
    return NextResponse.json({
      summary,
      reports: data,
      totalReports: performanceData.length,
      lastUpdated: performanceData.length > 0 ? performanceData[performanceData.length - 1].timestamp : null
    })
    
  } catch (error) {
    console.error('Performance data retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve performance data' }, 
      { status: 500 }
    )
  }
}

function calculatePerformanceSummary(data: PerformanceReport[]) {
  if (data.length === 0) {
    return {
      totalReports: 0,
      averageMetrics: {},
      ratingDistribution: {}
    }
  }
  
  const metricSums: Record<string, number[]> = {}
  const ratingCounts: Record<string, Record<string, number>> = {}
  
  data.forEach(report => {
    report.metrics.forEach(metric => {
      if (!metricSums[metric.name]) {
        metricSums[metric.name] = []
        ratingCounts[metric.name] = { good: 0, 'needs-improvement': 0, poor: 0 }
      }
      metricSums[metric.name].push(metric.value)
      ratingCounts[metric.name][metric.rating]++
    })
  })
  
  const averageMetrics: Record<string, number> = {}
  Object.keys(metricSums).forEach(metricName => {
    const values = metricSums[metricName]
    averageMetrics[metricName] = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  })
  
  return {
    totalReports: data.length,
    averageMetrics,
    ratingDistribution: ratingCounts,
    timeRange: {
      start: data[0]?.timestamp,
      end: data[data.length - 1]?.timestamp
    }
  }
}