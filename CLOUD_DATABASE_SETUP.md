# Cloud Database Setup for Perry Eden Group

## SUPABASE Setup Instructions

### Current Status
- ✅ Environment template created
- ⚠️  Database connection string needs to be updated
- 🔄 Ready for migration after connection string update


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
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run dev
   ```

### Supabase Features
- Built-in authentication
- Real-time subscriptions
- Auto-generated APIs
- Dashboard for data management
- Free tier: 500MB database, 1GB bandwidth

### Connection String Format:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```


## Next Steps After Database Setup

1. **Generate Migrations:**
   ```bash
   npm run db:generate
   ```

2. **Run Migrations:**
   ```bash
   npm run db:migrate
   ```

3. **Start Application:**
   ```bash
   npm run dev
   ```

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

- **Drizzle Studio:** `npm run db:studio`
- **Provider Dashboard:** Use your cloud provider's web interface
- **Direct Connection:** Use any PostgreSQL client

## Support

- Check application health: http://localhost:3000/api/health
- Review connection logs in terminal
- Contact cloud provider support if needed
