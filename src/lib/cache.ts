// Simple in-memory cache for API responses
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
  
  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

// Create singleton instance
export const apiCache = new APICache();

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 5 * 60 * 1000);
}

// Cache utilities
export function createCacheKey(url: string, params?: any): string {
  const baseKey = url.replace(/^\/api\//, '');
  return params ? `${baseKey}:${JSON.stringify(params)}` : baseKey;
}

export function getCachedResponse(key: string) {
  return apiCache.get(key);
}

export function setCachedResponse(key: string, data: any, ttl?: number) {
  apiCache.set(key, data, ttl);
}

// Response cache middleware for API routes
export function withCache(handler: any, ttl?: number) {
  return async (request: Request) => {
    const url = new URL(request.url);
    const cacheKey = createCacheKey(url.pathname, url.searchParams.toString());
    
    // Only cache GET requests
    if (request.method === 'GET') {
      const cached = getCachedResponse(cacheKey);
      if (cached) {
        return new Response(JSON.stringify(cached), {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
          },
        });
      }
    }
    
    const response = await handler(request);
    
    // Cache successful responses
    if (request.method === 'GET' && response.ok) {
      const data = await response.clone().json();
      setCachedResponse(cacheKey, data, ttl);
    }
    
    return response;
  };
}

export default apiCache;
