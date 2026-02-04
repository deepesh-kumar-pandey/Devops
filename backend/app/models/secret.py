from sqlalchemy import Column, String, Integer, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class SecretType(str, enum.Enum):
    PASSWORD = "password"
    API_KEY = "api_key"
    SSH_KEY = "ssh_key"
    CERTIFICATE = "certificate"
    TOKEN = "token"
    OTHER = "other"


class Secret(BaseModel):
    __tablename__ = "secrets"
    
    name = Column(String, nullable=False)
    key = Column(String, nullable=False)
    encrypted_value = Column(Text, nullable=False)
    secret_type = Column(Enum(SecretType), default=SecretType.OTHER, nullable=False)
    description = Column(Text, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    project = relationship("Project", back_populates="secrets")
