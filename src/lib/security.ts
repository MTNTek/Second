import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Security Hardening Utilities for Perry Eden Group Application
 * Implements rate limiting, request throttling, and security headers
 */

interface SecurityConfig {
  rateLimitWindowMs: number;
  rateLimitMax: number;
  slowDownWindowMs: number;
  slowDownDelayAfter: number;
  slowDownDelayMs: number;
  corsOrigins: string[];
  csrfSecret: string;
}

const defaultSecurityConfig: SecurityConfig = {
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // requests per window
  slowDownWindowMs: 15 * 60 * 1000, // 15 minutes
  slowDownDelayAfter: 50, // start slowing down after this many requests
  slowDownDelayMs: 500, // delay each request by this many ms
  corsOrigins: [
    'https://perryedengroup.com',
    'https://www.perryedengroup.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  csrfSecret: process.env.CSRF_SECRET || 'your-csrf-secret-change-in-production'
};

/**
 * Advanced rate limiting for API routes
 */
export function createRateLimit(config: Partial<SecurityConfig> = {}) {
  const finalConfig = { ...defaultSecurityConfig, ...config };
  
  return rateLimit({
    windowMs: finalConfig.rateLimitWindowMs,
    max: finalConfig.rateLimitMax,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(finalConfig.rateLimitWindowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(finalConfig.rateLimitWindowMs / 1000)
      });
    },
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.url === '/api/health' || req.url === '/health';
    }
  });
}

/**
 * Request slow down for suspicious activity
 */
export function createSlowDown(config: Partial<SecurityConfig> = {}) {
  const finalConfig = { ...defaultSecurityConfig, ...config };
  
  return slowDown({
    windowMs: finalConfig.slowDownWindowMs,
    delayAfter: finalConfig.slowDownDelayAfter,
    delayMs: finalConfig.slowDownDelayMs,
    maxDelayMs: 5000, // Maximum delay of 5 seconds
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
  });
}

/**
 * CORS configuration for secure cross-origin requests
 */
export function configureCORS(origins: string[] = defaultSecurityConfig.corsOrigins) {
  return {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token'
    ],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
  };
}

/**
 * Security headers middleware for Next.js
 */
export function securityHeaders(request: NextRequest) {
  const response = NextResponse.next();
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval
    "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  // Security Headers
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  );
  
  // HSTS (HTTP Strict Transport Security)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  return response;
}

/**
 * Input validation and sanitization
 */
export class InputValidator {
  static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  static readonly PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;
  static readonly NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;
  
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>\"'&]/g, '');
  }
  
  static validateEmail(email: string): boolean {
    const sanitized = this.sanitizeString(email);
    return this.EMAIL_REGEX.test(sanitized) && sanitized.length <= 254;
  }
  
  static validatePhone(phone: string): boolean {
    const sanitized = phone.replace(/[\s\-\(\)]/g, '');
    return this.PHONE_REGEX.test(sanitized);
  }
  
  static validateName(name: string): boolean {
    const sanitized = this.sanitizeString(name);
    return this.NAME_REGEX.test(sanitized);
  }
  
  static validateRequired(value: any): boolean {
    return value !== null && value !== undefined && String(value).trim().length > 0;
  }
  
  static validateLength(value: string, min: number = 0, max: number = 1000): boolean {
    const length = String(value).length;
    return length >= min && length <= max;
  }
}

/**
 * CSRF Protection utilities
 */
export class CSRFProtection {
  private static secret = defaultSecurityConfig.csrfSecret;
  
  static generateToken(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return Buffer.from(`${timestamp}:${random}:${this.secret}`).toString('base64');
  }
  
  static validateToken(token: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [timestamp, random, secret] = decoded.split(':');
      
      // Check if token is not older than 1 hour
      const tokenAge = Date.now() - parseInt(timestamp);
      const oneHour = 60 * 60 * 1000;
      
      return secret === this.secret && tokenAge < oneHour;
    } catch {
      return false;
    }
  }
}

/**
 * API Request validation middleware
 */
export function validateAPIRequest(request: NextRequest, options: {
  requireCSRF?: boolean;
  allowedMethods?: string[];
  requireAuth?: boolean;
} = {}) {
  const {
    requireCSRF = false,
    allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'],
    requireAuth = false
  } = options;
  
  // Method validation
  if (!allowedMethods.includes(request.method)) {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }
  
  // CSRF validation for state-changing requests
  if (requireCSRF && ['POST', 'PUT', 'DELETE'].includes(request.method)) {
    const csrfToken = request.headers.get('X-CSRF-Token');
    if (!csrfToken || !CSRFProtection.validateToken(csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }
  
  // Authentication validation
  if (requireAuth) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }
  
  return null; // Validation passed
}

/**
 * Security audit logger
 */
export class SecurityLogger {
  static logSecurityEvent(event: {
    type: 'rate_limit' | 'csrf_failure' | 'auth_failure' | 'validation_error';
    ip?: string;
    userAgent?: string;
    url?: string;
    details?: any;
  }) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'SECURITY',
      ...event
    };
    
    // In production, send to proper logging service
    if (process.env.NODE_ENV === 'production') {
      console.error('[SECURITY]', JSON.stringify(logEntry));
      // TODO: Send to external logging service (e.g., Sentry, LogRocket)
    } else {
      console.warn('[SECURITY]', logEntry);
    }
  }
}

export { defaultSecurityConfig };
