from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class DeploymentStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    SUCCESS = "success"
    FAILED = "failed"
    ROLLED_BACK = "rolled_back"


class DeploymentEnvironment(str, enum.Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class Deployment(BaseModel):
    __tablename__ = "deployments"
    
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    environment = Column(Enum(DeploymentEnvironment), nullable=False)
    version = Column(String, nullable=False)
    status = Column(Enum(DeploymentStatus), default=DeploymentStatus.PENDING, nullable=False)
    deployed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    commit_sha = Column(String, nullable=True)
    image_tag = Column(String, nullable=True)
    config = Column(JSON, nullable=True)  # Deployment configuration
    rollback_to_id = Column(Integer, ForeignKey("deployments.id"), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    project = relationship("Project", back_populates="deployments")
