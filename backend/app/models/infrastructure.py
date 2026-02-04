from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Boolean, JSON
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class ServerStatus(str, enum.Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    DEGRADED = "degraded"
    MAINTENANCE = "maintenance"


class Server(BaseModel):
    __tablename__ = "servers"
    
    name = Column(String, nullable=False)
    hostname = Column(String, unique=True, nullable=False)
    ip_address = Column(String, nullable=False)
    status = Column(Enum(ServerStatus), default=ServerStatus.ONLINE, nullable=False)
    cpu_cores = Column(Integer, nullable=True)
    memory_gb = Column(Integer, nullable=True)
    disk_gb = Column(Integer, nullable=True)
    os = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    
    # Relationships
    metrics = relationship("Metric", back_populates="server")


class Cluster(BaseModel):
    __tablename__ = "clusters"
    
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # kubernetes, docker-swarm, etc.
    endpoint = Column(String, nullable=False)
    status = Column(Enum(ServerStatus), default=ServerStatus.ONLINE, nullable=False)
    version = Column(String, nullable=True)
    node_count = Column(Integer, nullable=True)
    config = Column(JSON, nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
