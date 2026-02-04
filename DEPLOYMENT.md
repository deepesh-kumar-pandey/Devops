# Deployment Guide

This guide covers various deployment options for the DevOps Platform.

## Table of Contents
- [Local Development](#local-development)
- [Docker Compose](#docker-compose)
- [Kubernetes](#kubernetes)
- [Production Considerations](#production-considerations)

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Celery Workers (Optional)

```bash
cd backend
source venv/bin/activate

# Start worker
celery -A app.worker worker --loglevel=info

# Start beat scheduler (in separate terminal)
celery -A app.worker beat --loglevel=info
```

## Docker Compose

The easiest way to run the entire stack:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Clean up (including volumes)
docker-compose down -v
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Kubernetes

### Prerequisites
- Kubernetes cluster (minikube, GKE, EKS, AKS, etc.)
- kubectl configured
- Docker images built and pushed to registry

### Build and Push Images

```bash
# Backend
docker build -t your-registry/devops-backend:latest ./backend
docker push your-registry/devops-backend:latest

# Frontend
docker build -t your-registry/devops-frontend:latest ./frontend
docker push your-registry/devops-frontend:latest
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace devops-platform

# Create secrets
kubectl create secret generic devops-secrets \
  --from-literal=database-url='postgresql://user:pass@postgres-service:5432/devops_db' \
  --from-literal=redis-url='redis://redis-service:6379/0' \
  --from-literal=secret-key='your-secret-key' \
  --from-literal=postgres-password='your-password' \
  -n devops-platform

# Deploy PostgreSQL
kubectl apply -f k8s/postgres.yaml -n devops-platform

# Deploy Redis
kubectl apply -f k8s/redis.yaml -n devops-platform

# Deploy application
kubectl apply -f k8s/deployment.yaml -n devops-platform

# Deploy ingress (optional)
kubectl apply -f k8s/ingress.yaml -n devops-platform

# Check status
kubectl get pods -n devops-platform
kubectl get services -n devops-platform
```

### Scaling

```bash
# Scale backend
kubectl scale deployment devops-backend --replicas=5 -n devops-platform

# Scale frontend
kubectl scale deployment devops-frontend --replicas=3 -n devops-platform
```

## Production Considerations

### Security

1. **Change Default Credentials**
   - Update all default passwords
   - Generate strong SECRET_KEY: `openssl rand -hex 32`
   - Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)

2. **HTTPS/TLS**
   - Use cert-manager for automatic SSL certificates
   - Configure ingress with TLS
   - Update CORS_ORIGINS for your domain

3. **Database**
   - Use managed database service (RDS, Cloud SQL, etc.)
   - Enable automated backups
   - Set up replication for high availability

4. **API Security**
   - Implement rate limiting
   - Add API keys for service-to-service communication
   - Enable audit logging

### Performance

1. **Caching**
   - Redis for session management
   - CDN for static assets
   - Database query optimization

2. **Monitoring**
   - Set up Prometheus + Grafana
   - Configure alerting
   - Application Performance Monitoring (APM)

3. **Database**
   - Connection pooling
   - Read replicas for scaling
   - Regular VACUUM and ANALYZE

### High Availability

1. **Application**
   - Run multiple replicas (minimum 3)
   - Use horizontal pod autoscaling
   - Configure pod disruption budgets

2. **Database**
   - Multi-AZ deployment
   - Automated failover
   - Regular backups

3. **Load Balancing**
   - Use cloud load balancer
   - Health checks
   - Session affinity if needed

### Backup Strategy

```bash
# Database backup
pg_dump -h localhost -U devops devops_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql -h localhost -U devops devops_db < backup.sql
```

### Environment Variables

Production environment variables:

```bash
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379/0
SECRET_KEY=<generated-secret-key>
ENVIRONMENT=production
DEBUG=false
CORS_ORIGINS=https://your-domain.com

# Frontend
VITE_API_URL=https://api.your-domain.com
VITE_WS_URL=wss://api.your-domain.com
```

### Monitoring

1. **Application Metrics**
   - API response times
   - Error rates
   - Request throughput

2. **Infrastructure Metrics**
   - CPU/Memory usage
   - Disk I/O
   - Network traffic

3. **Business Metrics**
   - Pipeline success rate
   - Deployment frequency
   - Alert response time

### Logging

1. **Centralized Logging**
   - Use ELK Stack (Elasticsearch, Logstash, Kibana)
   - Or Loki + Grafana
   - Cloud logging services (CloudWatch, Stackdriver)

2. **Log Levels**
   - Production: INFO and above
   - Development: DEBUG

3. **Log Rotation**
   - Configure log retention policies
   - Archive old logs

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL is correct
   - Verify PostgreSQL is running
   - Check network connectivity

2. **Redis Connection Errors**
   - Verify Redis is running
   - Check REDIS_URL configuration

3. **Frontend Can't Connect to Backend**
   - Check VITE_API_URL is correct
   - Verify CORS settings
   - Check network/firewall rules

4. **Migration Errors**
   - Ensure database is accessible
   - Check for pending migrations: `alembic current`
   - View migration history: `alembic history`

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Check database
psql -h localhost -U devops devops_db -c "SELECT 1"

# Check Redis
redis-cli ping
```

## Updates and Maintenance

### Updating the Application

```bash
# Pull latest code
git pull origin main

# Backend
cd backend
pip install -r requirements.txt
alembic upgrade head

# Frontend
cd frontend
npm install
npm run build

# Restart services
docker-compose restart
# or
kubectl rollout restart deployment/devops-backend -n devops-platform
kubectl rollout restart deployment/devops-frontend -n devops-platform
```

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View current version
alembic current
```

## Support

For issues and questions:
- Check the documentation
- Review logs
- Open an issue on GitHub
