from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TeamMemberResponse(BaseModel):
    id: int
    user_id: int
    name: str
    college_email: str
    department: Optional[str] = None
    year: Optional[int] = None
    specialization: Optional[str] = None
    skills: Optional[str] = None
    profile_picture: Optional[str] = None
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True