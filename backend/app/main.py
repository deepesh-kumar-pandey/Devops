from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine
from app.models import base
from app.api.v1 import router as api_router


import redis.asyncio as redis
from fastapi_limiter import FastAPILimiter

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting DevOps Platform...")
    
    # Check for weak secret key
    if settings.SECRET_KEY == "your-secret-key-change-in-production":
        print("⚠️  WARNING: You are using the default weak SECRET_KEY. Please change it in .env for production!")

    # Initialize Rate Limiter
    redis_instance = redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
    await FastAPILimiter.init(redis_instance)

    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(base.Base.metadata.create_all)
    yield
    # Shutdown
    print("👋 Shutting down DevOps Platform...")
    await FastAPILimiter.close()


app = FastAPI(
    title="DevOps Platform API",
    description="Comprehensive DevOps SaaS Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws: wss:;"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return response


# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "DevOps Platform API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return JSONResponse(
        content={
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
        }
    )
