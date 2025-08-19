/**
 * Global setup for Playwright tests
 * Runs before all tests to prepare the testing environment
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up test environment...');
  
  // Ensure the application is ready
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the dev server to be ready
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    
    console.log(`📡 Checking if server is ready at ${baseURL}...`);
    
    // Try to connect to the server with retries
    let retries = 30;
    while (retries > 0) {
      try {
        await page.goto(baseURL, { timeout: 5000 });
        console.log('✅ Server is ready!');
        break;
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw new Error(`Server not ready after 30 attempts: ${error}`);
        }
        console.log(`⏳ Server not ready, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Verify critical pages load
    console.log('🔍 Verifying critical pages...');
    await page.goto(`${baseURL}/`);
    await page.waitForSelector('body');
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
