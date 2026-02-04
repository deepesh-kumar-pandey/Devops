#!/bin/bash

set -e

echo "======================================"
echo "DevOps Platform Setup Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_success "Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_success "Docker Compose is installed"

# Create necessary directories
echo ""
echo "Creating necessary directories..."
mkdir -p backend/alembic/versions
mkdir -p frontend/public
mkdir -p scripts
mkdir -p k8s
print_success "Directories created"

# Copy environment files if they don't exist
echo ""
echo "Setting up environment files..."

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        print_success "Created .env from .env.example"
    else
        print_warning ".env.example not found, creating basic .env"
        cat > .env << EOF
DATABASE_URL=postgresql://devops:devops123@postgres:5432/devops_db
REDIS_URL=redis://redis:6379/0
SECRET_KEY=$(openssl rand -hex 32)
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
EOF
        print_success "Created .env file"
    fi
else
    print_warning ".env already exists, skipping"
fi

if [ ! -f backend/.env ]; then
    if [ -f backend/.env.example ]; then
        cp backend/.env.example backend/.env
        print_success "Created backend/.env from backend/.env.example"
    fi
fi

if [ ! -f frontend/.env ]; then
    if [ -f frontend/.env.example ]; then
        cp frontend/.env.example frontend/.env
        print_success "Created frontend/.env from frontend/.env.example"
    fi
fi

# Build and start services
echo ""
echo "Building Docker images..."
docker-compose build
print_success "Docker images built successfully"

echo ""
echo "Starting services..."
docker-compose up -d postgres redis
print_success "Database and Redis started"

echo ""
echo "Waiting for database to be ready..."
sleep 10

echo ""
echo "Starting application services..."
docker-compose up -d backend celery_worker celery_beat frontend
print_success "All services started"

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Services are now running:"
echo "  - Frontend:  http://localhost:3000"
echo "  - Backend:   http://localhost:8000"
echo "  - API Docs:  http://localhost:8000/docs"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
echo "To restart services:"
echo "  docker-compose restart"
echo ""
print_success "Happy coding!"
