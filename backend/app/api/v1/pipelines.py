from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.pipeline import Pipeline, PipelineRun, PipelineStatus
from app.schemas.pipeline import (
    Pipeline as PipelineSchema,
    PipelineCreate,
    PipelineUpdate,
    PipelineRun as PipelineRunSchema,
    PipelineRunCreate,
)

router = APIRouter()


@router.post("", response_model=PipelineSchema, status_code=status.HTTP_201_CREATED)
async def create_pipeline(
    pipeline_data: PipelineCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    pipeline = Pipeline(**pipeline_data.model_dump())
    db.add(pipeline)
    await db.commit()
    await db.refresh(pipeline)
    
    return pipeline


@router.get("", response_model=List[PipelineSchema])
async def list_pipelines(
    project_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Pipeline)
    if project_id:
        query = query.where(Pipeline.project_id == project_id)
    
    result = await db.execute(query)
    pipelines = result.scalars().all()
    
    return pipelines


@router.get("/{pipeline_id}", response_model=PipelineSchema)
async def get_pipeline(
    pipeline_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Pipeline).where(Pipeline.id == pipeline_id)
    )
    pipeline = result.scalar_one_or_none()
    
    if not pipeline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pipeline not found"
        )
    
    return pipeline


@router.put("/{pipeline_id}", response_model=PipelineSchema)
async def update_pipeline(
    pipeline_id: int,
    pipeline_update: PipelineUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Pipeline).where(Pipeline.id == pipeline_id)
    )
    pipeline = result.scalar_one_or_none()
    
    if not pipeline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pipeline not found"
        )
    
    update_data = pipeline_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pipeline, field, value)
    
    await db.commit()
    await db.refresh(pipeline)
    
    return pipeline


@router.post("/{pipeline_id}/runs", response_model=PipelineRunSchema, status_code=status.HTTP_201_CREATED)
async def create_pipeline_run(
    pipeline_id: int,
    run_data: PipelineRunCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Get next run number
    result = await db.execute(
        select(func.max(PipelineRun.run_number))
        .where(PipelineRun.pipeline_id == pipeline_id)
    )
    max_run_number = result.scalar() or 0
    
    run = PipelineRun(
        **run_data.model_dump(),
        run_number=max_run_number + 1,
        triggered_by=current_user.id
    )
    db.add(run)
    await db.commit()
    await db.refresh(run)
    
    return run


@router.get("/{pipeline_id}/runs", response_model=List[PipelineRunSchema])
async def list_pipeline_runs(
    pipeline_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(PipelineRun)
        .where(PipelineRun.pipeline_id == pipeline_id)
        .order_by(PipelineRun.run_number.desc())
    )
    runs = result.scalars().all()
    
    return runs


@router.get("/runs/{run_id}", response_model=PipelineRunSchema)
async def get_pipeline_run(
    run_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(PipelineRun).where(PipelineRun.id == run_id)
    )
    run = result.scalar_one_or_none()
    
    if not run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pipeline run not found"
        )
    
    return run
