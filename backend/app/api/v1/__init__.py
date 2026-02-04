from fastapi import APIRouter

from app.api.v1 import auth, users, organizations, projects, pipelines, deployments, infrastructure, monitoring, websocket

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(organizations.router, prefix="/organizations", tags=["Organizations"])
router.include_router(projects.router, prefix="/projects", tags=["Projects"])
router.include_router(pipelines.router, prefix="/pipelines", tags=["Pipelines"])
router.include_router(deployments.router, prefix="/deployments", tags=["Deployments"])
router.include_router(infrastructure.router, prefix="/infrastructure", tags=["Infrastructure"])
router.include_router(monitoring.router, prefix="/monitoring", tags=["Monitoring"])
router.include_router(websocket.router, tags=["WebSocket"])
