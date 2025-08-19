/**
 * Quick Cloud Database Setup for Perry Eden Group
 * Helps set up free cloud PostgreSQL databases for immediate testing
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

class CloudDatabaseSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.envFile = path.join(this.projectRoot, '.env.local');
  }

  /**
   * Display cloud database options
   */
  displayCloudOptions() {
    console.log('☁️ Free Cloud PostgreSQL Database Options\n');
    
    console.log('🟢 SUPABASE (Recommended for Testing)');
    console.log('   • Free tier: 500MB database, 100MB file storage');
    console.log('   • Built-in authentication and real-time features');
    console.log('   • Setup: https://supabase.com');
    console.log('   • Steps:');
    console.log('     1. Sign up at https://supabase.com');
    console.log('     2. Create new project');
    console.log('     3. Go to Settings > Database');
    console.log('     4. Copy connection string');
    console.log('     5. Run: npm run db:cloud-setup supabase\n');
    
    console.log('🟦 NEON (Generous Free Tier)');
    console.log('   • Free tier: 3GB database, serverless PostgreSQL');
    console.log('   • Auto-scaling and branching features');
    console.log('   • Setup: https://neon.tech');
    console.log('   • Steps:');
    console.log('     1. Sign up at https://neon.tech');
    console.log('     2. Create new project');
    console.log('     3. Copy connection string');
    console.log('     4. Run: npm run db:cloud-setup neon\n');
    
    console.log('🐘 ELEPHANTSQL (Simple Setup)');
    console.log('   • Free tier: 20MB database');
    console.log('   • Simple PostgreSQL hosting');
    console.log('   • Setup: https://www.elephantsql.com');
    console.log('   • Steps:');
    console.log('     1. Sign up at https://www.elephantsql.com');
    console.log('     2. Create new instance (Tiny Turtle - Free)');
    console.log('     3. Copy URL from Details page');
    console.log('     4. Run: npm run db:cloud-setup elephantsql\n');
    
    console.log('🔗 RAILWAY (Developer Friendly)');
    console.log('   • Free tier: $5 monthly credit');
    console.log('   • One-click PostgreSQL deployment');
    console.log('   • Setup: https://railway.app');
    console.log('   • Steps:');
    console.log('     1. Sign up at https://railway.app');
    console.log('     2. Create new project > Add PostgreSQL');
    console.log('     3. Copy connection string from Variables tab');
    console.log('     4. Run: npm run db:cloud-setup railway\n');
  }

  /**
   * Interactive connection string setup
   */
  async setupConnectionString(provider = 'manual') {
    console.log(`🔧 Setting up ${provider.toUpperCase()} database connection...\n`);
    
    // Prompt for connection string
    console.log('Please paste your PostgreSQL connection string:');
    console.log('Format: postgresql://username:password@host:port/database');
    console.log('Example: postgresql://user:pass@db.supabase.co:5432/postgres\n');
    
    // For now, we'll create a template and ask user to update manually
    const templates = {
      supabase: 'postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres',
      neon: 'postgresql://[USERNAME]:[PASSWORD]@[ENDPOINT]/[DATABASE]?sslmode=require',
      elephantsql: 'postgres://[USERNAME]:[PASSWORD]@[HOST]/[DATABASE]',
      railway: 'postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway',
      manual: 'postgresql://username:password@host:port/database'
    };
    
    const template = templates[provider] || templates.manual;
    
    console.log(`Template for ${provider}:`);
    console.log(`${template}\n`);
    
    // Update environment file with placeholder
    this.updateEnvironmentFile(template, provider);
    
    // Create provider-specific instructions
    this.createProviderInstructions(provider);
    
    console.log('✅ Environment template updated!');
    console.log('⚠️  Please update the DATABASE_URL in .env.local with your actual credentials');
    console.log('📖 Check CLOUD_DATABASE_SETUP.md for detailed instructions');
  }

  /**
   * Update environment file with cloud database URL
   */
  updateEnvironmentFile(connectionString, provider) {
    let envContent = '';
    
    // Read existing .env.local
    if (fs.existsSync(this.envFile)) {
      envContent = fs.readFileSync(this.envFile, 'utf8');
    }
    
    // Update DATABASE_URL
    const timestamp = new Date().toISOString();
    const comment = `# Cloud Database Configuration (${provider}) - Updated: ${timestamp}`;
    
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(
        /# Database Configuration[\s\S]*?DATABASE_URL="[^"]*"/,
        `${comment}\nDATABASE_URL="${connectionString}"`
      );
    } else {
      envContent += `\n${comment}\nDATABASE_URL="${connectionString}"\n`;
    }
    
    // Add SSL configuration for cloud databases
    if (!envContent.includes('DB_SSL=')) {
      envContent += `
# Cloud Database SSL Configuration
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
`;
    }
    
    fs.writeFileSync(this.envFile, envContent);
    console.log(`✅ Updated ${this.envFile}`);
  }

  /**
   * Create provider-specific setup instructions
   */
  createProviderInstructions(provider) {
    const instructions = this.getProviderInstructions(provider);
    const instructionsPath = path.join(this.projectRoot, 'CLOUD_DATABASE_SETUP.md');
    fs.writeFileSync(instructionsPath, instructions);
    console.log(`✅ Created ${instructionsPath}`);
  }

  /**
   * Get detailed instructions for each provider
   */
  getProviderInstructions(provider) {
    const baseInstructions = `# Cloud Database Setup for Perry Eden Group

## ${provider.toUpperCase()} Setup Instructions

### Current Status
- ✅ Environment template created
- ⚠️  Database connection string needs to be updated
- 🔄 Ready for migration after connection string update

`;

    const providerSpecific = {
      supabase: `
### Supabase Setup Steps

1. **Create Supabase Account:**
   - Visit: https://supabase.com
   - Sign up with GitHub, Google, or email

2. **Create New Project:**
   - Click "New Project"
   - Choose organization
   - Enter project name: "perry-eden-group"
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"

3. **Get Connection String:**
   - Go to Settings > Database
   - Find "Connection string" section
   - Copy the "postgres" connection string
   - Replace [PASSWORD] with your database password

4. **Update Environment:**
   - Open .env.local in your project
   - Replace the DATABASE_URL with your actual connection string
   - Save the file

5. **Test Connection:**
   \`\`\`bash
   npm run db:generate
   npm run db:migrate
   npm run dev
   \`\`\`

### Supabase Features
- Built-in authentication
- Real-time subscriptions
- Auto-generated APIs
- Dashboard for data management
- Free tier: 500MB database, 1GB bandwidth

### Connection String Format:
\`\`\`
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
\`\`\`
`,

      neon: `
### Neon Setup Steps

1. **Create Neon Account:**
   - Visit: https://neon.tech
   - Sign up with GitHub, Google, or email

2. **Create New Project:**
   - Click "Create a project"
   - Enter project name: "perry-eden-group"
   - Select region
   - Click "Create project"

3. **Get Connection String:**
   - From project dashboard, click "Connection Details"
   - Copy the connection string
   - Note: SSL is required for Neon

4. **Update Environment:**
   - Open .env.local in your project
   - Replace the DATABASE_URL with your connection string
   - Ensure sslmode=require is included

5. **Test Connection:**
   \`\`\`bash
   npm run db:generate
   npm run db:migrate
   npm run dev
   \`\`\`

### Neon Features
- Serverless PostgreSQL
- Auto-scaling
- Database branching
- Point-in-time recovery
- Free tier: 3GB storage, 100 compute hours

### Connection String Format:
\`\`\`
postgresql://[USERNAME]:[PASSWORD]@[ENDPOINT]/[DATABASE]?sslmode=require
\`\`\`
`,

      elephantsql: `
### ElephantSQL Setup Steps

1. **Create ElephantSQL Account:**
   - Visit: https://www.elephantsql.com
   - Sign up with email

2. **Create New Instance:**
   - Click "Create New Instance"
   - Enter name: "perry-eden-group"
   - Select "Tiny Turtle" (Free plan)
   - Select region
   - Click "Create instance"

3. **Get Connection String:**
   - Click on your instance name
   - Copy the URL from the details page

4. **Update Environment:**
   - Open .env.local in your project
   - Replace the DATABASE_URL with your URL
   - Save the file

5. **Test Connection:**
   \`\`\`bash
   npm run db:generate
   npm run db:migrate
   npm run dev
   \`\`\`

### ElephantSQL Features
- Simple PostgreSQL hosting
- Easy management interface
- Backup and restore
- Free tier: 20MB storage, 5 concurrent connections

### Connection String Format:
\`\`\`
postgres://[USERNAME]:[PASSWORD]@[HOST]/[DATABASE]
\`\`\`
`,

      railway: `
### Railway Setup Steps

1. **Create Railway Account:**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Enter project name: "perry-eden-group"

3. **Get Connection String:**
   - Go to your PostgreSQL service
   - Click "Variables" tab
   - Copy the DATABASE_URL value

4. **Update Environment:**
   - Open .env.local in your project
   - Replace the DATABASE_URL with your Railway URL
   - Save the file

5. **Test Connection:**
   \`\`\`bash
   npm run db:generate
   npm run db:migrate
   npm run dev
   \`\`\`

### Railway Features
- One-click deployments
- Automatic scaling
- Built-in monitoring
- Free tier: $5 monthly credit

### Connection String Format:
\`\`\`
postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway
\`\`\`
`
    };

    return baseInstructions + (providerSpecific[provider] || '') + `

## Next Steps After Database Setup

1. **Generate Migrations:**
   \`\`\`bash
   npm run db:generate
   \`\`\`

2. **Run Migrations:**
   \`\`\`bash
   npm run db:migrate
   \`\`\`

3. **Start Application:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Verify Setup:**
   - Visit: http://localhost:3000
   - Check health: http://localhost:3000/api/health
   - Test API endpoints

## Troubleshooting

1. **Connection Issues:**
   - Verify connection string format
   - Check SSL requirements
   - Ensure database allows external connections

2. **Migration Issues:**
   - Check database permissions
   - Verify schema exists
   - Try: npm run db:push (force sync)

3. **SSL Issues:**
   - Add ?sslmode=require to connection string
   - Set DB_SSL=true in environment

## Database Management

- **Drizzle Studio:** \`npm run db:studio\`
- **Provider Dashboard:** Use your cloud provider's web interface
- **Direct Connection:** Use any PostgreSQL client

## Support

- Check application health: http://localhost:3000/api/health
- Review connection logs in terminal
- Contact cloud provider support if needed
`;
  }

  /**
   * Main setup method
   */
  async setup(provider = null) {
    console.log('☁️ Perry Eden Group - Cloud Database Setup\n');
    
    if (!provider) {
      this.displayCloudOptions();
      console.log('💡 To setup a specific provider, run:');
      console.log('   npm run db:cloud-setup [provider]');
      console.log('   Example: npm run db:cloud-setup supabase\n');
      return;
    }
    
    await this.setupConnectionString(provider);
    
    console.log('\n🎉 Cloud database setup template created!\n');
    console.log('📋 Next steps:');
    console.log('1. 📖 Follow instructions in CLOUD_DATABASE_SETUP.md');
    console.log('2. 🔧 Update DATABASE_URL in .env.local with your actual credentials');
    console.log('3. ⚡ Run migrations: npm run db:migrate');
    console.log('4. 🚀 Start app: npm run dev\n');
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const provider = args[0];

if (require.main === module) {
  const setup = new CloudDatabaseSetup();
  setup.setup(provider).catch(console.error);
}

module.exports = { CloudDatabaseSetup };
