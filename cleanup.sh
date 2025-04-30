#!/bin/zsh

# Cleanup script for Node.js/Next.js project submission
# Usage: ./cleanup.sh [--reinstall]
echo "🧹 Starting project cleanup..."

# Display current directory
echo "📂 Cleaning project in: $(pwd)"

# Find and remove node_modules directories
echo "\n🗑️  Removing node_modules directories..."
find . -name "node_modules" -type d -print -exec rm -rf {} +

# Find and remove .next directories (Next.js build outputs)
echo "\n🗑️  Removing Next.js build artifacts..."
find . -name ".next" -type d -print -exec rm -rf {} +

# Find and remove other build artifacts
echo "\n🗑️  Removing other build artifacts..."
find . -name "dist" -type d -print -exec rm -rf {} +
find . -name "build" -type d -print -exec rm -rf {} +

# Find and remove cache directories
echo "\n🗑️  Removing cache directories..."
find . -name ".cache" -type d -print -exec rm -rf {} +

# Find and remove log files
echo "\n🗑️  Removing log files..."
find . -name "*.log" -type f -print -delete
find . -name ".DS_Store" -type f -print -delete

# Remove yarn/npm error logs
echo "\n🗑️  Removing package manager logs..."
find . -name "yarn-error.log" -type f -print -delete
find . -name "npm-debug.log" -type f -print -delete
find . -name "bun-debug.log" -type f -print -delete

# Reinstall dependencies if --reinstall flag is provided
if [[ "$1" == "--reinstall" ]]; then
  echo "\n🔄 Reinstalling dependencies..."
  
  # Reinstall server dependencies
  if [ -d "./server" ]; then
    echo "📦 Installing server dependencies..."
    (cd server && npm install)
  fi
  
  # Reinstall client dependencies
  if [ -d "./client/chat-whatsapp-clone" ]; then
    echo "📦 Installing client dependencies..."
    (cd client/chat-whatsapp-clone && bun install)
  fi
  
  # Reinstall shared dependencies
  if [ -d "./shared" ]; then
    echo "📦 Installing shared dependencies..."
    (cd shared && npm install)
  fi
fi

echo "\n✅ Cleanup completed!"
echo "Your project is now ready for submission."

# Display project size after cleanup
echo "\n📊 Current project size:"
du -sh .

# Display number of files
echo "\n📄 Number of files:"
find . -type f | wc -l