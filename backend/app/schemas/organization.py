from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

from app.models.organization import MemberRole


class OrganizationBase(BaseModel):
    name: str
    display_name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    display_name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None


class Organization(OrganizationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrganizationMemberBase(BaseModel):
    user_id: int
    role: MemberRole


class OrganizationMemberCreate(OrganizationMemberBase):
    pass


class OrganizationMember(OrganizationMemberBase):
    id: int
    organization_id: int
    created_at: datetime

    class Config:
        from_attributes = True
