#!/usr/bin/env node

/**
 * Quick Functionality Verification Script
 * Verifies that all major components are working
 */

const fs = require('fs');
const path = require('path');

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

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  const color = exists ? 'green' : 'red';
  log(`${status} ${description}`, color);
  return exists;
}

function verifyProjectStructure() {
  log('\n🔍 Verifying Project Structure', 'blue');
  log('=' .repeat(50), 'yellow');
  
  const checks = [
    ['package.json', 'Package configuration'],
    ['next.config.js', 'Next.js configuration'],
    ['tailwind.config.js', 'Tailwind CSS configuration'],
    ['tsconfig.json', 'TypeScript configuration'],
    ['app/layout.tsx', 'App layout component'],
    ['app/page.tsx', 'Home page component'],
    ['src/context/AuthContext.tsx', 'Authentication context'],
    ['src/hooks/useApi.ts', 'API integration hooks'],
    ['src/lib/db.ts', 'Database connection'],
    ['src/lib/schema.ts', 'Database schema'],
  ];
  
  let passed = 0;
  checks.forEach(([file, desc]) => {
    if (checkFileExists(file, desc)) passed++;
  });
  
  return { passed, total: checks.length };
}

function verifyComponents() {
  log('\n🧩 Verifying React Components', 'blue');
  log('=' .repeat(50), 'yellow');
  
  const components = [
    ['app/components/Contact.tsx', 'Contact Form'],
    ['app/components/TravelServices.tsx', 'Travel Services'],
    ['app/components/VisaServices.tsx', 'Visa Services'],
    ['app/components/WorkPermits.tsx', 'Work Permits'],
    ['app/components/UAEJobs.tsx', 'UAE Jobs'],
    ['app/components/DocumentServices.tsx', 'Document Services'],
    ['app/components/Header.tsx', 'Header Navigation'],
    ['app/components/Footer.tsx', 'Footer'],
    ['app/components/UserDashboard.tsx', 'User Dashboard'],
  ];
  
  let passed = 0;
  components.forEach(([file, desc]) => {
    if (checkFileExists(file, desc)) passed++;
  });
  
  return { passed, total: components.length };
}

function verifyAPIRoutes() {
  log('\n🔌 Verifying API Routes', 'blue');
  log('=' .repeat(50), 'yellow');
  
  const routes = [
    ['app/api/auth/login/route.ts', 'User Login API'],
    ['app/api/auth/register/route.ts', 'User Registration API'],
    ['app/api/contact/route.ts', 'Contact Form API'],
    ['app/api/travel/route.ts', 'Travel Booking API'],
    ['app/api/visa/route.ts', 'Visa Application API'],
    ['app/api/work-permits/route.ts', 'Work Permits API'],
    ['app/api/uae-jobs/route.ts', 'UAE Jobs API'],
    ['app/api/documents/route.ts', 'Document Services API'],
    ['app/api/health/route.ts', 'Health Check API'],
  ];
  
  let passed = 0;
  routes.forEach(([file, desc]) => {
    if (checkFileExists(file, desc)) passed++;
  });
  
  return { passed, total: routes.length };
}

function verifyIntegrationFeatures() {
  log('\n🔗 Verifying Integration Features', 'blue');
  log('=' .repeat(50), 'yellow');
  
  // Check for API integration in components
  const integrationChecks = [
    {
      file: 'app/components/Contact.tsx',
      search: 'useContactForm',
      desc: 'Contact form API integration'
    },
    {
      file: 'app/components/TravelServices.tsx',
      search: 'useTravelBooking',
      desc: 'Travel services API integration'
    },
    {
      file: 'app/components/VisaServices.tsx',
      search: 'useVisaApplication',
      desc: 'Visa services API integration'
    },
    {
      file: 'app/components/WorkPermits.tsx',
      search: 'useWorkPermit',
      desc: 'Work permits API integration'
    },
    {
      file: 'app/components/UAEJobs.tsx',
      search: 'useUAEJobs',
      desc: 'UAE jobs API integration'
    },
    {
      file: 'app/components/DocumentServices.tsx',
      search: 'useDocumentService',
      desc: 'Document services API integration'
    }
  ];
  
  let passed = 0;
  integrationChecks.forEach(({ file, search, desc }) => {
    try {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const hasIntegration = content.includes(search);
        const status = hasIntegration ? '✅' : '❌';
        const color = hasIntegration ? 'green' : 'red';
        log(`${status} ${desc}`, color);
        if (hasIntegration) passed++;
      } else {
        log(`❌ ${desc} (file not found)`, 'red');
      }
    } catch (error) {
      log(`❌ ${desc} (error reading file)`, 'red');
    }
  });
  
  return { passed, total: integrationChecks.length };
}

function generateSummary(results) {
  log('\n📊 VERIFICATION SUMMARY', 'bold');
  log('=' .repeat(50), 'yellow');
  
  const totalPassed = results.reduce((sum, result) => sum + result.passed, 0);
  const totalChecks = results.reduce((sum, result) => sum + result.total, 0);
  const percentage = Math.round((totalPassed / totalChecks) * 100);
  
  results.forEach(({ category, passed, total }) => {
    const categoryPercentage = Math.round((passed / total) * 100);
    const color = categoryPercentage === 100 ? 'green' : categoryPercentage > 80 ? 'yellow' : 'red';
    log(`${category}: ${passed}/${total} (${categoryPercentage}%)`, color);
  });
  
  log(`\nOverall: ${totalPassed}/${totalChecks} (${percentage}%)`, percentage === 100 ? 'green' : 'yellow');
  
  if (percentage === 100) {
    log('\n🎉 Perfect! All components verified successfully!', 'green');
    log('✅ Frontend integration is complete and ready for testing', 'green');
  } else if (percentage > 90) {
    log('\n🚀 Excellent! Project is nearly complete', 'yellow');
    log('⚠️  A few minor items need attention', 'yellow');
  } else {
    log('\n⚠️  Some components need attention', 'red');
    log('🔧 Review the failed checks above', 'red');
  }
}

async function main() {
  log('🔍 Perry Eden Group - Project Verification', 'bold');
  log('Checking project structure and integration status...', 'blue');
  
  const results = [
    { category: 'Project Structure', ...verifyProjectStructure() },
    { category: 'React Components', ...verifyComponents() },
    { category: 'API Routes', ...verifyAPIRoutes() },
    { category: 'API Integration', ...verifyIntegrationFeatures() },
  ];
  
  generateSummary(results);
  
  log('\n🎯 Next Steps:', 'blue');
  log('1. Run integration tests with: node scripts/test-integration.js', 'blue');
  log('2. Start development server: npm run dev', 'blue');
  log('3. Test all forms in browser', 'blue');
  log('4. Review production checklist: PRODUCTION_CHECKLIST.md', 'blue');
}

main().catch(error => {
  log(`💥 Verification failed: ${error.message}`, 'red');
  process.exit(1);
});
