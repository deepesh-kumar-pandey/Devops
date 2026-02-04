from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Text, JSON, Float
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class PipelineStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Pipeline(BaseModel):
    __tablename__ = "pipelines"
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    config = Column(JSON, nullable=False)  # Pipeline configuration (stages, steps, etc.)
    
    # Relationships
    project = relationship("Project", back_populates="pipelines")
    runs = relationship("PipelineRun", back_populates="pipeline")


class PipelineRun(BaseModel):
    __tablename__ = "pipeline_runs"
    
    pipeline_id = Column(Integer, ForeignKey("pipelines.id"), nullable=False)
    run_number = Column(Integer, nullable=False)
    status = Column(Enum(PipelineStatus), default=PipelineStatus.PENDING, nullable=False)
    trigger = Column(String, nullable=True)  # manual, webhook, schedule, etc.
    branch = Column(String, nullable=True)
    commit_sha = Column(String, nullable=True)
    commit_message = Column(Text, nullable=True)
    triggered_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    duration = Column(Float, nullable=True)  # Duration in seconds
    logs_url = Column(String, nullable=True)
    
    # Relationships
    pipeline = relationship("Pipeline", back_populates="runs")
    stages = relationship("PipelineStage", back_populates="run")


class PipelineStage(BaseModel):
    __tablename__ = "pipeline_stages"
    
    run_id = Column(Integer, ForeignKey("pipeline_runs.id"), nullable=False)
    name = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    status = Column(Enum(PipelineStatus), default=PipelineStatus.PENDING, nullable=False)
    logs = Column(Text, nullable=True)
    duration = Column(Float, nullable=True)
    
    # Relationships
    run = relationship("PipelineRun", back_populates="stages")
