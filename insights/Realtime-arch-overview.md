# Real-time Messaging Functionality

This project implements real-time messaging using a modular approach that supports multiple providers:

1. Socket.IO (default implementation)
2. Pusher (alternative implementation)

## How to Test the Real-time Functionality

### Step 1: Start the server

```bash
cd server
npm run dev
```

The server will start on port 3010.

### Step 2: Start the client

```bash
cd client/chat-whatsapp-clone
npm run dev
```

The Next.js client will start on port 3000.

### Step 3: Open the demo page

Open your browser and navigate to:

```
http://localhost:3000/realtime-demo
```

### Step 4: Test the real-time functionality

1. **Open two browser windows** with the demo page side by side
2. In one window, click the "Simulate Server Message" button
3. You should see a message appear in both windows
4. Try typing and sending messages in each window to see them appear in real-time

## Architecture Overview

### Server-Side Components

- `realtime/types.ts` - Defines the provider interface
- `realtime/providers/SocketIOProvider.ts` - Socket.IO implementation
- `realtime/providers/PusherProvider.ts` - Pusher implementation
- `realtime/index.ts` - Factory functions for creating providers

### Client-Side Components

- `lib/realtime/types.ts` - Client-side provider interface
- `lib/realtime/providers/SocketIOClient.ts` - Socket.IO client implementation
- `lib/realtime/providers/PusherClient.ts` - Pusher client implementation
- `lib/realtime/index.ts` - Factory functions for creating client providers
- `hooks/useRealtime.ts` - React hook for using realtime in components

### Shared Types

- `shared/realtime/index.ts` - Shared event types used by both client and server

## Switching Providers

### Server-Side

To switch between providers on the server, update the initialization in `server/src/index.ts`:

```typescript
// For Socket.IO
initializeRealtimeProvider('socketio', server);

// For Pusher
initializeRealtimeProvider('pusher', {
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!
});
```

### Client-Side

To switch between providers on the client, update the initialization in `components/RealtimeDemo.tsx`:

```typescript
// For Socket.IO
initializeRealtimeProvider('socketio', {
  serverUrl: 'http://localhost:3010'
});

// For Pusher
initializeRealtimeProvider('pusher', {
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
});
```

## Adding New Providers

To add a new provider (e.g., Firebase, AWS IoT, etc.):

1. Create a new server-side provider in `server/src/realtime/providers/`
2. Create a new client-side provider in `client/chat-whatsapp-clone/src/lib/realtime/providers/`
3. Update the factory functions in both `index.ts` files
4. Add the necessary configuration options

Each provider must implement the `RealtimeProvider` interface on the server and `RealtimeClientProvider` interface on the client. 