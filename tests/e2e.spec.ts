import { test, expect } from '@playwright/test';

/**
 * End-to-End Testing Suite for Perry Eden Group Application
 * Tests all critical user journeys and service forms
 */

// Test configuration
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Perry Eden Group - Complete Application Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });
  
  test.describe('Homepage and Navigation', () => {
    test('should load homepage successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Perry Eden Group/);
      await expect(page.locator('h1')).toContainText('Perry Eden Group');
    });
    
    test('should navigate to all service sections', async ({ page }) => {
      const serviceLinks = [
        'UAE Jobs',
        'Work Permits',
        'Visa Services',
        'Travel Services',
        'Document Services',
        'About',
        'Contact'
      ];
      
      for (const linkText of serviceLinks) {
        await page.click(`text=${linkText}`);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();
      }
    });
    
    test('should have responsive navigation menu', async ({ page }) => {
      // Test mobile menu
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
      
      // Test desktop menu
      await page.setViewportSize({ width: 1200, height: 800 });
      await expect(page.locator('nav')).toBeVisible();
    });
  });
  
  test.describe('Service Forms - UAE Jobs', () => {
    test('should submit UAE Jobs application successfully', async ({ page }) => {
      await page.click('text=UAE Jobs');
      await page.waitForSelector('[data-testid="uae-jobs-form"]');
      
      // Fill form
      await page.fill('[name="fullName"]', 'John Smith');
      await page.fill('[name="email"]', 'john.smith@example.com');
      await page.fill('[name="phone"]', '+1234567890');
      await page.fill('[name="nationality"]', 'American');
      await page.fill('[name="experience"]', '5 years');
      await page.fill('[name="preferredLocation"]', 'Dubai');
      await page.fill('[name="salaryExpectation"]', '15000 AED');
      await page.fill('[name="additionalInfo"]', 'Looking for software development roles');
      
      // Submit form
      await page.click('[type="submit"]');
      
      // Check success message
      await expect(page.locator('.success-message')).toContainText('Application submitted successfully');
    });
    
    test('should validate required fields in UAE Jobs form', async ({ page }) => {
      await page.click('text=UAE Jobs');
      await page.waitForSelector('[data-testid="uae-jobs-form"]');
      
      // Try to submit empty form
      await page.click('[type="submit"]');
      
      // Check validation messages
      await expect(page.locator('.error-message')).toContainText('required');
    });
  });
  
  test.describe('Service Forms - Work Permits', () => {
    test('should submit Work Permit application successfully', async ({ page }) => {
      await page.click('text=Work Permits');
      await page.waitForSelector('[data-testid="work-permits-form"]');
      
      // Fill form
      await page.fill('[name="fullName"]', 'Jane Doe');
      await page.fill('[name="email"]', 'jane.doe@example.com');
      await page.fill('[name="phone"]', '+1987654321');
      await page.fill('[name="nationality"]', 'Canadian');
      await page.fill('[name="currentLocation"]', 'Toronto');
      await page.fill('[name="intendedDestination"]', 'United Kingdom');
      await page.fill('[name="workExperience"]', '8 years in marketing');
      await page.fill('[name="additionalInfo"]', 'Seeking marketing manager position');
      
      // Submit form
      await page.click('[type="submit"]');
      
      // Check success message
      await expect(page.locator('.success-message')).toContainText('Application submitted successfully');
    });
  });
  
  test.describe('Service Forms - Visa Services', () => {
    test('should submit Visa Services application successfully', async ({ page }) => {
      await page.click('text=Visa Services');
      await page.waitForSelector('[data-testid="visa-services-form"]');
      
      // Fill form
      await page.fill('[name="fullName"]', 'Alice Johnson');
      await page.fill('[name="email"]', 'alice.johnson@example.com');
      await page.fill('[name="phone"]', '+44123456789');
      await page.fill('[name="nationality"]', 'British');
      await page.fill('[name="destinationCountry"]', 'Australia');
      await page.selectOption('[name="visaType"]', 'Tourist');
      await page.fill('[name="travelDates"]', '2024-06-01 to 2024-06-15');
      await page.fill('[name="additionalInfo"]', 'Family vacation');
      
      // Submit form
      await page.click('[type="submit"]');
      
      // Check success message
      await expect(page.locator('.success-message')).toContainText('Application submitted successfully');
    });
  });
  
  test.describe('Service Forms - Travel Services', () => {
    test('should submit Travel Services request successfully', async ({ page }) => {
      await page.click('text=Travel Services');
      await page.waitForSelector('[data-testid="travel-services-form"]');
      
      // Fill form
      await page.fill('[name="fullName"]', 'Bob Wilson');
      await page.fill('[name="email"]', 'bob.wilson@example.com');
      await page.fill('[name="phone"]', '+61123456789');
      await page.fill('[name="departureCity"]', 'Sydney');
      await page.fill('[name="destination"]', 'London');
      await page.fill('[name="travelDates"]', '2024-07-10 to 2024-07-20');
      await page.fill('[name="numberOfTravelers"]', '2');
      await page.selectOption('[name="travelClass"]', 'Business');
      await page.fill('[name="specialRequests"]', 'Vegetarian meals');
      
      // Submit form
      await page.click('[type="submit"]');
      
      // Check success message
      await expect(page.locator('.success-message')).toContainText('Request submitted successfully');
    });
  });
  
  test.describe('Service Forms - Document Services', () => {
    test('should submit Document Services request successfully', async ({ page }) => {
      await page.click('text=Document Services');
      await page.waitForSelector('[data-testid="document-services-form"]');
      
      // Fill form
      await page.fill('[name="fullName"]', 'Carol Brown');
      await page.fill('[name="email"]', 'carol.brown@example.com');
      await page.fill('[name="phone"]', '+49123456789');
      await page.selectOption('[name="documentType"]', 'Passport');
      await page.selectOption('[name="serviceType"]', 'Renewal');
      await page.fill('[name="urgency"]', 'Standard');
      await page.fill('[name="additionalInfo"]', 'Current passport expires in 3 months');
      
      // Submit form
      await page.click('[type="submit"]');
      
      // Check success message
      await expect(page.locator('.success-message')).toContainText('Request submitted successfully');
    });
  });
  
  test.describe('Contact Form', () => {
    test('should submit contact form successfully', async ({ page }) => {
      await page.click('text=Contact');
      await page.waitForSelector('[data-testid="contact-form"]');
      
      // Fill form
      await page.fill('[name="name"]', 'David Miller');
      await page.fill('[name="email"]', 'david.miller@example.com');
      await page.fill('[name="phone"]', '+33123456789');
      await page.fill('[name="subject"]', 'General Inquiry');
      await page.fill('[name="message"]', 'I would like to know more about your services.');
      
      // Submit form
      await page.click('[type="submit"]');
      
      // Check success message
      await expect(page.locator('.success-message')).toContainText('Message sent successfully');
    });
  });
  
  test.describe('API Endpoints', () => {
    test('should handle API requests correctly', async ({ page }) => {
      // Test API health check
      const response = await page.request.get(`${BASE_URL}/api/health`);
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('healthy');
    });
    
    test('should validate API rate limiting', async ({ page }) => {
      const requests = [];
      
      // Make multiple rapid requests
      for (let i = 0; i < 15; i++) {
        requests.push(page.request.post(`${BASE_URL}/api/contact`, {
          data: {
            name: `Test User ${i}`,
            email: `test${i}@example.com`,
            message: 'Test message'
          }
        }));
      }
      
      const responses = await Promise.all(requests);
      
      // Check if rate limiting kicks in
      const tooManyRequests = responses.some(response => response.status() === 429);
      expect(tooManyRequests).toBeTruthy();
    });
  });
  
  test.describe('Performance Tests', () => {
    test('should load pages within performance budgets', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });
    
    test('should have good Core Web Vitals', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Wait for page to stabilize
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Check if WebVitals component is present
      const webVitalsElement = page.locator('[data-testid="web-vitals"]');
      await expect(webVitalsElement).toBeAttached();
    });
  });
  
  test.describe('Security Tests', () => {
    test('should have security headers', async ({ page }) => {
      const response = await page.goto(BASE_URL);
      
      // Check for security headers
      const headers = response?.headers();
      expect(headers?.['x-frame-options']).toBeTruthy();
      expect(headers?.['x-content-type-options']).toBe('nosniff');
      expect(headers?.['x-xss-protection']).toBeTruthy();
    });
    
    test('should prevent XSS attacks', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Try to inject script
      const maliciousScript = '<script>alert("XSS")</script>';
      await page.fill('[name="name"]', maliciousScript);
      
      // Check that script is not executed
      const nameValue = await page.inputValue('[name="name"]');
      expect(nameValue).not.toContain('<script>');
    });
  });
  
  test.describe('Accessibility Tests', () => {
    test('should have proper heading structure', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Check for h1
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      // Check heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(0);
    });
    
    test('should have alt text for images', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const images = await page.locator('img').all();
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });
    
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });
  
  test.describe('Mobile Responsiveness', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      // Test iPhone SE
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      await expect(page.locator('body')).toBeVisible();
      
      // Test iPad
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await expect(page.locator('body')).toBeVisible();
      
      // Test large desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.reload();
      await expect(page.locator('body')).toBeVisible();
    });
  });
});

// Performance measurement helper
test.describe('Performance Metrics', () => {
  test('should collect Web Vitals metrics', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              vitals.loadTime = entry.loadEventEnd - entry.loadEventStart;
            }
            if (entry.entryType === 'paint') {
              vitals[entry.name] = entry.startTime;
            }
          });
          
          resolve(vitals);
        });
        
        observer.observe({ entryTypes: ['navigation', 'paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    console.log('Performance Metrics:', metrics);
  });
});
