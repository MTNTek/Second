/**
 * Global teardown for Playwright tests
 * Runs after all tests to clean up the testing environment
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up test environment...');
  
  try {
    // Clean up any test data or temporary files
    // For now, just log completion
    console.log('✅ Global teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw here to avoid masking test failures
  }
}

export default globalTeardown;
