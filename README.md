# WhatsApp Clone Project

A full-stack WhatsApp clone built with Next.js, Express, and MongoDB.

## Installation and Local Development

1. Fetch from git:
```shell
git clone https://github.com/DonRaz/WhatsappClone.git
```


### Running Locally
1. run on seperated terminals:
- First terminal - Backend: (using npm)
```shell
cd server 
npm install && npm run dev
```
- Second Terminal - Frontend (using bun)
```shell
cd /client/chat-whatsapp-clone
bun install && bun run dev   
```
2. run single file:

```bash
# From project root
./run-locally.sh
```


This script will:
- Build the shared types
- Start the server in the background
- Start the client in the background
- Allow you to stop both with Ctrl+C

#### Notes:
1. environment files needs to be renamed (remove the `.example`) and filled
1. Make sure `server/.env` contains the correct `DATABASE_URL`


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

### Update types:  
Edit at `shared/schemas/index.ts` or `shared/realtime/index.ts` and run:
```bash
    cd FullstackFinalProject/shared
    npm run build
    npm version patch && npm publish
    cd FullstackFinalProject/client/chat-whatsapp-clone
    bun i @sraz-sw/fullstack-shared
    cd FullstackFinalProject/server
    npm i @sraz-sw/fullstack-shared

```

# Docs & Insights: 
## Realtime Features:
- [Realtime Architecture Overview](insights/Realtime-arch-overview.md)
- [Realtime Documentation](insights/realtimeDocs.md)
- [Realtime Implementation Plan](insights/implementationPlans/realtime-project-wide-impl-plan.md)

## File Storage: 
- [File Storage Abstraction](insights/File%20Storage%20Abstraction.md)
- [Implementation Plan](insights/implementationPlans/impl-remote-file-storage.md)

## React Query
- [React Query Cheatsheet](insights/React%20Query%20Cheatsheet%20for%20WhatsApp%20Clone.md)
- [Usage - Auth hook](client/chat-whatsapp-clone/src/hooks/useAuth.ts)
- [Usage - conversations](client/chat-whatsapp-clone/src/hooks/useConversations.ts)

## Other Documentation:
- [Environment Variables](insights/environmentVariable.md)
