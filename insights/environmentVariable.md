## Git and Version Control (Third Page)

## Implementation Guide

### Setup Process
1. Create `.env.example` with all required variables
   ```
   DATABASE_URL=postgres://user:pass@localhost:5432/db
   API_KEY=your_api_key_here
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```

2. Create your base `.env` file with non-sensitive shared values
   ```
   APP_NAME=MyProject
   PORT=3000
   ```

3. Create environment-specific files
   ```
   # .env.development
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
   
   ```
   # .env.production
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.myapp.com
   ```

4. Create `.env.local` for your sensitive local overrides
   ```
   DATABASE_URL=postgres://actual_user:actual_pass@localhost:5432/mydb
   API_KEY=my_real_api_key
   ```

### When Merging Occurs
- **Next.js**: At build time (`next build`) and runtime
- **Express/Node.js**: When the application starts
- Variables are not permanently merged into one file - they're loaded into memory
## Best Practices

### Priority Order (Who Overwrites Who)
- **Highest priority**: `.env.[environment].local` (e.g., `.env.production.local`)
- **Second**: `.env.[environment]` (e.g., `.env.production`)
- **Third**: `.env.local`
- **Lowest priority**: `.env`

Example: If `DATABASE_URL` exists in both `.env` and `.env.local`, the value from `.env.local` will be used.

### Core Files and Usage
- **`.env`**: Base variables for all environments (commit to git)
- **`.env.local`**: Override for local development (don't commit)
- **`.env.production`**: Production-specific values (commit to git)
- **`.env.development`**: Development-specific values (commit to git)
- **`.env.example`**: Template showing all required variables (commit to git)

### Security Guidelines
- Use `NEXT_PUBLIC_` prefix only for variables needed in browser
- Store secrets in `.env.local` or `.env.[environment].local`
- Validate environment variables on application startup


## Detailed Explanation

### Environment Variable Processing Details

1. **When Variables Are Processed**
   - Next.js: During build time AND at runtime
   - Node.js/Express: At application startup

2. **What Happens During Processing**
   - Environment variables from all applicable files are loaded into memory
   - They're merged following the priority order
   - Variables are accessible via `process.env`
   - In Next.js, `NEXT_PUBLIC_` variables are injected into client JavaScript

3. **Variable Type Differences**

   | Variable Type | Example | Access | Security |
   |---------------|---------|--------|----------|
   | Server-only | `DATABASE_URL` | Server code only | Secure |
   | Client-side | `NEXT_PUBLIC_API_URL` | Both server & browser | Not secure |

4. **Loading Mechanisms**
   - Next.js: Built-in support for all file types
   - Express: Requires library support
   ```javascript
   // Basic Express setup with dotenv
   require('dotenv').config();
   
   // With environment support
   require('dotenv-flow').config();
   ```

5. **Environment Detection**
   - Next.js automatically sets `NODE_ENV`:
     - `next dev` → `development`
     - `next build/start` → `production`
   - Express requires manual setting:
     - `NODE_ENV=production node server.js`

6. **Validation Best Practice**
   ```javascript
   // Validate required env vars on startup
   const requiredEnvVars = ['DATABASE_URL', 'API_KEY'];
   requiredEnvVars.forEach(varName => {
     if (!process.env[varName]) {
       console.error(`Missing ${varName} environment variable`);
       process.exit(1);
     }
   });
   ```

   ### Git Integration Best Practices

1. **What to Commit**
   - ✅ `.env.example` - Template for others to follow
   - ✅ `.env` - Only with non-sensitive default values
   - ✅ `.env.development` - Development defaults (no secrets)
   - ✅ `.env.production` - Production defaults (no secrets)
   - ✅ `.env.test` - Test configurations

2. **What to Add to .gitignore**
   - ❌ `.env.local` - Contains local overrides and secrets
   - ❌ `.env.*.local` - All environment-specific local files
   - ❌ Any file containing API keys, tokens, or passwords

3. **Sample .gitignore Configuration**
   ```
   # Environment variables
   .env.local
   .env.*.local
   .env.development.local
   .env.test.local
   .env.production.local
   ```

4. **Deployment Considerations**
   - CI/CD pipelines: Inject environment variables from secure storage
   - Hosting platforms (Vercel, Netlify): Use their environment variable UI
   - Docker: Use build args or environment variables in docker-compose
   - Kubernetes: Use secrets and configMaps

5. **Team Workflow**
   - New developer clones repository
   - Copies `.env.example` to `.env.local`
   - Fills in their own secrets and local overrides
   - Everyone shares the same config structure, with personal values

6. **Handling Secrets**
   - Never commit real secrets to git
   - Use secret management services when possible
   - Document required secrets in `.env.example`
   - Consider using vault services for production deployments# Environment Variables in Next.js and Node.js
