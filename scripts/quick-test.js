/**
 * Quick API Test
 */

const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🧪 Testing Perry Eden Group APIs...\n');
    
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:3000/api/contact', {
      method: 'GET',
    });
    
    console.log(`   Status: ${healthResponse.status}`);
    
    if (healthResponse.status === 404) {
      console.log('   ❌ API route not found');
    } else if (healthResponse.status === 405) {
      console.log('   ✅ API route exists (Method not allowed is expected)');
    } else {
      console.log('   ✅ API route accessible');
    }
    
    // Test contact form submission
    console.log('\n2. Testing contact form...');
    const contactResponse = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+971501234567',
        subject: 'API Test',
        message: 'Testing the contact form API',
        service: 'travel',
      }),
    });
    
    const contactData = await contactResponse.json();
    console.log(`   Status: ${contactResponse.status}`);
    console.log(`   Response:`, contactData);
    
    if (contactResponse.ok) {
      console.log('   ✅ Contact form submission successful');
    } else {
      console.log('   ❌ Contact form submission failed');
    }
    
    // Test user login
    console.log('\n3. Testing user login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123',
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   Response:`, loginData);
    
    if (loginResponse.ok) {
      console.log('   ✅ User login successful');
    } else {
      console.log('   ❌ User login failed');
    }
    
    console.log('\n🎉 API testing complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
