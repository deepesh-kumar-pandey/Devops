from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    repository_url: Optional[str] = None


class ProjectCreate(ProjectBase):
    organization_id: int


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    repository_url: Optional[str] = None
    is_active: Optional[bool] = None


class Project(ProjectBase):
    id: int
    slug: str
    organization_id: int
    created_by: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
