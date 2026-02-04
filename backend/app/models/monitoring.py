from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Float, Boolean, Text, JSON
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class MetricType(str, enum.Enum):
    CPU = "cpu"
    MEMORY = "memory"
    DISK = "disk"
    NETWORK = "network"
    CUSTOM = "custom"


class AlertSeverity(str, enum.Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class AlertStatus(str, enum.Enum):
    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"


class Metric(BaseModel):
    __tablename__ = "metrics"
    
    server_id = Column(Integer, ForeignKey("servers.id"), nullable=True)
    metric_type = Column(Enum(MetricType), nullable=False)
    name = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)
    
    # Relationships
    server = relationship("Server", back_populates="metrics")


class Alert(BaseModel):
    __tablename__ = "alerts"
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(Enum(AlertSeverity), default=AlertSeverity.INFO, nullable=False)
    status = Column(Enum(AlertStatus), default=AlertStatus.ACTIVE, nullable=False)
    source = Column(String, nullable=True)  # server, pipeline, deployment, etc.
    source_id = Column(Integer, nullable=True)
    acknowledged_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    meta = Column("metadata", JSON, nullable=True)
