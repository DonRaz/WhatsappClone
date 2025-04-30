# WhatsApp Clone Project

A full-stack WhatsApp clone built with Next.js, Express, and MongoDB.

## Environment Variables Setup

This project uses environment variables for configuration:

1. **Server** (.env in server/): 
   - Contains `DATABASE_URL`, `JWT_SECRET`, and `PORT`
   - Required for local development

2. **Root** (.env in project root):
   - Used by the deployment script
   - Contains all variables needed for production
   
3. **Frontend** (.env.production in client/):
   - Generated automatically by the deploy script
   - Do not edit manually

## Installation and Local Development

### Setup
1. Install dependencies for each part of the application:
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client/chat-whatsapp-clone
   bun install
   
   # Install shared dependencies
   cd ../../shared
   npm install
   ```

### Running Locally
You can run the application using the provided script:
```bash
# From project root
./run-locally.sh
```

This script will:
- Build the shared types
- Start the server in the background
- Start the client in the background
- Allow you to stop both with Ctrl+C

Alternatively, you can run each part manually:
1. Make sure `server/.env` contains the correct `DATABASE_URL`
2. Run the server with `cd server && npm run dev`
3. Run the frontend with `cd client/chat-whatsapp-clone && bun run dev`

### Project Cleanup
Before submitting or deploying, you can clean up unnecessary files:
```bash
# Clean up node_modules, build artifacts, etc.
./cleanup.sh

# Clean up and reinstall dependencies
./cleanup.sh --reinstall
```

In local development, Socket.IO is used for real-time communication.

### Production Deployment

1. Ensure root `.env` file has all required variables
2. Run `./deploy-with-env.sh`
3. The script sets all variables in Vercel and deploys both services

In production, Pusher is used for real-time communication.

## Features

- Real-time messaging
- User authentication
- Group conversations
- Message status (seen/delivered)
- Responsive design 