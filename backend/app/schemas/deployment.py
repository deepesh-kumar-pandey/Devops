from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from app.models.deployment import DeploymentStatus, DeploymentEnvironment


class DeploymentBase(BaseModel):
    environment: DeploymentEnvironment
    version: str
    commit_sha: Optional[str] = None
    image_tag: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None


class DeploymentCreate(DeploymentBase):
    project_id: int
    deployed_by: Optional[int] = None


class DeploymentUpdate(BaseModel):
    status: Optional[DeploymentStatus] = None
    notes: Optional[str] = None


class Deployment(DeploymentBase):
    id: int
    project_id: int
    status: DeploymentStatus
    deployed_by: Optional[int] = None
    rollback_to_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
