from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, HttpUrl


class ProfileResponse(BaseModel):
    id: int
    name: str
    register_number: str
    college_email: EmailStr

    department: Optional[str] = None
    year: Optional[int] = None
    specialization: Optional[str] = None
    role: Optional[str] = "Student"

    about_me: Optional[str] = None
    skills: Optional[str] = None

    github_url: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None
    portfolio_url: Optional[HttpUrl] = None

    profile_picture: Optional[str] = None

    teams_created: Optional[int] = 0
    teams_joined: Optional[int] = 0
    profile_completion: Optional[int] = 0

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    name: Optional[str] = None

    department: Optional[str] = None
    year: Optional[int] = None
    specialization: Optional[str] = None

    about_me: Optional[str] = None
    skills: Optional[str] = None

    github_url: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None
    portfolio_url: Optional[HttpUrl] = None