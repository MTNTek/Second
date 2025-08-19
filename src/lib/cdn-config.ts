/**
 * CDN Configuration and Asset Optimization for Perry Eden Group
 * Handles content delivery network setup and static asset optimization
 */

interface CDNConfig {
  enabled: boolean;
  provider: 'cloudflare' | 'aws-cloudfront' | 'custom';
  baseUrl: string;
  staticPaths: string[];
  cacheSettings: {
    images: number;
    css: number;
    js: number;
    fonts: number;
    documents: number;
  };
}

interface AssetOptimization {
  images: {
    formats: string[];
    quality: number;
    sizes: number[];
    lazy: boolean;
  };
  css: {
    minify: boolean;
    purge: boolean;
    critical: boolean;
  };
  js: {
    minify: boolean;
    treeshake: boolean;
    splitChunks: boolean;
  };
}

export class CDNManager {
  private config: CDNConfig;
  private optimization: AssetOptimization;
  
  constructor() {
    this.config = {
      enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_CDN_URL,
      provider: (process.env.CDN_PROVIDER as any) || 'cloudflare',
      baseUrl: process.env.NEXT_PUBLIC_CDN_URL || '',
      staticPaths: [
        '/images',
        '/icons',
        '/documents',
        '/_next/static'
      ],
      cacheSettings: {
        images: 31536000, // 1 year
        css: 31536000,    // 1 year
        js: 31536000,     // 1 year
        fonts: 31536000,  // 1 year
        documents: 86400  // 1 day
      }
    };
    
    this.optimization = {
      images: {
        formats: ['webp', 'avif', 'jpg', 'png'],
        quality: 85,
        sizes: [320, 640, 1024, 1920],
        lazy: true
      },
      css: {
        minify: true,
        purge: true,
        critical: true
      },
      js: {
        minify: true,
        treeshake: true,
        splitChunks: true
      }
    };
  }
  
  /**
   * Get optimized URL for static assets
   */
  getAssetUrl(path: string): string {
    if (!this.config.enabled) {
      return path;
    }
    
    // Check if path should use CDN
    const shouldUseCDN = this.config.staticPaths.some(staticPath => 
      path.startsWith(staticPath)
    );
    
    if (shouldUseCDN) {
      return `${this.config.baseUrl}${path}`;
    }
    
    return path;
  }
  
  /**
   * Generate responsive image URLs
   */
  getResponsiveImageUrls(imagePath: string): {
    src: string;
    srcSet: string;
    sizes: string;
  } {
    const baseUrl = this.getAssetUrl(imagePath);
    
    if (!this.config.enabled) {
      return {
        src: baseUrl,
        srcSet: baseUrl,
        sizes: '100vw'
      };
    }
    
    // Generate srcSet for different sizes
    const srcSet = this.optimization.images.sizes
      .map(size => `${baseUrl}?w=${size}&q=${this.optimization.images.quality} ${size}w`)
      .join(', ');
    
    // Generate sizes attribute
    const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    
    return {
      src: `${baseUrl}?w=1024&q=${this.optimization.images.quality}`,
      srcSet,
      sizes
    };
  }
  
  /**
   * Get cache headers for different asset types
   */
  getCacheHeaders(assetType: keyof CDNConfig['cacheSettings']): Record<string, string> {
    const maxAge = this.config.cacheSettings[assetType];
    
    return {
      'Cache-Control': `public, max-age=${maxAge}, immutable`,
      'Expires': new Date(Date.now() + maxAge * 1000).toUTCString(),
      'ETag': `"${Date.now()}"`,
      'Last-Modified': new Date().toUTCString()
    };
  }
  
  /**
   * Generate preload hints for critical assets
   */
  generatePreloadHints(): string[] {
    const preloads = [];
    
    // Critical CSS
    if (this.optimization.css.critical) {
      preloads.push('<link rel="preload" href="/styles/critical.css" as="style">');
    }
    
    // Important fonts
    const fonts = [
      '/fonts/inter.woff2',
      '/fonts/inter-bold.woff2'
    ];
    
    fonts.forEach(font => {
      const url = this.getAssetUrl(font);
      preloads.push(`<link rel="preload" href="${url}" as="font" type="font/woff2" crossorigin>`);
    });
    
    // Critical JavaScript
    preloads.push('<link rel="preload" href="/_next/static/chunks/framework.js" as="script">');
    
    return preloads;
  }
  
