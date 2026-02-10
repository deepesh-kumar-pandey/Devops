#!/bin/bash

# Get the root directory of the project
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Starting Backend Service..."

# Ensure we are in the backend directory
cd "$ROOT_DIR/backend"

# Check if .env exists, if not use .env.example
if [ ! -f .env ]; then
    echo "Warning: .env not found in backend directory. Using .env.example..."
    cp .env.example .env
fi

# Run the backend using uvicorn
# Note: This assumes dependencies are already installed. 
# If not, run 'pip install -r requirements.txt' first.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
