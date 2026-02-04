#!/bin/bash

set -e

echo "======================================"
echo "DevOps Platform - Local Dev Setup"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed"
    exit 1
fi
print_success "Python 3 is installed"

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi
print_success "Node.js is installed"

if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL client not found, but may not be required"
fi

if ! command -v redis-cli &> /dev/null; then
    print_warning "Redis CLI not found, but may not be required"
fi

# Setup backend
echo ""
echo "Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    print_success "Virtual environment created"
fi

echo "Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
print_success "Backend dependencies installed"

if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Created backend/.env"
fi

cd ..

# Setup frontend
echo ""
echo "Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
    print_success "Frontend dependencies installed"
else
    print_warning "node_modules already exists, run 'npm install' to update if needed"
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Created frontend/.env"
fi

cd ..

# Instructions
echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "To start development:"
echo ""
echo "1. Start PostgreSQL and Redis (using Docker):"
echo "   docker-compose up -d postgres redis"
echo ""
echo "2. Start backend (in one terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload"
echo ""
echo "3. Start Celery worker (optional, in another terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   celery -A app.worker worker --loglevel=info"
echo ""
echo "4. Start frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "Access the application:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
print_success "Happy coding!"