  /**
   * Get Next.js image optimization config
   */
  getNextImageConfig(): any {
    return {
      domains: this.config.enabled ? [
        new URL(this.config.baseUrl).hostname
      ] : [],
      formats: this.optimization.images.formats,
      deviceSizes: this.optimization.images.sizes,
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      quality: this.optimization.images.quality,
      minimumCacheTTL: this.config.cacheSettings.images,
      dangerouslyAllowSVG: false,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
    };
  }
  
  /**
   * Generate service worker cache strategies
   */
  generateCacheStrategies(): any[] {
    return [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: this.config.cacheSettings.fonts
          }
        }
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: this.config.cacheSettings.images
          }
        }
      },
      {
        urlPattern: /\.(?:css|js)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-resources-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: this.config.cacheSettings.css
          }
        }
      }
    ];
  }
  
  /**
   * Get CDN configuration status
   */
  getStatus(): {
    enabled: boolean;
    provider: string;
    baseUrl: string;
    optimizations: string[];
    health: 'healthy' | 'degraded' | 'unhealthy';
  } {
    const optimizations = [];
    
    if (this.optimization.images.lazy) optimizations.push('Image lazy loading');
    if (this.optimization.css.minify) optimizations.push('CSS minification');
    if (this.optimization.js.minify) optimizations.push('JS minification');
    if (this.optimization.css.purge) optimizations.push('CSS purging');
    if (this.optimization.js.treeshake) optimizations.push('JS tree shaking');
    
    let health: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (!this.config.enabled && process.env.NODE_ENV === 'production') {
      health = 'degraded'; // CDN should be enabled in production
    }
    
    return {
      enabled: this.config.enabled,
      provider: this.config.provider,
      baseUrl: this.config.baseUrl,
      optimizations,
      health
    };
  }
  
  /**
   * Purge CDN cache (provider-specific implementation needed)
   */
  async purgeCache(paths?: string[]): Promise<boolean> {
    if (!this.config.enabled) {
      return true;
    }
    
    try {
      switch (this.config.provider) {
        case 'cloudflare':
          return await this.purgeCloudflareCache(paths);
        case 'aws-cloudfront':
          return await this.purgeCloudFrontCache(paths);
        default:
          console.warn('CDN cache purge not implemented for provider:', this.config.provider);
          return false;
      }
    } catch (error) {
      console.error('CDN cache purge failed:', error);
      return false;
    }
  }
  
  private async purgeCloudflareCache(paths?: string[]): Promise<boolean> {
    // Implementation would use Cloudflare API
    console.log('Cloudflare cache purge requested for paths:', paths);
    return true;
  }
  
  private async purgeCloudFrontCache(paths?: string[]): Promise<boolean> {
    // Implementation would use AWS CloudFront API
    console.log('CloudFront cache purge requested for paths:', paths);
    return true;
  }
}

/**
 * Next.js image loader for CDN
 */
export function cdnImageLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const cdnManager = new CDNManager();
  const baseUrl = cdnManager.getAssetUrl(src);
  
  if (!baseUrl.includes('?')) {
    return `${baseUrl}?w=${width}&q=${quality || 85}`;
  }
  
  return `${baseUrl}&w=${width}&q=${quality || 85}`;
}

/**
 * Generate static asset manifest for deployment
 */
export function generateAssetManifest(): {
  images: string[];
  styles: string[];
  scripts: string[];
  fonts: string[];
} {
  // This would scan the build output and generate a manifest
  return {
    images: [
      '/company_logo_transparent.png',
      '/favicon.ico'
    ],
    styles: [
      '/_next/static/css/app.css'
    ],
    scripts: [
      '/_next/static/chunks/main.js',
      '/_next/static/chunks/pages/_app.js'
    ],
    fonts: [
      '/fonts/inter.woff2'
    ]
  };
}

// Export singleton instance
export const cdnManager = new CDNManager();
export default CDNManager;
