# DevOps Platform SaaS

A comprehensive DevOps platform for managing CI/CD pipelines, infrastructure monitoring, deployments, and more.

## Features

### Core DevOps Features

- **CI/CD Pipeline Management** - Create, manage, and monitor build pipelines
- **Infrastructure Monitoring** - Real-time metrics and health checks
- **Container Orchestration** - Kubernetes and Docker management
- **Deployment Tracking** - Track deployments with rollback capabilities
- **Log Aggregation** - Centralized logging and analysis
- **Secret Management** - Secure credential storage and rotation
- **Security Scanning** - Vulnerability detection and compliance checks
- **Alert Management** - Configure alerts and notifications

### Platform Features

- Multi-tenancy with organizations and teams
- Role-based access control (RBAC)
- Real-time WebSocket updates
- RESTful API with comprehensive documentation
- Modern, responsive UI with dark mode
- Audit logging and compliance tracking

## Tech Stack

### Backend

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **Celery** - Background task processing
- **WebSockets** - Real-time updates

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **React Query** - Server state management
- **React Router** - Navigation
- **Zustand** - Client state management

## Project Structure

```
devops/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Core configuration
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── main.py      # Application entry
│   ├── alembic/         # Database migrations
│   ├── tests/           # Backend tests
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   ├── store/       # State management
│   │   └── App.tsx      # Root component
│   ├── public/
│   └── package.json
├── docker/              # Docker configurations
├── k8s/                 # Kubernetes manifests
└── docker-compose.yml   # Local development setup
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Development Setup

1. Clone and enter the repository
2. Start services with Docker Compose:

```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Manual Setup

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

Interactive API documentation is available at `/docs` (Swagger UI) and `/redoc` (ReDoc).

## Environment Variables

See `.env.example` files in backend and frontend directories for required configuration.

## License

Distributed under the [MIT License](LICENSE). See `LICENSE` for more information.
