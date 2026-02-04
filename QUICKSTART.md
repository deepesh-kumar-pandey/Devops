# Quick Start Guide

Get up and running with DevOps Platform in minutes!

## Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)
- 4GB RAM minimum
- 10GB free disk space

## Installation

### Option 1: Docker Compose (Recommended)

The fastest way to get started:

```bash
# Clone the repository
git clone <your-repo-url>
cd devops

# Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

That's it! The script will:
- Set up environment files
- Build Docker images
- Start all services
- Initialize the database

### Option 2: Manual Docker Compose

```bash
# 1. Set up environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Start services
docker-compose up -d

# 3. Wait for services to be ready (about 30 seconds)
docker-compose logs -f
```

### Option 3: Local Development

For active development without Docker:

```bash
# Run the dev setup script
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh

# Follow the instructions printed by the script
```

## Access the Application

Once everything is running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## First Steps

### 1. Create Your Account

Navigate to http://localhost:3000 and click "Sign up"

- Enter your email
- Choose a username
- Set a strong password
- Click "Sign up"

### 2. Create an Organization

After logging in:

1. Go to "Organizations" in the sidebar
2. Click "New Organization"
3. Fill in the organization details
4. Click "Create"

### 3. Create Your First Project

1. Go to "Projects"
2. Click "New Project"
3. Fill in project details:
   - Name: My First Project
   - Select your organization
   - Optional: Add repository URL
4. Click "Create"

### 4. Set Up a Pipeline

1. Go to "Pipelines"
2. Click "New Pipeline"
3. Configure your pipeline:
   - Name: Build and Test
   - Select your project
   - Add description
4. Click "Create"
5. Click "Run" to execute the pipeline

### 5. Deploy Your Application

1. Go to "Deployments"
2. Click "New Deployment"
3. Fill in deployment details:
   - Select project
   - Choose environment (dev/staging/prod)
   - Set version
   - Optional: Add commit SHA and image tag
4. Click "Deploy"

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Database Operations

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U devops devops_db

# Run migrations
docker-compose exec backend alembic upgrade head

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "description"
```

### Check Service Status

```bash
# List running containers
docker-compose ps

# Check service health
curl http://localhost:8000/health
```

## Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Check port conflicts
netstat -tulpn | grep -E '3000|8000|5432|6379'

# Clean restart
docker-compose down -v
docker-compose up -d
```

### Database connection errors

```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
sleep 10
docker-compose exec backend alembic upgrade head
```

### Frontend can't connect to backend

1. Check backend is running: `docker-compose ps backend`
2. Verify CORS settings in `backend/.env`
3. Check `frontend/.env` has correct API URL
4. Restart services: `docker-compose restart`

### Out of disk space

```bash
# Clean up Docker
docker system prune -a --volumes

# Remove old images
docker-compose down
docker-compose up -d --build
```

## Next Steps

Now that you're up and running:

1. **Explore the Dashboard**
   - View metrics and activity
   - Monitor your projects

2. **Read the Documentation**
   - Check README.md for detailed features
   - Review API docs at /docs
   - See DEPLOYMENT.md for production setup

3. **Set Up Monitoring**
   - Add servers in "Infrastructure"
   - Configure alerts in "Monitoring"
   - Set up health checks

4. **Integrate with Your Tools**
   - Connect your Git repository
   - Configure webhooks
   - Set up notifications

5. **Customize**
   - Add team members to organization
   - Configure project settings
   - Set up custom pipelines

## Getting Help

- **Documentation**: Check the docs folder
- **API Reference**: http://localhost:8000/docs
- **Issues**: Open an issue on GitHub
- **Security**: See SECURITY.md

## Useful Links

- [Full Documentation](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing](./CONTRIBUTING.md)
- [Security Policy](./SECURITY.md)
- [Changelog](./CHANGELOG.md)

---

**Welcome to DevOps Platform! 🚀**

If you encounter any issues, check the troubleshooting section above or open an issue on GitHub.
