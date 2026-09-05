from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TeamCreate(BaseModel):
    team_name: str
    description: str
    required_skills: str
    max_members: int

    category: Optional[str] = None
    hashtags: Optional[str] = None

    event_date: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None


class TeamUpdate(BaseModel):
    team_name: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[str] = None
    max_members: Optional[int] = None

    category: Optional[str] = None
    hashtags: Optional[str] = None

    banner_image: Optional[str] = None

    event_date: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None

    status: Optional[str] = None


class TeamResponse(BaseModel):
    id: int

    team_name: str
    description: str
    required_skills: str

    max_members: int

    owner_id: int

    category: Optional[str] = None
    hashtags: Optional[str] = None
    banner_image: Optional[str] = None

    event_date: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None

    status: str

    created_at: datetime
    updated_at: datetime

    owner_name: Optional[str] = None
    owner_email: Optional[str] = None
    owner_department: Optional[str] = None
    owner_specialization: Optional[str] = None

    current_members: Optional[int] = None
    members_needed: Optional[int] = None

    class Config:
        from_attributes = True