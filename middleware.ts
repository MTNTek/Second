import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting storage (in production, use Redis)
const rateLimit = new Map()

interface RateLimitInfo {
  count: number
  resetTime: number
}

function getRateLimitKey(req: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
  return ip
}

function checkRateLimit(key: string, limit: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const rateLimitInfo = rateLimit.get(key) as RateLimitInfo | undefined

  if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
    // Reset or create new rate limit info
    rateLimit.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (rateLimitInfo.count >= limit) {
    return false
  }

  rateLimitInfo.count++
  return true
}

function isBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i
  ]
  return botPatterns.some(pattern => pattern.test(userAgent))
}

function detectSQLInjection(value: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(--|#|\/\*|\*\/)/g,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /'.*?'/g
  ]
  return sqlPatterns.some(pattern => pattern.test(value))
}

function detectXSS(value: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ]
  return xssPatterns.some(pattern => pattern.test(value))
}

function validateRequest(req: NextRequest): { isValid: boolean; reason?: string } {
  const url = new URL(req.url)
  const searchParams = url.searchParams
  
  // Check for malicious patterns in URL parameters
  const paramEntries = Array.from(searchParams.entries());
  for (const [key, value] of paramEntries) {
    if (detectSQLInjection(value)) {
      return { isValid: false, reason: 'SQL injection attempt detected' }
    }
    if (detectXSS(value)) {
      return { isValid: false, reason: 'XSS attempt detected' }
    }
  }

  // Check request size (prevent DoS)
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    return { isValid: false, reason: 'Request too large' }
  }

  return { isValid: true }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''
  
  // Security validation
  const validation = validateRequest(request)
  if (!validation.isValid) {
    console.warn(`Security violation: ${validation.reason} - IP: ${getRateLimitKey(request)}`)
    return new NextResponse('Bad Request', { status: 400 })
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitKey = getRateLimitKey(request)
    const isAllowed = checkRateLimit(rateLimitKey, 100, 15 * 60 * 1000) // 100 requests per 15 minutes
    
    if (!isAllowed) {
      console.warn(`Rate limit exceeded for IP: ${rateLimitKey}`)
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': '900' // 15 minutes
        }
      })
    }
  }

  // Bot detection and handling
  if (isBot(userAgent) && pathname.startsWith('/api/')) {
    // Allow legitimate bots but with stricter rate limiting
    const rateLimitKey = `bot_${getRateLimitKey(request)}`
    const isAllowed = checkRateLimit(rateLimitKey, 10, 60 * 1000) // 10 requests per minute for bots
    
    if (!isAllowed) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  // Add security headers to response
  const response = NextResponse.next()
  
  // CSRF protection for state-changing operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    
    if (origin && !origin.includes(host || '')) {
      console.warn(`CSRF attempt detected - Origin: ${origin}, Host: ${host}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // Add additional security headers
  response.headers.set('X-Request-ID', `req_${Date.now()}_${Math.random().toString(36).slice(2)}`)
  response.headers.set('X-Rate-Limit-Remaining', '100') // Would be dynamic in real implementation
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}