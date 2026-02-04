from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from app.models.pipeline import PipelineStatus


class PipelineBase(BaseModel):
    name: str
    description: Optional[str] = None
    config: Dict[str, Any]


class PipelineCreate(PipelineBase):
    project_id: int


class PipelineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None


class Pipeline(PipelineBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PipelineRunBase(BaseModel):
    trigger: Optional[str] = None
    branch: Optional[str] = None
    commit_sha: Optional[str] = None
    commit_message: Optional[str] = None


class PipelineRunCreate(PipelineRunBase):
    pipeline_id: int
    triggered_by: Optional[int] = None


class PipelineRun(PipelineRunBase):
    id: int
    pipeline_id: int
    run_number: int
    status: PipelineStatus
    triggered_by: Optional[int] = None
    duration: Optional[float] = None
    logs_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PipelineStage(BaseModel):
    id: int
    run_id: int
    name: str
    order: int
    status: PipelineStatus
    logs: Optional[str] = None
    duration: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
