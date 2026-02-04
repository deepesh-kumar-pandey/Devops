from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.deployment import Deployment, DeploymentStatus
from app.schemas.deployment import (
    Deployment as DeploymentSchema,
    DeploymentCreate,
    DeploymentUpdate,
)

router = APIRouter()


@router.post("", response_model=DeploymentSchema, status_code=status.HTTP_201_CREATED)
async def create_deployment(
    deployment_data: DeploymentCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    deployment = Deployment(
        **deployment_data.model_dump(),
        deployed_by=current_user.id
    )
    db.add(deployment)
    await db.commit()
    await db.refresh(deployment)
    
    return deployment


@router.get("", response_model=List[DeploymentSchema])
async def list_deployments(
    project_id: int = None,
    environment: str = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Deployment)
    if project_id:
        query = query.where(Deployment.project_id == project_id)
    if environment:
        query = query.where(Deployment.environment == environment)
    
    query = query.order_by(Deployment.created_at.desc())
    result = await db.execute(query)
    deployments = result.scalars().all()
    
    return deployments


@router.get("/{deployment_id}", response_model=DeploymentSchema)
async def get_deployment(
    deployment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Deployment).where(Deployment.id == deployment_id)
    )
    deployment = result.scalar_one_or_none()
    
    if not deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deployment not found"
        )
    
    return deployment


@router.put("/{deployment_id}", response_model=DeploymentSchema)
async def update_deployment(
    deployment_id: int,
    deployment_update: DeploymentUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Deployment).where(Deployment.id == deployment_id)
    )
    deployment = result.scalar_one_or_none()
    
    if not deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deployment not found"
        )
    
    update_data = deployment_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(deployment, field, value)
    
    await db.commit()
    await db.refresh(deployment)
    
    return deployment


@router.post("/{deployment_id}/rollback", response_model=DeploymentSchema)
async def rollback_deployment(
    deployment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Deployment).where(Deployment.id == deployment_id)
    )
    deployment = result.scalar_one_or_none()
    
    if not deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deployment not found"
        )
    
    # Create new deployment with rollback reference
    new_deployment = Deployment(
        project_id=deployment.project_id,
        environment=deployment.environment,
        version=deployment.version,
        status=DeploymentStatus.PENDING,
        deployed_by=current_user.id,
        commit_sha=deployment.commit_sha,
        image_tag=deployment.image_tag,
        config=deployment.config,
        rollback_to_id=deployment.id,
        notes=f"Rollback from deployment #{deployment.id}"
    )
    
    db.add(new_deployment)
    await db.commit()
    await db.refresh(new_deployment)
    
    return new_deployment
