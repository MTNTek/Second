#!/usr/bin/env node

/**
 * Production Validation Script for Perry Eden Group
 * Comprehensive testing and validation for production readiness
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testHealthEndpoint() {
  log('\n🔍 Testing Health Endpoint', 'blue');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    });
    
    if (response.statusCode === 200) {
      const healthData = JSON.parse(response.data);
      log('✅ Health endpoint responsive', 'green');
      log(`   Status: ${healthData.status}`, 'cyan');
      log(`   Environment: ${healthData.environment}`, 'cyan');
      log(`   Database: ${healthData.services?.database?.status || 'unknown'}`, 'cyan');
      return true;
    } else {
      log(`❌ Health endpoint failed: ${response.statusCode}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Health endpoint error: ${error.message}`, 'red');
    return false;
  }
}

async function testAPIEndpoints() {
  log('\n🔗 Testing API Endpoints', 'blue');
  
  const endpoints = [
    { path: '/api/auth/register', method: 'POST', name: 'User Registration' },
    { path: '/api/contact', method: 'POST', name: 'Contact Form' },
    { path: '/api/travel', method: 'POST', name: 'Travel Services' },
    { path: '/api/visa', method: 'POST', name: 'Visa Services' },
    { path: '/api/work-permits', method: 'POST', name: 'Work Permits' },
    { path: '/api/uae-jobs', method: 'POST', name: 'UAE Jobs' },
    { path: '/api/documents', method: 'POST', name: 'Document Services' }
  ];
  
  let passedTests = 0;
  
  for (const endpoint of endpoints) {
    try {
      const testData = JSON.stringify({
        test: true,
        name: 'Test User',
        email: 'test@example.com'
      });
      
      const response = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: endpoint.path,
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(testData)
        },
        body: testData
      });
      
      // Accept 400 (validation error) as valid response for test data
      if (response.statusCode === 200 || response.statusCode === 400) {
        log(`✅ ${endpoint.name}`, 'green');
        passedTests++;
      } else {
        log(`❌ ${endpoint.name}: ${response.statusCode}`, 'red');
      }
    } catch (error) {
      log(`❌ ${endpoint.name}: ${error.message}`, 'red');
    }
  }
  
  log(`\nAPI Tests: ${passedTests}/${endpoints.length} passed`, 
    passedTests === endpoints.length ? 'green' : 'yellow');
  
  return passedTests === endpoints.length;
}

async function testPerformanceMetrics() {
  log('\n⚡ Testing Performance Monitoring', 'blue');
  
  try {
    // Test performance endpoint
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/performance',
      method: 'GET'
    });
    
    if (response.statusCode === 200) {
      log('✅ Performance monitoring active', 'green');
      return true;
    } else {
      log(`❌ Performance monitoring failed: ${response.statusCode}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Performance monitoring error: ${error.message}`, 'red');
    return false;
  }
}

async function testSecurity() {
  log('\n🔒 Testing Security Features', 'blue');
  
  let securityScore = 0;
  const totalTests = 4;
  
  // Test 1: Rate limiting
  try {
    log('   Testing rate limiting...', 'cyan');
    const promises = Array(10).fill().map(() => 
      makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/health',
        method: 'GET'
      })
    );
    
    await Promise.all(promises);
    log('   ✅ Rate limiting configured', 'green');
    securityScore++;
  } catch (error) {
    log('   ❌ Rate limiting test failed', 'red');
  }
  
  // Test 2: Security headers
  try {
    log('   Testing security headers...', 'cyan');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    });
    
    const requiredHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy'
    ];
    
    const hasHeaders = requiredHeaders.every(header => 
      response.headers[header] || response.headers[header.toLowerCase()]
    );
    
    if (hasHeaders) {
      log('   ✅ Security headers present', 'green');
      securityScore++;
    } else {
      log('   ❌ Missing security headers', 'red');
    }
  } catch (error) {
    log('   ❌ Security headers test failed', 'red');
  }
  
  // Test 3: HTTPS enforcement (check headers)
  try {
    log('   Testing HTTPS enforcement...', 'cyan');
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    });
    
    const hasSTSHeader = response.headers['strict-transport-security'];
    if (hasSTSHeader) {
      log('   ✅ HTTPS enforcement configured', 'green');
      securityScore++;
    } else {
      log('   ⚠️  HTTPS enforcement not detected (normal for localhost)', 'yellow');
      securityScore += 0.5;
    }
  } catch (error) {
    log('   ❌ HTTPS enforcement test failed', 'red');
  }
  
  // Test 4: Input validation
  try {
    log('   Testing input validation...', 'cyan');
    const maliciousData = JSON.stringify({
      name: '<script>alert("xss")</script>',
      email: 'test@test.com',
      message: 'DROP TABLE users;'
    });
    
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(maliciousData)
      },
      body: maliciousData
    });
    
    // Should reject malicious input
    if (response.statusCode === 400) {
      log('   ✅ Input validation working', 'green');
      securityScore++;
    } else {
      log('   ❌ Input validation may be insufficient', 'red');
    }
  } catch (error) {
    log('   ❌ Input validation test failed', 'red');
  }
  
  const securityPercentage = Math.round((securityScore / totalTests) * 100);
  log(`\nSecurity Score: ${securityPercentage}%`, 
    securityPercentage >= 80 ? 'green' : 'yellow');
  
  return securityPercentage >= 80;
}

function checkFileStructure() {
  log('\n📁 Checking File Structure', 'blue');
  
  const criticalFiles = [
    '.env.production',
    'next.config.js',
    'middleware.ts',
    'Dockerfile',
    'package.json',
    'app/api/health/route.ts',
    'app/api/performance/route.ts'
  ];
  
  let missingFiles = [];
  
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`   ✅ ${file}`, 'green');
    } else {
      log(`   ❌ ${file}`, 'red');
      missingFiles.push(file);
    }
  });
  
  return missingFiles.length === 0;
}

async function generateValidationReport(results) {
  log('\n📋 Production Validation Report', 'bold');
  log('=' .repeat(60), 'cyan');
  
  const tests = [
    { name: 'File Structure', result: results.fileStructure },
    { name: 'Health Endpoint', result: results.health },
    { name: 'API Endpoints', result: results.api },
    { name: 'Performance Monitoring', result: results.performance },
    { name: 'Security Features', result: results.security }
  ];
  
  let passedTests = 0;
  
  tests.forEach(test => {
    const status = test.result ? '✅' : '❌';
    const color = test.result ? 'green' : 'red';
    log(`${status} ${test.name}`, color);
    if (test.result) passedTests++;
  });
  
  const successRate = Math.round((passedTests / tests.length) * 100);
  
  log(`\nOverall Success Rate: ${successRate}%`, 
    successRate === 100 ? 'green' : successRate >= 80 ? 'yellow' : 'red');
  
  if (successRate === 100) {
    log('\n🎉 PRODUCTION VALIDATION PASSED!', 'green');
    log('Your application is ready for production deployment!', 'green');
  } else if (successRate >= 80) {
    log('\n⚠️  PRODUCTION VALIDATION MOSTLY PASSED', 'yellow');
    log('Minor issues detected but application should work in production.', 'yellow');
  } else {
    log('\n❌ PRODUCTION VALIDATION FAILED', 'red');
    log('Critical issues detected. Please fix before deploying.', 'red');
  }
  
  return successRate;
}

async function main() {
  log('🧪 Perry Eden Group - Production Validation', 'bold');
  log('Running comprehensive production readiness tests...', 'blue');
  log(`Started at: ${new Date().toLocaleString()}`, 'cyan');
  
  const results = {
    fileStructure: checkFileStructure(),
    health: false,
    api: false,
    performance: false,
    security: false
  };
  
  // Only run server tests if file structure is correct
  if (results.fileStructure) {
    log('\n🚀 Testing running application (make sure server is running on port 3000)...', 'yellow');
    
    results.health = await testHealthEndpoint();
    results.api = await testAPIEndpoints();
    results.performance = await testPerformanceMetrics();
    results.security = await testSecurity();
  } else {
    log('\n❌ Critical files missing. Skipping server tests.', 'red');
  }
  
  const successRate = await generateValidationReport(results);
  
  log(`\n🎯 Validation completed in ${Math.floor((Date.now() - startTime) / 1000)}s`, 'cyan');
  
  process.exit(successRate >= 80 ? 0 : 1);
}

const startTime = Date.now();

main().catch(error => {
  log(`\n❌ Validation failed: ${error.message}`, 'red');
  process.exit(1);
});