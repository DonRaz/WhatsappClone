#!/bin/bash
set -e

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Deploying full-stack application with proper environment configuration...${NC}"

# Load variables from .env file
echo -e "${YELLOW}Loading environment variables from .env file...${NC}"
if [ ! -f ".env" ]; then
  echo -e "${RED}Error: .env file not found! Please create one based on .env.example${NC}"
  exit 1
fi

# Read each line from the .env file that isn't a comment
# Parse environment variables from .env file
while IFS='=' read -r key value || [ -n "$key" ]; do
  # Skip comments and empty lines
  if [[ ! $key =~ ^# && -n $key ]]; then
    # Trim whitespace
    key=$(echo "$key" | xargs)
    # Remove quotes from value if present
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
    # Export the variable
    export "$key"="$value"
    echo -e "${GREEN}Loaded: $key${NC}"
  fi
done < .env

echo -e "${GREEN}✅ Loaded environment variables successfully${NC}"

# Step 1: Deploy the backend first
echo -e "${YELLOW}Step 1: Configuring backend for deployment...${NC}"
cd ./server/

# Remove existing environment variables first
echo -e "${YELLOW}Removing existing CORS environment variables...${NC}"
vercel env rm ALLOWED_ORIGINS production -y || true
vercel env rm ALLOWED_ORIGINS preview -y || true
vercel env rm ALLOWED_ORIGINS development -y || true

# Add environment variables with new values
echo -e "${YELLOW}Setting CORS environment variables for backend...${NC}"
echo "$ALLOWED_ORIGINS" | vercel env add ALLOWED_ORIGINS production
echo "$ALLOWED_ORIGINS" | vercel env add ALLOWED_ORIGINS preview
echo "$ALLOWED_ORIGINS" | vercel env add ALLOWED_ORIGINS development

# Set the correct DATABASE_URL environment variable
echo -e "${YELLOW}Setting DATABASE_URL environment variable...${NC}"
# Remove existing DATABASE_URL environment variables first
echo -e "${YELLOW}Removing existing DATABASE_URL environment variables...${NC}"
vercel env rm DATABASE_URL production -y || true
vercel env rm DATABASE_URL preview -y || true
vercel env rm DATABASE_URL development -y || true

# Add the correct DATABASE_URL value
echo -e "${YELLOW}Adding correct DATABASE_URL to Vercel...${NC}"
echo "$DATABASE_URL" | vercel env add DATABASE_URL production
echo "$DATABASE_URL" | vercel env add DATABASE_URL preview
echo "$DATABASE_URL" | vercel env add DATABASE_URL development

# Set JWT_SECRET environment variable
echo -e "${YELLOW}Setting JWT_SECRET environment variable...${NC}"
# Remove existing JWT_SECRET environment variables first
echo -e "${YELLOW}Removing existing JWT_SECRET environment variables...${NC}"
vercel env rm JWT_SECRET production -y || true
vercel env rm JWT_SECRET preview -y || true
vercel env rm JWT_SECRET development -y || true

# Add the JWT_SECRET value
echo -e "${YELLOW}Adding JWT_SECRET to Vercel...${NC}"
echo "$JWT_SECRET" | vercel env add JWT_SECRET production
echo "$JWT_SECRET" | vercel env add JWT_SECRET preview
echo "$JWT_SECRET" | vercel env add JWT_SECRET development

# Set Pusher environment variables
echo -e "${YELLOW}Setting Pusher environment variables...${NC}"
# Remove existing Pusher environment variables first
echo -e "${YELLOW}Removing existing Pusher environment variables...${NC}"
vercel env rm PUSHER_APP_ID production -y || true
vercel env rm PUSHER_KEY production -y || true
vercel env rm PUSHER_SECRET production -y || true
vercel env rm PUSHER_CLUSTER production -y || true
vercel env rm PUSHER_APP_ID preview -y || true
vercel env rm PUSHER_KEY preview -y || true
vercel env rm PUSHER_SECRET preview -y || true
vercel env rm PUSHER_CLUSTER preview -y || true
vercel env rm PUSHER_APP_ID development -y || true
vercel env rm PUSHER_KEY development -y || true
vercel env rm PUSHER_SECRET development -y || true
vercel env rm PUSHER_CLUSTER development -y || true

# Add the Pusher environment variables
echo -e "${YELLOW}Adding Pusher environment variables to Vercel...${NC}"
# Trim all values to ensure no newlines or extra whitespace
PUSHER_APP_ID_TRIMMED=$(echo "$PUSHER_APP_ID" | tr -d '\r\n ' | xargs)
PUSHER_KEY_TRIMMED=$(echo "$PUSHER_KEY" | tr -d '\r\n ' | xargs)
PUSHER_SECRET_TRIMMED=$(echo "$PUSHER_SECRET" | tr -d '\r\n ' | xargs)
PUSHER_CLUSTER_TRIMMED=$(echo "$PUSHER_CLUSTER" | tr -d '\r\n ' | xargs)

echo -e "${GREEN}Trimmed Pusher variables:${NC}"
echo -e "PUSHER_APP_ID: $PUSHER_APP_ID_TRIMMED"
echo -e "PUSHER_KEY: $PUSHER_KEY_TRIMMED"
echo -e "PUSHER_CLUSTER: $PUSHER_CLUSTER_TRIMMED"

echo "$PUSHER_APP_ID_TRIMMED" | vercel env add PUSHER_APP_ID production
echo "$PUSHER_KEY_TRIMMED" | vercel env add PUSHER_KEY production
echo "$PUSHER_SECRET_TRIMMED" | vercel env add PUSHER_SECRET production
echo "$PUSHER_CLUSTER_TRIMMED" | vercel env add PUSHER_CLUSTER production
echo "$PUSHER_APP_ID_TRIMMED" | vercel env add PUSHER_APP_ID preview
echo "$PUSHER_KEY_TRIMMED" | vercel env add PUSHER_KEY preview
echo "$PUSHER_SECRET_TRIMMED" | vercel env add PUSHER_SECRET preview
echo "$PUSHER_CLUSTER_TRIMMED" | vercel env add PUSHER_CLUSTER preview
echo "$PUSHER_APP_ID_TRIMMED" | vercel env add PUSHER_APP_ID development
echo "$PUSHER_KEY_TRIMMED" | vercel env add PUSHER_KEY development
echo "$PUSHER_SECRET_TRIMMED" | vercel env add PUSHER_SECRET development
echo "$PUSHER_CLUSTER_TRIMMED" | vercel env add PUSHER_CLUSTER development

# Set VERCEL environment variable to identify deployment environment
echo -e "${YELLOW}Setting VERCEL environment flag...${NC}"
vercel env rm VERCEL production -y || true
vercel env rm VERCEL preview -y || true
vercel env rm VERCEL development -y || true
echo "1" | vercel env add VERCEL production
echo "1" | vercel env add VERCEL preview
echo "1" | vercel env add VERCEL development

# Create Vercel configuration if it doesn't exist
echo -e "${YELLOW}Ensuring Vercel configuration exists...${NC}"
if [ ! -f "vercel.json" ]; then
  echo -e "${YELLOW}Creating vercel.json configuration...${NC}"
  cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/socket.io/(.*)",
      "dest": "dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ],
  "outputDirectory": "dist"
}
EOF
  echo -e "${GREEN}✅ Created vercel.json configuration${NC}"
fi

# Add force clear cache environment variable
echo -e "${YELLOW}Setting cache clear for this deployment...${NC}"
# Remove existing force cache clear variable first
echo -e "${YELLOW}Removing existing cache clear environment variable...${NC}"
vercel env rm VERCEL_FORCE_NO_BUILD_CACHE production -y || true
# Add the environment variable
echo "1" | vercel env add VERCEL_FORCE_NO_BUILD_CACHE production

# Deploy with Vercel (Vercel will use package.json build script)
echo -e "${YELLOW}Deploying backend to Vercel...${NC}"
BACKEND_DEPLOY_OUTPUT=$(vercel deploy --prod)
echo "$BACKEND_DEPLOY_OUTPUT"

# Set the backend URL based on the .env file's PRODUCTION_API_URL
BACKEND_URL="$PRODUCTION_API_URL"
BACKEND_DEPLOY_URL=$(echo "$BACKEND_DEPLOY_OUTPUT" | grep -o 'https://[^ ]*\.vercel\.app' | head -1)

cd ..

echo -e "${GREEN}✅ Backend deployed to: $BACKEND_URL${NC}"
echo -e "${GREEN}✅ Specific deployment URL: $BACKEND_DEPLOY_URL${NC}"

# Step 2: Update frontend environment with backend URL and deploy
echo -e "${YELLOW}Step 2: Deploying frontend with backend URL...${NC}"
cd ./client/chat-whatsapp-clone

# Update the production environment variables with the actual backend URL
echo "NEXT_PUBLIC_API_URL=$BACKEND_URL" > .env.production
echo "NEXT_PUBLIC_PUSHER_KEY=$PUSHER_KEY_TRIMMED" >> .env.production
echo "NEXT_PUBLIC_PUSHER_CLUSTER=$PUSHER_CLUSTER_TRIMMED" >> .env.production
echo -e "${GREEN}✅ Updated .env.production with backend and Pusher config${NC}"

# Remove existing environment variables first
echo -e "${YELLOW}Removing existing frontend environment variables...${NC}"
vercel env rm NEXT_PUBLIC_API_URL production -y || true
vercel env rm NEXT_PUBLIC_API_URL preview -y || true
vercel env rm NEXT_PUBLIC_API_URL development -y || true
vercel env rm NEXT_PUBLIC_PUSHER_KEY production -y || true 
vercel env rm NEXT_PUBLIC_PUSHER_KEY preview -y || true
vercel env rm NEXT_PUBLIC_PUSHER_KEY development -y || true
vercel env rm NEXT_PUBLIC_PUSHER_CLUSTER production -y || true
vercel env rm NEXT_PUBLIC_PUSHER_CLUSTER preview -y || true
vercel env rm NEXT_PUBLIC_PUSHER_CLUSTER development -y || true

# Update Vercel environment variables
echo -e "${YELLOW}Setting environment variables in Vercel project...${NC}"
echo "$BACKEND_URL" | vercel env add NEXT_PUBLIC_API_URL production
echo "$BACKEND_URL" | vercel env add NEXT_PUBLIC_API_URL preview
echo "$BACKEND_URL" | vercel env add NEXT_PUBLIC_API_URL development
echo "$PUSHER_KEY_TRIMMED" | vercel env add NEXT_PUBLIC_PUSHER_KEY production
echo "$PUSHER_KEY_TRIMMED" | vercel env add NEXT_PUBLIC_PUSHER_KEY preview
echo "$PUSHER_KEY_TRIMMED" | vercel env add NEXT_PUBLIC_PUSHER_KEY development
echo "$PUSHER_CLUSTER_TRIMMED" | vercel env add NEXT_PUBLIC_PUSHER_CLUSTER production
echo "$PUSHER_CLUSTER_TRIMMED" | vercel env add NEXT_PUBLIC_PUSHER_CLUSTER preview
echo "$PUSHER_CLUSTER_TRIMMED" | vercel env add NEXT_PUBLIC_PUSHER_CLUSTER development

# Check if .babelrc exists and remove it
if [ -f ".babelrc" ]; then
  echo -e "${YELLOW}Removing .babelrc to allow SWC to work properly...${NC}"
  rm -f .babelrc
fi

# Clear cache to ensure clean build
echo -e "${YELLOW}Clearing Next.js build cache...${NC}"
rm -rf .next
rm -rf node_modules/.cache

# Copy assets to public directory
echo -e "${YELLOW}Copying assets to public directory...${NC}"
mkdir -p public/assets
cp -r assets/* public/ 2>/dev/null || echo "No assets directory found"

# Build and deploy with bun
echo -e "${YELLOW}Building and deploying with Bun...${NC}"
bun install
NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production bun run build

echo -e "${YELLOW}Deploying frontend to Vercel...${NC}"
FRONTEND_DEPLOY_OUTPUT=$(vercel deploy --prod)
echo "$FRONTEND_DEPLOY_OUTPUT"

# Set the static frontend URL
FRONTEND_URL="https://whatsapp-clone-client-xi.vercel.app"
FRONTEND_DEPLOY_URL=$(echo "$FRONTEND_DEPLOY_OUTPUT" | grep -o 'https://[^ ]*\.vercel\.app' | head -1)

echo -e "\n${GREEN}✅ DEPLOYMENT SUCCESSFUL! ✅${NC}"
echo -e "${GREEN}Backend URL: $BACKEND_URL${NC}"
echo -e "${GREEN}Backend deployment URL: $BACKEND_DEPLOY_URL${NC}"
echo -e "${GREEN}Frontend URL: $FRONTEND_URL${NC}"
echo -e "${GREEN}Frontend deployment URL: $FRONTEND_DEPLOY_URL${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Visit your frontend URL: $FRONTEND_URL"
echo -e "2. If any security warnings appear, consider setting up a custom domain"
echo -e "3. To verify the API connection, try to register/login"
echo -e "4. If CORS issues persist, check the CORS configuration:"
echo -e "   - Current allowed origins: $ALLOWED_ORIGINS"
echo -e "5. After deployment, verify the environment variables in Vercel dashboard" 