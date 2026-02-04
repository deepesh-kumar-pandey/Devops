# Installation Test Checklist

Use this checklist to verify your DevOps Platform installation.

## Pre-Installation Checks

- [ ] Docker installed: `docker --version`
- [ ] Docker Compose installed: `docker-compose --version`
- [ ] Git installed: `git --version`
- [ ] Minimum 4GB RAM available
- [ ] Minimum 10GB disk space available

## Installation Steps

- [ ] Repository cloned
- [ ] Environment files created (.env, backend/.env, frontend/.env)
- [ ] Docker images built successfully
- [ ] All containers started

## Service Health Checks

### PostgreSQL
```bash
docker-compose exec postgres pg_isready -U devops
# Expected: postgres:5432 - accepting connections
```
- [ ] PostgreSQL is running and accepting connections

### Redis
```bash
docker-compose exec redis redis-cli ping
# Expected: PONG
```
- [ ] Redis is running and responding

### Backend API
```bash
curl -s http://localhost:8000/health | jq
# Expected: {"status":"healthy","environment":"development"}
```
- [ ] Backend API is accessible
- [ ] Health endpoint returns healthy status

### Frontend
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200
```
- [ ] Frontend is accessible
- [ ] Returns HTTP 200

## Functional Tests

### 1. User Registration
- [ ] Navigate to http://localhost:3000
- [ ] Click "Sign up"
- [ ] Fill in registration form
- [ ] Submit successfully
- [ ] Redirected to login page

### 2. User Login
- [ ] Enter credentials
- [ ] Click "Sign in"
- [ ] Successfully logged in
- [ ] Redirected to dashboard

### 3. Dashboard Access
- [ ] Dashboard loads successfully
- [ ] Stats cards are visible
- [ ] Charts are rendering
- [ ] No console errors

### 4. Organization Creation
- [ ] Navigate to Organizations
- [ ] Click "New Organization"
- [ ] Fill in form
- [ ] Submit successfully
- [ ] Organization appears in list

### 5. Project Creation
- [ ] Navigate to Projects
- [ ] Click "New Project"
- [ ] Select organization
- [ ] Fill in form
- [ ] Submit successfully
- [ ] Project appears in list

### 6. Pipeline Creation
- [ ] Navigate to Pipelines
- [ ] Click "New Pipeline"
- [ ] Select project
- [ ] Fill in form
- [ ] Submit successfully
- [ ] Pipeline appears in list

### 7. API Documentation
- [ ] Navigate to http://localhost:8000/docs
- [ ] Swagger UI loads
- [ ] Can expand endpoints
- [ ] Try out authentication endpoints

## Database Verification

```bash
docker-compose exec postgres psql -U devops devops_db -c "\dt"
# Expected: List of tables including users, organizations, projects, etc.
```
- [ ] All database tables created
- [ ] No migration errors

## Container Status

```bash
docker-compose ps
# All services should be "Up"
```
- [ ] devops_postgres - Up
- [ ] devops_redis - Up
- [ ] devops_backend - Up
- [ ] devops_frontend - Up
- [ ] devops_celery_worker - Up
- [ ] devops_celery_beat - Up

## Log Verification

```bash
docker-compose logs backend | tail -20
# Should show startup messages without errors
```
- [ ] No error messages in backend logs
- [ ] Application started successfully

```bash
docker-compose logs frontend | tail -20
# Should show Vite dev server running
```
- [ ] No error messages in frontend logs
- [ ] Vite server running

## Performance Checks

- [ ] Dashboard loads in < 2 seconds
- [ ] API responses in < 500ms
- [ ] No memory leaks after 5 minutes
- [ ] CPU usage stable

## Clean Up Test

```bash
docker-compose down -v
docker-compose up -d
# Wait 30 seconds
curl http://localhost:8000/health
```
- [ ] Services restart successfully
- [ ] Data persistence works (for non-volume cleanup)

## Troubleshooting

If any check fails:

1. Check logs: `docker-compose logs [service]`
2. Verify environment files exist and are correct
3. Check port conflicts: `netstat -tulpn | grep -E '3000|8000|5432|6379'`
4. Restart services: `docker-compose restart`
5. Clean restart: `docker-compose down -v && docker-compose up -d`

## Success Criteria

✅ All pre-installation checks pass
✅ All containers are running
✅ All health checks pass
✅ Can register and login
✅ Can create organization and project
✅ Dashboard displays correctly
✅ API documentation accessible
✅ No errors in logs

## Installation Complete! 🎉

If all checks pass, your DevOps Platform is successfully installed and ready to use!

Next steps:
1. Read QUICKSTART.md for usage guide
2. Check DEPLOYMENT.md for production deployment
3. Review SECURITY.md for security best practices
4. Start building your DevOps workflows!
