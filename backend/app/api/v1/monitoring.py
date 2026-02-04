from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.monitoring import Metric, Alert
from app.schemas.monitoring import (
    Metric as MetricSchema,
    MetricCreate,
    Alert as AlertSchema,
    AlertCreate,
    AlertUpdate,
)

router = APIRouter()


# Metrics endpoints
@router.post("/metrics", response_model=MetricSchema, status_code=status.HTTP_201_CREATED)
async def create_metric(
    metric_data: MetricCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    metric = Metric(**metric_data.model_dump())
    db.add(metric)
    await db.commit()
    await db.refresh(metric)
    
    return metric


@router.get("/metrics", response_model=List[MetricSchema])
async def list_metrics(
    server_id: int = None,
    metric_type: str = None,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Metric).order_by(Metric.created_at.desc()).limit(limit)
    
    if server_id:
        query = query.where(Metric.server_id == server_id)
    if metric_type:
        query = query.where(Metric.metric_type == metric_type)
    
    result = await db.execute(query)
    metrics = result.scalars().all()
    
    return metrics


# Alerts endpoints
@router.post("/alerts", response_model=AlertSchema, status_code=status.HTTP_201_CREATED)
async def create_alert(
    alert_data: AlertCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    alert = Alert(**alert_data.model_dump())
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    
    return alert


@router.get("/alerts", response_model=List[AlertSchema])
async def list_alerts(
    organization_id: int = None,
    status: str = None,
    severity: str = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Alert).order_by(Alert.created_at.desc())
    
    if organization_id:
        query = query.where(Alert.organization_id == organization_id)
    if status:
        query = query.where(Alert.status == status)
    if severity:
        query = query.where(Alert.severity == severity)
    
    result = await db.execute(query)
    alerts = result.scalars().all()
    
    return alerts


@router.get("/alerts/{alert_id}", response_model=AlertSchema)
async def get_alert(
    alert_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Alert).where(Alert.id == alert_id)
    )
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    return alert


@router.put("/alerts/{alert_id}", response_model=AlertSchema)
async def update_alert(
    alert_id: int,
    alert_update: AlertUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Alert).where(Alert.id == alert_id)
    )
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    update_data = alert_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(alert, field, value)
    
    await db.commit()
    await db.refresh(alert)
    
    return alert


@router.post("/alerts/{alert_id}/acknowledge", response_model=AlertSchema)
async def acknowledge_alert(
    alert_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Alert).where(Alert.id == alert_id)
    )
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    from app.models.monitoring import AlertStatus
    alert.status = AlertStatus.ACKNOWLEDGED
    alert.acknowledged_by = current_user.id
    
    await db.commit()
    await db.refresh(alert)
    
    return alert
