from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.organization import Organization, OrganizationMember, MemberRole
from app.schemas.organization import (
    Organization as OrganizationSchema,
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationMember as OrganizationMemberSchema,
    OrganizationMemberCreate,
)

router = APIRouter()


@router.post("", response_model=OrganizationSchema, status_code=status.HTTP_201_CREATED)
async def create_organization(
    org_data: OrganizationCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if organization name is unique
    result = await db.execute(
        select(Organization).where(Organization.name == org_data.name)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization with this name already exists"
        )
    
    # Create organization
    org = Organization(**org_data.model_dump())
    db.add(org)
    await db.flush()
    
    # Add creator as owner
    member = OrganizationMember(
        organization_id=org.id,
        user_id=current_user.id,
        role=MemberRole.OWNER
    )
    db.add(member)
    
    await db.commit()
    await db.refresh(org)
    
    return org


@router.get("", response_model=List[OrganizationSchema])
async def list_organizations(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Get organizations where user is a member
    result = await db.execute(
        select(Organization)
        .join(OrganizationMember)
        .where(OrganizationMember.user_id == current_user.id)
    )
    organizations = result.scalars().all()
    
    return organizations


@router.get("/{org_id}", response_model=OrganizationSchema)
async def get_organization(
    org_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Organization).where(Organization.id == org_id)
    )
    org = result.scalar_one_or_none()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    return org


@router.put("/{org_id}", response_model=OrganizationSchema)
async def update_organization(
    org_id: int,
    org_update: OrganizationUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Organization).where(Organization.id == org_id)
    )
    org = result.scalar_one_or_none()
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    update_data = org_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(org, field, value)
    
    await db.commit()
    await db.refresh(org)
    
    return org


@router.post("/{org_id}/members", response_model=OrganizationMemberSchema, status_code=status.HTTP_201_CREATED)
async def add_organization_member(
    org_id: int,
    member_data: OrganizationMemberCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if member already exists
    result = await db.execute(
        select(OrganizationMember).where(
            (OrganizationMember.organization_id == org_id) &
            (OrganizationMember.user_id == member_data.user_id)
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member"
        )
    
    member = OrganizationMember(
        organization_id=org_id,
        **member_data.model_dump()
    )
    db.add(member)
    await db.commit()
    await db.refresh(member)
    
    return member


@router.get("/{org_id}/members", response_model=List[OrganizationMemberSchema])
async def list_organization_members(
    org_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(OrganizationMember).where(OrganizationMember.organization_id == org_id)
    )
    members = result.scalars().all()
    
    return members
