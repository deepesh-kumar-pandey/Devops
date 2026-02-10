#!/bin/bash

# Get the root directory of the project
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Starting Frontend Service..."

# Ensure we are in the frontend directory
cd "$ROOT_DIR/frontend"

# Check if .env exists
if [ ! -f .env ]; then
    echo "Warning: .env not found in frontend directory. Creating basic .env..."
    echo "VITE_API_URL=http://localhost:8000" > .env
    echo "VITE_WS_URL=ws://localhost:8000" >> .env
fi

# Run the frontend using npm
# Note: This assumes 'npm install' has been run.
npm run dev -- --host --port 3000
