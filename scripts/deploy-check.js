#!/usr/bin/env node

/**
 * Production Deployment Script for Perry Eden Group
 * Handles environment setup, security checks, and deployment preparation
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

function checkEnvironmentVariables() {
  log('\n🔍 Environment Variables Check', 'blue');
  log('=' .repeat(50), 'cyan');
  
  const requiredVars = [
    'DB_HOST',
    'DB_PASSWORD',
    'JWT_SECRET',
    'CSRF_SECRET',
    'SMTP_HOST',
    'SMTP_PASSWORD'
  ];
  
  const missingVars = [];
  const presentVars = [];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      presentVars.push(varName);
      log(`✅ ${varName}: Set`, 'green');
    } else {
      missingVars.push(varName);
      log(`❌ ${varName}: Missing`, 'red');
    }
  });
  
  // Check for weak secrets
  const secretVars = ['JWT_SECRET', 'CSRF_SECRET', 'SESSION_SECRET'];
  secretVars.forEach(varName => {
    const value = process.env[varName];
    if (value && value.length < 32) {
      log(`⚠️  ${varName}: Too short (minimum 32 characters)`, 'yellow');
    }
  });
  
  return { missing: missingVars, present: presentVars };
}

function checkSecurityConfiguration() {
  log('\n🔒 Security Configuration Check', 'blue');
  log('=' .repeat(50), 'cyan');
  
  const checks = [
    {
      name: 'HTTPS Configuration',
      check: () => process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https://'),
      fix: 'Set NEXTAUTH_URL to use HTTPS in production'
    },
    {
      name: 'Secure Cookies',
      check: () => process.env.SESSION_SECURE === 'true',
      fix: 'Set SESSION_SECURE=true for production'
    },
    {
      name: 'Database SSL',
      check: () => process.env.DB_SSL === 'true',
      fix: 'Set DB_SSL=true for production database'
    },
    {
      name: 'CORS Origins',
      check: () => process.env.CORS_ORIGINS && !process.env.CORS_ORIGINS.includes('localhost'),
      fix: 'Remove localhost from CORS_ORIGINS in production'
    }
  ];
  
  let securityScore = 0;
  
  checks.forEach(({ name, check, fix }) => {
    if (check()) {
      log(`✅ ${name}: Configured`, 'green');
      securityScore++;
    } else {
      log(`❌ ${name}: Not configured`, 'red');
      log(`   Fix: ${fix}`, 'yellow');
    }
  });
  
  const percentage = Math.round((securityScore / checks.length) * 100);
  log(`\nSecurity Score: ${securityScore}/${checks.length} (${percentage}%)`, 
    percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red'
  );
  
  return { score: securityScore, total: checks.length };
}

function checkDatabaseConnection() {
  log('\n🗄️  Database Connection Check', 'blue');
  log('=' .repeat(50), 'cyan');
  
  const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  };
  
  // Check if all database config is present
  const missingDbConfig = Object.entries(dbConfig)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  if (missingDbConfig.length > 0) {
    log(`❌ Missing database config: ${missingDbConfig.join(', ')}`, 'red');
    return false;
  }
  
  log('✅ Database configuration present', 'green');
  log(`   Host: ${dbConfig.host}:${dbConfig.port}`, 'blue');
  log(`   Database: ${dbConfig.database}`, 'blue');
  log(`   User: ${dbConfig.user}`, 'blue');
  
  return true;
}

function runBuildOptimization() {
  log('\n🏗️  Build Optimization', 'blue');
  log('=' .repeat(50), 'cyan');
  
  try {
    // Clean previous builds
    log('🧹 Cleaning previous builds...', 'blue');
    if (process.platform === 'win32') {
      execSync('if exist .next rmdir /s /q .next', { stdio: 'inherit' });
    } else {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
    
    // Run production build
    log('📦 Running production build...', 'blue');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Analyze bundle if requested
    if (process.env.ANALYZE === 'true') {
      log('📊 Analyzing bundle size...', 'blue');
      execSync('ANALYZE=true npm run build', { stdio: 'inherit' });
    }
    
    log('✅ Build optimization completed', 'green');
    return true;
    
  } catch (error) {
    log('❌ Build optimization failed', 'red');
    log(error.message, 'red');
    return false;
  }
}

function checkFilePermissions() {
  log('\n📁 File Permissions Check', 'blue');
  log('=' .repeat(50), 'cyan');
  
  const criticalFiles = [
    '.env.production',
    'package.json',
    'next.config.js'
  ];
  
  let allGood = true;
  
  criticalFiles.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        log(`✅ ${file}: Exists`, 'green');
        
        // Check if file is readable
        fs.accessSync(file, fs.constants.R_OK);
        log(`   Readable: Yes`, 'green');
        
      } else {
        log(`❌ ${file}: Not found`, 'red');
        allGood = false;
      }
    } catch (error) {
      log(`❌ ${file}: Permission error`, 'red');
      allGood = false;
    }
  });
  
  return allGood;
}

function generateDeploymentSummary(results) {
  log('\n📋 Deployment Summary', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const {
    envVars,
    security,
    database,
    build,
    permissions
  } = results;
  
  log(`Environment Variables: ${envVars.present.length}/${envVars.present.length + envVars.missing.length}`, 
    envVars.missing.length === 0 ? 'green' : 'red'
  );
  
  log(`Security Configuration: ${security.score}/${security.total}`, 
    security.score === security.total ? 'green' : 'yellow'
  );
  
  log(`Database Configuration: ${database ? '✅' : '❌'}`, database ? 'green' : 'red');
  log(`Build Status: ${build ? '✅' : '❌'}`, build ? 'green' : 'red');
  log(`File Permissions: ${permissions ? '✅' : '❌'}`, permissions ? 'green' : 'red');
  
  // Calculate overall readiness
  const totalChecks = 5;
  let passedChecks = 0;
  
  if (envVars.missing.length === 0) passedChecks++;
  if (security.score === security.total) passedChecks++;
  if (database) passedChecks++;
  if (build) passedChecks++;
  if (permissions) passedChecks++;
  
  const readinessPercentage = Math.round((passedChecks / totalChecks) * 100);
  
  log(`\nDeployment Readiness: ${readinessPercentage}%`, 
    readinessPercentage >= 100 ? 'green' : readinessPercentage >= 80 ? 'yellow' : 'red'
  );
  
  if (readinessPercentage >= 100) {
    log('\n🚀 Ready for production deployment!', 'green');
    log('\nNext steps:', 'blue');
    log('1. Deploy to your production server', 'blue');
    log('2. Run database migrations', 'blue');
    log('3. Configure reverse proxy (nginx/Apache)', 'blue');
    log('4. Set up SSL certificates', 'blue');
    log('5. Configure monitoring and logging', 'blue');
  } else {
    log('\n⚠️  Not ready for production deployment', 'yellow');
    log('Please fix the issues above before deploying.', 'yellow');
  }
  
  return readinessPercentage;
}

function generateDockerfile() {
  log('\n🐳 Generating Production Dockerfile', 'blue');
  log('=' .repeat(50), 'cyan');
  
  const dockerfile = `# Production Dockerfile for Perry Eden Group
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \\
  if [ -f package-lock.json ]; then npm ci --only=production; \\
  else echo "Lockfile not found." && exit 1; \\
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the build files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
`;
  
  try {
    fs.writeFileSync('Dockerfile', dockerfile);
    log('✅ Dockerfile generated successfully', 'green');
    
    // Generate .dockerignore
    const dockerignore = `node_modules
.next
.git
.env*
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
.DS_Store
*.tsbuildinfo
`;
    
    fs.writeFileSync('.dockerignore', dockerignore);
    log('✅ .dockerignore generated successfully', 'green');
    
    return true;
  } catch (error) {
    log('❌ Failed to generate Docker files', 'red');
    return false;
  }
}

async function main() {
  log('🚀 Perry Eden Group - Production Deployment Check', 'bold');
  log('Analyzing production readiness and generating deployment files...', 'blue');
  
  // Load environment variables
  if (fs.existsSync('.env.production')) {
    require('dotenv').config({ path: '.env.production' });
    log('✅ Loaded .env.production', 'green');
  } else {
    log('⚠️  No .env.production found, using system environment', 'yellow');
  }
  
  const results = {
    envVars: checkEnvironmentVariables(),
    security: checkSecurityConfiguration(),
    database: checkDatabaseConnection(),
    build: runBuildOptimization(),
    permissions: checkFilePermissions()
  };
  
  const readiness = generateDeploymentSummary(results);
  
  // Generate Docker files
  generateDockerfile();
  
  // Generate deployment commands
  log('\n🛠️  Deployment Commands', 'blue');
  log('=' .repeat(50), 'cyan');
  log('# Database Migration:', 'blue');
  log('npm run db:migrate', 'green');
  log('\n# Start Production Server:', 'blue');
  log('npm start', 'green');
  log('\n# Docker Deployment:', 'blue');
  log('docker build -t perry-eden-group .', 'green');
  log('docker run -p 3000:3000 --env-file .env.production perry-eden-group', 'green');
  
  process.exit(readiness >= 100 ? 0 : 1);
}

main().catch(error => {
  log(`💥 Deployment check failed: ${error.message}`, 'red');
  process.exit(1);
});
