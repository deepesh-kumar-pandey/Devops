from sqlalchemy import Column, String, Integer, ForeignKey, Text, JSON, Index
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class LogEntry(BaseModel):
    __tablename__ = "log_entries"
    
    source = Column(String, nullable=False)  # pipeline, deployment, server, etc.
    source_id = Column(Integer, nullable=False)
    level = Column(String, nullable=False)  # debug, info, warning, error, critical
    message = Column(Text, nullable=False)
    meta = Column("metadata", JSON, nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    
    __table_args__ = (
        Index('idx_log_source', 'source', 'source_id'),
        Index('idx_log_created', 'created_at'),
    )
