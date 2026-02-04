from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

from app.models.monitoring import MetricType, AlertSeverity, AlertStatus


class MetricBase(BaseModel):
    metric_type: MetricType
    name: str
    value: float
    unit: Optional[str] = None
    tags: Optional[Dict[str, Any]] = None


class MetricCreate(MetricBase):
    server_id: Optional[int] = None


class Metric(MetricBase):
    id: int
    server_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AlertBase(BaseModel):
    title: str
    description: Optional[str] = None
    severity: AlertSeverity
    source: Optional[str] = None
    source_id: Optional[int] = None
    meta: Optional[Dict[str, Any]] = Field(default=None, alias="metadata")

    class Config:
        populate_by_name = True


class AlertCreate(AlertBase):
    organization_id: int


class AlertUpdate(BaseModel):
    status: Optional[AlertStatus] = None
    acknowledged_by: Optional[int] = None
    resolved_by: Optional[int] = None


class Alert(AlertBase):
    id: int
    organization_id: int
    status: AlertStatus
    acknowledged_by: Optional[int] = None
    resolved_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
