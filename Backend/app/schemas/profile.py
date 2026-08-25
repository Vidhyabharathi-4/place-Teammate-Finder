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

    about_me: Optional[str] = None
    skills: Optional[str] = None

    github_url: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None
    portfolio_url: Optional[HttpUrl] = None

    profile_picture: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    name: Optional[str] = None

    department: Optional[str] = None
    year: Optional[int] = None

    about_me: Optional[str] = None
    skills: Optional[str] = None

    github_url: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None
    portfolio_url: Optional[HttpUrl] = None