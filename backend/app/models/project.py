from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Project(BaseModel):
    __tablename__ = "projects"
    
    name = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    repository_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Foreign Keys
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    organization = relationship("Organization", back_populates="projects")
    created_by_user = relationship("User", back_populates="created_projects")
    pipelines = relationship("Pipeline", back_populates="project")
    deployments = relationship("Deployment", back_populates="project")
    secrets = relationship("Secret", back_populates="project")
