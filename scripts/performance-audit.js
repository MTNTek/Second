#!/usr/bin/env node

/**
 * Performance Audit Script for Perry Eden Group Application
 * Analyzes bundle size, performance metrics, and optimization opportunities
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

function checkFileSize(filePath, description, maxSize) {
  try {
    const stats = fs.statSync(filePath);
    const sizeInKB = (stats.size / 1024).toFixed(2);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    const withinLimit = stats.size <= maxSize;
    const status = withinLimit ? '✅' : '⚠️';
    const color = withinLimit ? 'green' : 'yellow';
    
    log(`${status} ${description}: ${sizeInKB}KB (${sizeInMB}MB)`, color);
    
    if (!withinLimit) {
      log(`   Warning: Exceeds recommended size of ${(maxSize / 1024).toFixed(2)}KB`, 'yellow');
    }
    
    return { size: stats.size, withinLimit };
  } catch (error) {
    log(`❌ ${description}: File not found`, 'red');
    return { size: 0, withinLimit: false };
  }
}

function analyzePackageJson() {
  log('\n📦 Package Analysis', 'blue');
  log('=' .repeat(50), 'cyan');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});
    
    log(`Dependencies: ${deps.length}`, 'green');
    log(`Dev Dependencies: ${devDeps.length}`, 'green');
    
    // Check for heavy packages
    const heavyPackages = [
      'react', 'react-dom', 'next', '@types/react', 'typescript',
      'tailwindcss', 'drizzle-orm', 'bcryptjs', 'jsonwebtoken'
    ];
    
    const presentHeavyPackages = heavyPackages.filter(pkg => 
      deps.includes(pkg) || devDeps.includes(pkg)
    );
    
    log(`Core packages present: ${presentHeavyPackages.length}/${heavyPackages.length}`, 'green');
    
    return {
      totalDeps: deps.length + devDeps.length,
      corePackages: presentHeavyPackages.length
    };
  } catch (error) {
    log('❌ Cannot read package.json', 'red');
    return { totalDeps: 0, corePackages: 0 };
  }
}

function analyzeComponentCount() {
  log('\n🧩 Component Analysis', 'blue');
  log('=' .repeat(50), 'cyan');
  
  const componentDirs = ['app/components', 'src/components'];
  let totalComponents = 0;
  
  componentDirs.forEach(dir => {
    try {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(file => 
          file.endsWith('.tsx') || file.endsWith('.ts')
        );
        totalComponents += files.length;
        log(`${dir}: ${files.length} components`, 'green');
      }
    } catch (error) {
      log(`❌ Cannot read ${dir}`, 'red');
    }
  });
  
  log(`Total Components: ${totalComponents}`, 'green');
  
  // Component complexity analysis
  if (totalComponents > 0) {
    const avgLinesPerComponent = estimateCodeLines() / totalComponents;
    log(`Estimated avg lines per component: ${avgLinesPerComponent.toFixed(0)}`, 'green');
  }
  
  return totalComponents;
}

function estimateCodeLines() {
  const codeDirs = ['app', 'src'];
  let totalLines = 0;
  
  function countLines(dir) {
    try {
      if (!fs.existsSync(dir)) return 0;
      
      const files = fs.readdirSync(dir);
      let lines = 0;
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          lines += countLines(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
          const content = fs.readFileSync(filePath, 'utf8');
          lines += content.split('\n').length;
        }
      });
      
      return lines;
    } catch (error) {
      return 0;
    }
  }
  
  codeDirs.forEach(dir => {
    totalLines += countLines(dir);
  });
  
  return totalLines;
}

function analyzeBuildSize() {
  log('\n📊 Build Size Analysis', 'blue');
  log('=' .repeat(50), 'cyan');
  
  // Check if .next directory exists
  if (!fs.existsSync('.next')) {
    log('⚠️ No build found. Run "npm run build" first for accurate analysis.', 'yellow');
    return { buildExists: false };
  }
  
  // Analyze key build files
  const buildFiles = [
    { path: '.next/static/css', desc: 'CSS Bundle', maxSize: 100 * 1024 }, // 100KB
    { path: '.next/static/chunks/pages', desc: 'Pages Bundle', maxSize: 500 * 1024 }, // 500KB
    { path: '.next/static/chunks', desc: 'JS Chunks', maxSize: 1024 * 1024 }, // 1MB
  ];
  
  let totalBuildSize = 0;
  
  buildFiles.forEach(({ path: buildPath, desc, maxSize }) => {
    try {
      if (fs.existsSync(buildPath)) {
        const files = fs.readdirSync(buildPath);
        let dirSize = 0;
        
        files.forEach(file => {
          const filePath = path.join(buildPath, file);
          const stats = fs.statSync(filePath);
          if (stats.isFile()) {
            dirSize += stats.size;
          }
        });
        
        totalBuildSize += dirSize;
        const sizeInKB = (dirSize / 1024).toFixed(2);
        const withinLimit = dirSize <= maxSize;
        const status = withinLimit ? '✅' : '⚠️';
        const color = withinLimit ? 'green' : 'yellow';
        
        log(`${status} ${desc}: ${sizeInKB}KB`, color);
      }
    } catch (error) {
      log(`❌ Cannot analyze ${buildPath}`, 'red');
    }
  });
  
  const totalSizeInMB = (totalBuildSize / (1024 * 1024)).toFixed(2);
  log(`Total Build Size: ${totalSizeInMB}MB`, totalBuildSize < 5 * 1024 * 1024 ? 'green' : 'yellow');
  
  return { buildExists: true, totalSize: totalBuildSize };
}

function analyzePerformanceOpportunities() {
  log('\n⚡ Performance Opportunities', 'blue');
  log('=' .repeat(50), 'cyan');
  
  const opportunities = [];
  
  // Check for performance optimizations
  const checks = [
    {
      file: 'next.config.js',
      search: 'compress: true',
      desc: 'Compression enabled',
      type: 'optimization'
    },
    {
      file: 'next.config.js',
      search: 'swcMinify',
      desc: 'SWC minification configured',
      type: 'optimization'
    },
    {
      file: 'app/layout.tsx',
      search: 'WebVitals',
      desc: 'Performance monitoring active',
      type: 'monitoring'
    },
    {
      file: 'src/lib/cache.ts',
      search: 'APICache',
      desc: 'API caching implemented',
      type: 'caching'
    }
  ];
  
  checks.forEach(({ file, search, desc, type }) => {
    try {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const implemented = content.includes(search);
        const status = implemented ? '✅' : '⚠️';
        const color = implemented ? 'green' : 'yellow';
        
        log(`${status} ${desc}`, color);
        
        if (!implemented) {
          opportunities.push({ desc, type });
        }
      }
    } catch (error) {
      log(`❌ Cannot check ${file}`, 'red');
    }
  });
  
  return opportunities;
}

function generateRecommendations(results) {
  log('\n🎯 Performance Recommendations', 'blue');
  log('=' .repeat(50), 'cyan');
  
  const recommendations = [];
  
  // Bundle size recommendations
  if (results.buildSize && results.buildSize.totalSize > 3 * 1024 * 1024) {
    recommendations.push('Consider code splitting and lazy loading for large components');
    recommendations.push('Analyze bundle with: ANALYZE=true npm run build');
  }
  
  // Component recommendations
  if (results.componentCount > 15) {
    recommendations.push('Consider component lazy loading for better initial load times');
  }
  
  // General recommendations
  recommendations.push('Implement image optimization with Next.js Image component');
  recommendations.push('Add PWA capabilities for better mobile experience');
  recommendations.push('Set up CDN for static assets in production');
  recommendations.push('Implement database connection pooling for production');
  
  if (recommendations.length === 0) {
    log('🎉 Excellent! No major performance issues detected.', 'green');
  } else {
    recommendations.forEach((rec, index) => {
      log(`${index + 1}. ${rec}`, 'yellow');
    });
  }
  
  return recommendations;
}

function generateSummary(results) {
  log('\n📈 Performance Summary', 'bold');
  log('=' .repeat(50), 'cyan');
  
  let score = 100;
  const issues = [];
  
  // Scoring logic
  if (results.packageSize && results.packageSize.totalDeps > 50) {
    score -= 10;
    issues.push('High dependency count');
  }
  
  if (results.buildSize && results.buildSize.totalSize > 5 * 1024 * 1024) {
    score -= 15;
    issues.push('Large bundle size');
  }
  
  if (results.opportunities && results.opportunities.length > 2) {
    score -= 10;
    issues.push('Missing performance optimizations');
  }
  
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D';
  const color = score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red';
  
  log(`Performance Score: ${score}/100 (Grade: ${grade})`, color);
  
  if (issues.length > 0) {
    log('\nAreas for improvement:', 'yellow');
    issues.forEach(issue => log(`• ${issue}`, 'yellow'));
  }
  
  log('\nNext steps:', 'blue');
  log('1. Run "npm run build" for detailed bundle analysis', 'blue');
  log('2. Test Core Web Vitals with Lighthouse', 'blue');
  log('3. Implement remaining performance optimizations', 'blue');
  log('4. Set up production monitoring', 'blue');
}

async function main() {
  log('⚡ Perry Eden Group - Performance Audit', 'bold');
  log('Analyzing application performance and optimization opportunities...', 'blue');
  
  const results = {
    packageSize: analyzePackageJson(),
    componentCount: analyzeComponentCount(),
    codeLines: estimateCodeLines(),
    buildSize: analyzeBuildSize(),
    opportunities: analyzePerformanceOpportunities(),
  };
  
  log('\n📝 Code Metrics', 'blue');
  log('=' .repeat(50), 'cyan');
  log(`Total Lines of Code: ${results.codeLines}`, 'green');
  log(`Components: ${results.componentCount}`, 'green');
  log(`Dependencies: ${results.packageSize.totalDeps}`, 'green');
  
  const recommendations = generateRecommendations(results);
  generateSummary(results);
  
  log('\n🚀 Ready for production optimization!', 'green');
}

main().catch(error => {
  log(`💥 Performance audit failed: ${error.message}`, 'red');
  process.exit(1);
});
