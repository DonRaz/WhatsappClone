#!/bin/zsh

# Script to build and run the project locally
echo "🚀 Starting local development environment..."

# Check if TypeScript is installed globally, if not install it
if ! command -v tsc &> /dev/null; then
  echo "📦 Installing TypeScript globally..."
  npm install -g typescript
fi

# Build and run shared types first
echo "\n📦 Building shared types..."
cd shared && npm install && npm run build
if [ $? -ne 0 ]; then
  echo "❌ Failed to build shared types. Exiting."
  exit 1
fi
echo "✅ Shared types built successfully"

# Going back to root directory
cd ..

# Create a temporary file for server logs
SERVER_LOG_FILE=$(mktemp)
echo "Server logs will be saved to: $SERVER_LOG_FILE"

# Start server in background but also show output
echo "\n🖥️  Building and starting server..."
(cd server && npm install && npm run build && npm run dev | tee "$SERVER_LOG_FILE") &
SERVER_PID=$!
echo "✅ Server started with PID: $SERVER_PID"

# Wait longer for server to initialize (ts-node-dev takes time)
echo "⏳ Waiting for server to initialize..."
sleep 10

# Check if server is running
if ! curl -s http://localhost:3010/health > /dev/null; then
  echo "❌ Server failed to start properly. Will try starting client anyway."
  echo "Check the server log file: $SERVER_LOG_FILE for details"
  # We don't exit here to allow the client to start anyway
else
  echo "✅ Server is running on http://localhost:3010"
fi

# Start client in background
echo "\n🌐 Building and starting client..."
(cd client/chat-whatsapp-clone && bun install && bun run build && bun run dev) &
CLIENT_PID=$!
echo "✅ Client started with PID: $CLIENT_PID"

echo "\n🎉 Development environment is now running!"
echo "🔍 Server running on http://localhost:3010 (PID: $SERVER_PID)"
echo "🔍 Client running (PID: $CLIENT_PID)"
echo "⚠️  Press Ctrl+C to stop all processes"

# Wait for Ctrl+C and then kill processes
trap "kill $SERVER_PID $CLIENT_PID; rm -f '$SERVER_LOG_FILE'; echo '\n🛑 Stopping all processes...'; exit" INT
wait 