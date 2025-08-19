/**
 * SSL/HTTPS Configuration Module for Perry Eden Group
 * Handles SSL certificate management and HTTPS enforcement
 */

import fs from 'fs';
import https from 'https';
import { NextRequest, NextResponse } from 'next/server';

interface SSLConfig {
  certPath?: string;
  keyPath?: string;
  forceHTTPS?: boolean;
  hstsMaxAge?: number;
  includeSubdomains?: boolean;
  preload?: boolean;
}

export class SSLManager {
  private config: SSLConfig;
  
  constructor(config: SSLConfig = {}) {
    this.config = {
      certPath: process.env.SSL_CERT_PATH,
      keyPath: process.env.SSL_KEY_PATH,
      forceHTTPS: process.env.NODE_ENV === 'production',
      hstsMaxAge: 31536000, // 1 year
      includeSubdomains: true,
      preload: true,
      ...config
    };
  }
  
  /**
   * Create HTTPS server with SSL certificates
   */
  createHTTPSServer(app: any): https.Server | null {
    try {
      if (!this.config.certPath || !this.config.keyPath) {
        console.warn('⚠️ SSL certificates not configured. Using HTTP only.');
        return null;
      }
      
      const cert = fs.readFileSync(this.config.certPath);
      const key = fs.readFileSync(this.config.keyPath);
      
      const httpsServer = https.createServer({ cert, key }, app);
      
      console.log('✅ HTTPS server configured with SSL certificates');
      return httpsServer;
      
    } catch (error) {
      console.error('❌ Failed to create HTTPS server:', error);
      return null;
    }
  }
  
  /**
   * Middleware to enforce HTTPS in production
   */
  enforceHTTPS(request: NextRequest): NextResponse | null {
    if (!this.config.forceHTTPS) {
      return null;
    }
    
    const protocol = request.headers.get('x-forwarded-proto') || 
                    request.nextUrl.protocol;
    
    if (protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      const httpsUrl = request.nextUrl.clone();
      httpsUrl.protocol = 'https:';
      
      return NextResponse.redirect(httpsUrl, 301);
    }
    
    return null;
  }
  
  /**
   * Add HSTS headers for enhanced security
   */
  addHSTSHeaders(response: NextResponse): NextResponse {
    if (process.env.NODE_ENV === 'production') {
      const hstsValue = [
        `max-age=${this.config.hstsMaxAge}`,
        this.config.includeSubdomains ? 'includeSubDomains' : '',
        this.config.preload ? 'preload' : ''
      ].filter(Boolean).join('; ');
      
      response.headers.set('Strict-Transport-Security', hstsValue);
    }
    
    return response;
  }
  
  /**
   * Validate SSL certificate
   */
  async validateCertificate(): Promise<{
    valid: boolean;
    expiryDate?: Date;
    issuer?: string;
    error?: string;
  }> {
    try {
      if (!this.config.certPath) {
        return { valid: false, error: 'Certificate path not configured' };
      }
      
      const cert = fs.readFileSync(this.config.certPath, 'utf8');
      
      // Basic certificate validation
      if (!cert.includes('BEGIN CERTIFICATE')) {
        return { valid: false, error: 'Invalid certificate format' };
      }
      
      console.log('✅ SSL certificate validation passed');
      return { valid: true };
      
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

/**
 * Production SSL middleware for Next.js
 */
export function createSSLMiddleware(config?: SSLConfig) {
  const sslManager = new SSLManager(config);
  
  return function sslMiddleware(request: NextRequest) {
    // Enforce HTTPS redirect
    const httpsRedirect = sslManager.enforceHTTPS(request);
    if (httpsRedirect) {
      return httpsRedirect;
    }
    
    // Continue with normal processing
    const response = NextResponse.next();
    
    // Add HSTS headers
    return sslManager.addHSTSHeaders(response);
  };
}

/**
 * SSL health check utility
 */
export async function sslHealthCheck(): Promise<{
  https: boolean;
  certificate: boolean;
  hsts: boolean;
  details: any;
}> {
  const sslManager = new SSLManager();
  
  try {
    const certValidation = await sslManager.validateCertificate();
    
    return {
      https: process.env.NODE_ENV === 'production' ? 
        !!process.env.SSL_CERT_PATH : true,
      certificate: certValidation.valid,
      hsts: process.env.NODE_ENV === 'production',
      details: {
        environment: process.env.NODE_ENV,
        certPath: !!process.env.SSL_CERT_PATH,
        keyPath: !!process.env.SSL_KEY_PATH,
        validation: certValidation
      }
    };
    
  } catch (error) {
    return {
      https: false,
      certificate: false,
      hsts: false,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

export default SSLManager;
