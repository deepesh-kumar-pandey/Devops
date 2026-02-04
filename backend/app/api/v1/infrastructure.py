from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.infrastructure import Server, Cluster
from app.schemas.infrastructure import (
    Server as ServerSchema,
    ServerCreate,
    ServerUpdate,
    Cluster as ClusterSchema,
    ClusterCreate,
)

router = APIRouter()


# Server endpoints
@router.post("/servers", response_model=ServerSchema, status_code=status.HTTP_201_CREATED)
async def create_server(
    server_data: ServerCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    server = Server(**server_data.model_dump())
    db.add(server)
    await db.commit()
    await db.refresh(server)
    
    return server


@router.get("/servers", response_model=List[ServerSchema])
async def list_servers(
    organization_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Server)
    if organization_id:
        query = query.where(Server.organization_id == organization_id)
    
    result = await db.execute(query)
    servers = result.scalars().all()
    
    return servers


@router.get("/servers/{server_id}", response_model=ServerSchema)
async def get_server(
    server_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Server).where(Server.id == server_id)
    )
    server = result.scalar_one_or_none()
    
    if not server:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Server not found"
        )
    
    return server


@router.put("/servers/{server_id}", response_model=ServerSchema)
async def update_server(
    server_id: int,
    server_update: ServerUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Server).where(Server.id == server_id)
    )
    server = result.scalar_one_or_none()
    
    if not server:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Server not found"
        )
    
    update_data = server_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(server, field, value)
    
    await db.commit()
    await db.refresh(server)
    
    return server


# Cluster endpoints
@router.post("/clusters", response_model=ClusterSchema, status_code=status.HTTP_201_CREATED)
async def create_cluster(
    cluster_data: ClusterCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    cluster = Cluster(**cluster_data.model_dump())
    db.add(cluster)
    await db.commit()
    await db.refresh(cluster)
    
    return cluster


@router.get("/clusters", response_model=List[ClusterSchema])
async def list_clusters(
    organization_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Cluster)
    if organization_id:
        query = query.where(Cluster.organization_id == organization_id)
    
    result = await db.execute(query)
    clusters = result.scalars().all()
    
    return clusters


@router.get("/clusters/{cluster_id}", response_model=ClusterSchema)
async def get_cluster(
    cluster_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Cluster).where(Cluster.id == cluster_id)
    )
    cluster = result.scalar_one_or_none()
    
    if not cluster:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cluster not found"
        )
    
    return cluster
