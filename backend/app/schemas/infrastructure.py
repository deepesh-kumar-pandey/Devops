from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from app.models.infrastructure import ServerStatus


class ServerBase(BaseModel):
    name: str
    hostname: str
    ip_address: str
    cpu_cores: Optional[int] = None
    memory_gb: Optional[int] = None
    disk_gb: Optional[int] = None
    os: Optional[str] = None
    tags: Optional[Dict[str, Any]] = None


class ServerCreate(ServerBase):
    organization_id: int


class ServerUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[ServerStatus] = None
    tags: Optional[Dict[str, Any]] = None


class Server(ServerBase):
    id: int
    organization_id: int
    status: ServerStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClusterBase(BaseModel):
    name: str
    type: str
    endpoint: str
    version: Optional[str] = None
    node_count: Optional[int] = None
    config: Optional[Dict[str, Any]] = None


class ClusterCreate(ClusterBase):
    organization_id: int


class Cluster(ClusterBase):
    id: int
    organization_id: int
    status: ServerStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
