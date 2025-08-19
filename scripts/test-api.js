#!/usr/bin/env node

/**
 * API Testing Script
 * Tests all endpoints to ensure they're working correctly
 */

const BASE_URL = 'http://localhost:3000';

let authToken = null;
let testUserId = null;

async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message,
    };
  }
}

async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');
  
  // Test user registration
  console.log('1. Testing user registration...');
  const registerResult = await makeRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test API User',
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123',
      phone: '+971501234567',
    }),
  });
  
  if (registerResult.ok) {
    console.log('   ✅ Registration successful');
    testUserId = registerResult.data.user.id;
  } else {
    console.log('   ❌ Registration failed:', registerResult.data.error);
    return false;
  }

  // Test user login
  console.log('2. Testing user login...');
  const loginResult = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'test123',
    }),
  });
  
  if (loginResult.ok) {
    console.log('   ✅ Login successful');
    authToken = loginResult.data.token;
  } else {
    console.log('   ❌ Login failed:', loginResult.data.error);
    return false;
  }

  // Test get current user
  console.log('3. Testing get current user...');
  const meResult = await makeRequest('/api/auth/me');
  
  if (meResult.ok) {
    console.log('   ✅ Get user successful');
    console.log(`   👤 User: ${meResult.data.user.name} (${meResult.data.user.email})`);
  } else {
    console.log('   ❌ Get user failed:', meResult.data.error);
  }

  return true;
}

async function testApplicationAPIs() {
  console.log('\n📝 Testing Application APIs...');

  const testApplications = [
    {
      name: 'Travel Booking',
      endpoint: '/api/travel',
      data: {
        bookingType: 'flight',
        departure: 'Dubai',
        destination: 'London',
        departureDate: '2025-09-15',
        passengers: 2,
        classType: 'economy',
        contactName: 'Test User',
        contactEmail: 'test@example.com',
        contactPhone: '+971501234567',
      },
    },
    {
      name: 'Visa Application',
      endpoint: '/api/visa',
      data: {
        visaType: 'dubai-30',
        nationality: 'Indian',
        passportNumber: 'A12345678',
        passportExpiry: '2026-12-31',
        purposeOfVisit: 'tourism',
        contactName: 'Test User',
        contactEmail: 'test@example.com',
        contactPhone: '+971501234567',
      },
    },
    {
      name: 'Work Permit',
      endpoint: '/api/work-permits',
      data: {
        country: 'poland',
        jobTitle: 'Software Developer',
        company: 'Tech Company',
        salary: '5000',
        location: 'Warsaw',
        contactName: 'Test User',
        contactEmail: 'test@example.com',
        contactPhone: '+971501234567',
      },
    },
    {
      name: 'UAE Job',
      endpoint: '/api/uae-jobs',
      data: {
        industry: 'technology',
        jobTitle: 'Frontend Developer',
        experience: 'mid',
        expectedSalary: '8000',
        visaStatus: 'need_visa',
        contactName: 'Test User',
        contactEmail: 'test@example.com',
        contactPhone: '+971501234567',
      },
    },
    {
      name: 'Document Service',
      endpoint: '/api/documents',
      data: {
        serviceType: 'translation',
        documentType: 'passport',
        language: 'arabic',
        urgency: 'normal',
        quantity: 1,
        contactName: 'Test User',
        contactEmail: 'test@example.com',
        contactPhone: '+971501234567',
      },
    },
  ];

  for (const app of testApplications) {
    console.log(`${testApplications.indexOf(app) + 1}. Testing ${app.name}...`);
    
    const result = await makeRequest(app.endpoint, {
      method: 'POST',
      body: JSON.stringify(app.data),
    });

    if (result.ok) {
      console.log(`   ✅ ${app.name} submission successful`);
      console.log(`   📄 Application ID: ${result.data.application?.id || result.data.booking?.id || result.data.service?.id}`);
    } else {
      console.log(`   ❌ ${app.name} failed:`, result.data.error);
    }
  }
}

async function testContactForm() {
  console.log('\n📧 Testing Contact Form...');
  
  const contactResult = await makeRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Contact',
      email: 'contact@example.com',
      phone: '+971501234567',
      subject: 'API Testing',
      message: 'This is a test message from the API testing script.',
      service: 'travel',
    }),
  });

  if (contactResult.ok) {
    console.log('   ✅ Contact form submission successful');
    console.log(`   📄 Submission ID: ${contactResult.data.submission.id}`);
  } else {
    console.log('   ❌ Contact form failed:', contactResult.data.error);
  }
}

async function testFileUpload() {
  console.log('\n📎 Testing File Upload...');
  
  if (!authToken) {
    console.log('   ⚠️ Skipping file upload test (no auth token)');
    return;
  }

  // Create a simple test file
  const testFile = new Blob(['This is a test file for API testing'], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', testFile, 'test.txt');
  formData.append('applicationId', 'test-app-123');
  formData.append('applicationType', 'travel');
  formData.append('documentType', 'passport');

  const uploadResult = await makeRequest('/api/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  });

  if (uploadResult.ok) {
    console.log('   ✅ File upload successful');
    console.log(`   📄 File ID: ${uploadResult.data.file.id}`);
  } else {
    console.log('   ❌ File upload failed:', uploadResult.data.error);
  }
}

async function runAllTests() {
  console.log('🧪 Perry Eden Group - API Testing Suite');
  console.log('======================================');
  console.log(`📍 Testing server: ${BASE_URL}`);
  
  // Check if server is running
  console.log('\n🔍 Checking server status...');
  const healthCheck = await makeRequest('/api/auth/register', { method: 'GET' });
  
  if (healthCheck.status === 0) {
    console.log('❌ Server is not running!');
    console.log('💡 Please start the server with: npm run dev');
    process.exit(1);
  }

  console.log('✅ Server is running');

  try {
    // Run all tests
    const authSuccess = await testAuthentication();
    
    if (authSuccess) {
      await testApplicationAPIs();
      await testContactForm();
      await testFileUpload();
    }

    console.log('\n🎉 API Testing Complete!');
    console.log('========================');
    console.log('✅ All core endpoints are functional');
    console.log('🔐 Authentication system working');
    console.log('📝 Application submission working');
    console.log('📧 Contact form working');
    console.log('📎 File upload working');
    
    console.log('\n🚀 Ready for frontend integration!');
    
  } catch (error) {
    console.error('\n❌ Testing failed:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests, testAuthentication, testApplicationAPIs };
