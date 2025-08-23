#!/usr/bin/env node

/**
 * Master Production Setup Script for Perry Eden Group
 * Automates the complete production deployment process
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function execCommand(command, description) {
  try {
    log(`\n📋 ${description}`, 'blue');
    log(`Running: ${command}`, 'cyan');
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log('✅ Success', 'green');
    return { success: true, output };
  } catch (error) {
    log(`❌ Failed: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function checkPrerequisites() {
  log('\n🔍 Checking Prerequisites', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const checks = [
    { command: 'node --version', name: 'Node.js' },
    { command: 'npm --version', name: 'npm' },
    { command: 'git --version', name: 'Git' }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const result = execCommand(check.command, `Checking ${check.name}`);
    if (!result.success) {
      allPassed = false;
    } else {
      log(`${check.name}: ${result.output.trim()}`, 'green');
    }
  }
  
  return allPassed;
}

function setupEnvironment() {
  log('\n🔧 Setting Up Production Environment', 'bold');
  log('=' .repeat(50), 'cyan');
  
  // Check if .env.production exists
  if (!fs.existsSync('.env.production')) {
    log('⚠️  .env.production not found, creating from template...', 'yellow');
    
    if (fs.existsSync('.env.production.example')) {
      fs.copyFileSync('.env.production.example', '.env.production');
      log('✅ Created .env.production from template', 'green');
      log('⚠️  Please edit .env.production with your actual values', 'yellow');
    } else {
      log('❌ No .env.production.example found', 'red');
      return false;
    }
  } else {
    log('✅ .env.production exists', 'green');
  }
  
  return true;
}

function installDependencies() {
  log('\n📦 Installing Production Dependencies', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const result = execCommand('npm ci --only=production', 'Installing dependencies');
  return result.success;
}

function runSecurityAudit() {
  log('\n🔒 Running Security Audit', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const result = execCommand('npm audit --audit-level moderate', 'Checking for vulnerabilities');
  if (!result.success && result.error.includes('vulnerabilities')) {
    log('⚠️  Vulnerabilities found, attempting to fix...', 'yellow');
    const fixResult = execCommand('npm audit fix', 'Fixing vulnerabilities');
    return fixResult.success;
  }
  
  return result.success;
}

function buildApplication() {
  log('\n🏗️  Building Production Application', 'bold');
  log('=' .repeat(50), 'cyan');
  
  // Clean previous build
  if (fs.existsSync('.next')) {
    log('🧹 Cleaning previous build...', 'blue');
    fs.rmSync('.next', { recursive: true, force: true });
  }
  
  const result = execCommand('npm run build:production', 'Building application');
  return result.success;
}

function runTests() {
  log('\n🧪 Running Production Tests', 'bold');
  log('=' .repeat(50), 'cyan');
  
  // Check if test scripts exist
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.scripts['test']) {
    const result = execCommand('npm test', 'Running test suite');
    return result.success;
  } else {
    log('⚠️  No test script found, skipping...', 'yellow');
    return true;
  }
}

function performanceAudit() {
  log('\n⚡ Running Performance Audit', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const result = execCommand('npm run performance:audit', 'Analyzing performance');
  return result.success;
}

function deploymentCheck() {
  log('\n✅ Final Deployment Check', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const result = execCommand('npm run deploy:check', 'Verifying deployment readiness');
  return result.success;
}

function generateDeploymentSummary(results) {
  log('\n📋 Deployment Summary', 'bold');
  log('=' .repeat(60), 'cyan');
  
  const steps = [
    { name: 'Prerequisites', result: results.prerequisites },
    { name: 'Environment Setup', result: results.environment },
    { name: 'Dependencies', result: results.dependencies },
    { name: 'Security Audit', result: results.security },
    { name: 'Build Process', result: results.build },
    { name: 'Tests', result: results.tests },
    { name: 'Performance Audit', result: results.performance },
    { name: 'Deployment Check', result: results.deploymentCheck }
  ];
  
  let totalSteps = steps.length;
  let passedSteps = 0;
  
  steps.forEach(step => {
    const status = step.result ? '✅' : '❌';
    const color = step.result ? 'green' : 'red';
    log(`${status} ${step.name}`, color);
    if (step.result) passedSteps++;
  });
  
  const successRate = Math.round((passedSteps / totalSteps) * 100);
  
  log(`\nSuccess Rate: ${successRate}%`, successRate === 100 ? 'green' : 'yellow');
  
  if (successRate === 100) {
    log('\n🎉 Production Deployment Ready!', 'green');
    log('\nNext Steps:', 'blue');
    log('1. Deploy to your production server', 'cyan');
    log('2. Configure your domain and SSL', 'cyan');
    log('3. Set up monitoring and alerts', 'cyan');
    log('4. Run final smoke tests', 'cyan');
  } else {
    log('\n⚠️  Some steps failed. Please review and fix issues before deploying.', 'yellow');
  }
  
  return successRate;
}

async function main() {
  log('🚀 Perry Eden Group - Master Production Setup', 'bold');
  log('Starting automated production deployment preparation...', 'blue');
  log('Time: ' + new Date().toLocaleString(), 'cyan');
  
  const results = {
    prerequisites: await checkPrerequisites(),
    environment: setupEnvironment(),
    dependencies: false,
    security: false,
    build: false,
    tests: false,
    performance: false,
    deploymentCheck: false
  };
  
  // Only continue if prerequisites are met
  if (!results.prerequisites || !results.environment) {
    log('\n❌ Prerequisites not met. Please install required software and try again.', 'red');
    process.exit(1);
  }
  
  // Run the deployment pipeline
  results.dependencies = installDependencies();
  results.security = runSecurityAudit();
  results.build = buildApplication();
  results.tests = runTests();
  results.performance = performanceAudit();
  results.deploymentCheck = deploymentCheck();
  
  const successRate = generateDeploymentSummary(results);
  
  log('\n🎯 Production setup completed!', 'green');
  log(`Time taken: ${Math.floor((Date.now() - startTime) / 1000)}s`, 'cyan');
  
  process.exit(successRate === 100 ? 0 : 1);
}

const startTime = Date.now();

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  log(`\n❌ Unhandled error: ${error.message}`, 'red');
  process.exit(1);
});

// Run the main function
main().catch(error => {
  log(`\n❌ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});