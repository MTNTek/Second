'use client';

import { useEffect } from 'react';

// Web Vitals types
interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  entries: PerformanceEntry[];
}

// Performance thresholds based on Google's Core Web Vitals
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

function sendToAnalytics(metric: Metric) {
  // In production, you would send this to your analytics service
  // For now, we'll log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      id: metric.id,
    });
  }

  // Example: Send to Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.rating,
    });
  }

  // Example: Send to your own analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        url: window.location.href,
        timestamp: Date.now(),
      }),
    }).catch(console.error);
  }
}

export function WebVitals() {
  useEffect(() => {
    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
      onINP(sendToAnalytics);
    });
  }, []);

  // This component doesn't render anything
  return null;
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Monitor navigation timing
    if (typeof window !== 'undefined' && window.performance) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const nav = entry as PerformanceNavigationTiming;
            console.log('📈 Navigation Timing:', {
              domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
              loadComplete: Math.round(nav.loadEventEnd - nav.startTime),
              domainLookup: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
              serverResponse: Math.round(nav.responseEnd - nav.requestStart),
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });

      return () => observer.disconnect();
    }
  }, []);

  // Monitor resource loading
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const slowResources = resources.filter(resource => resource.duration > 1000);
      
      if (slowResources.length > 0) {
        console.warn('⚠️ Slow Resources Detected:', slowResources.map(r => ({
          name: r.name,
          duration: Math.round(r.duration),
          size: r.transferSize,
        })));
      }
    }
  }, []);
}

export default WebVitals;
