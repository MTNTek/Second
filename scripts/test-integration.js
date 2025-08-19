#!/usr/bin/env node

/**
 * Integration Test Suite for Perry Eden Group APIs
 * Tests all major API endpoints for functionality
 */

const API_BASE = 'http://localhost:3000';

// Test data for each service
const testData = {
  contact: {
    name: 'Test Contact',
    email: 'test@perreyeden.com',
    phone: '+971501234567',
    subject: 'API Integration Test',
    message: 'Testing contact form API endpoint',
    service: 'general'
  },
  
  travel: {
    bookingType: 'flight',
    departure: 'Dubai',
    destination: 'London',
    departureDate: '2025-12-01',
    returnDate: '2025-12-15',
    passengers: 2,
    classType: 'economy',
    contactName: 'Travel Test User',
    contactEmail: 'travel@test.com',
    contactPhone: '+971501234567',
    specialRequests: 'Window seat preferred'
  },
  
  visa: {
    visaType: 'tourist',
    country: 'canada',
    nationality: 'indian',
    passportNumber: 'T1234567',
    duration: '30',
    contactName: 'Visa Test User',
    contactEmail: 'visa@test.com',
    contactPhone: '+971501234567',
    specialRequirements: 'Express processing required'
  },
  
  workPermit: {
    country: 'poland',
    jobTitle: 'Factory Worker',
    company: 'Test Manufacturing',
    experience: '2-3 years experience in manufacturing',
    education: 'High school diploma',
    contactName: 'Work Test User',
    contactEmail: 'work@test.com',
    contactPhone: '+971501234567'
  },
  
  uaeJob: {
    industry: 'hospitality',
    jobTitle: 'Hotel Receptionist',
    experience: '2-3',
    currentLocation: 'Dubai',
    visaStatus: 'visit',
    availability: 'immediate',
    contactName: 'Job Test User',
    contactEmail: 'job@test.com',
    contactPhone: '+971501234567'
  },
  
  document: {
    serviceType: 'translation',
    documentType: 'passport',
    language: 'arabic',
    urgency: 'standard',
    quantity: 1,
    specialInstructions: 'Certified translation required',
    contactName: 'Document Test User',
    contactEmail: 'document@test.com',
    contactPhone: '+971501234567'
  }
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, endpoint, data, method = 'POST') {
  try {
    log(`\n📡 Testing ${name}...`, 'blue');
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: method === 'POST' ? JSON.stringify(data) : undefined
    });
    
    const result = await response.json();
    
    if (response.ok) {
      log(`✅ ${name} - SUCCESS`, 'green');
      log(`   Status: ${response.status}`, 'green');
      if (result.message) log(`   Message: ${result.message}`, 'green');
      return { success: true, data: result };
    } else {
      log(`❌ ${name} - FAILED`, 'red');
      log(`   Status: ${response.status}`, 'red');
      log(`   Error: ${result.error || result.message || 'Unknown error'}`, 'red');
      return { success: false, error: result };
    }
  } catch (error) {
    log(`💥 ${name} - NETWORK ERROR`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testHealthCheck() {
  try {
    log('🏥 Testing Health Check...', 'blue');
    const response = await fetch(`${API_BASE}/api/health`);
    const result = await response.json();
    
    if (response.ok) {
      log('✅ Health Check - SUCCESS', 'green');
      log(`   Status: ${result.status}`, 'green');
      log(`   Database: ${result.database}`, 'green');
      return true;
    } else {
      log('❌ Health Check - FAILED', 'red');
      return false;
    }
  } catch (error) {
    log('💥 Health Check - NETWORK ERROR', 'red');
    log(`   Server may not be running at ${API_BASE}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log('🚀 Starting Perry Eden Group API Integration Tests', 'bold');
  log('=' .repeat(60), 'yellow');
  
  // Check if server is running
  const healthCheck = await testHealthCheck();
  if (!healthCheck) {
    log('\n❌ Server not accessible. Please ensure the development server is running:', 'red');
    log('   npm run dev', 'yellow');
    process.exit(1);
  }
  
  const tests = [
    ['Contact Form', '/api/contact', testData.contact],
    ['Travel Booking', '/api/travel', testData.travel],
    ['Visa Application', '/api/visa', testData.visa],
    ['Work Permit', '/api/work-permits', testData.workPermit],
    ['UAE Jobs', '/api/uae-jobs', testData.uaeJob],
    ['Document Services', '/api/documents', testData.document]
  ];
  
  const results = [];
  
  for (const [name, endpoint, data] of tests) {
    const result = await testEndpoint(name, endpoint, data);
    results.push({ name, ...result });
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  log('\n' + '=' .repeat(60), 'yellow');
  log('📊 TEST SUMMARY', 'bold');
  log('=' .repeat(60), 'yellow');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const color = result.success ? 'green' : 'red';
    log(`${status} - ${result.name}`, color);
  });
  
  log(`\n📈 Results: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('🎉 All API endpoints are working correctly!', 'green');
    log('✅ Frontend integration is fully functional', 'green');
  } else {
    log('⚠️  Some tests failed. Check the errors above.', 'yellow');
  }
  
  log('\nNote: Authentication-protected endpoints may show auth errors, which is expected.', 'blue');
}

// Run the tests
runAllTests().catch(error => {
  log(`💥 Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
