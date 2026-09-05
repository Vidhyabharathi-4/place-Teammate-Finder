from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    message: str


class ApplicationStatusUpdate(BaseModel):
    status: str


class ApplicationResponse(BaseModel):
    id: int
    team_id: int
    applicant_id: int
    message: str
    status: str
    created_at: datetime

    team_name: Optional[str] = None
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None
    applicant_department: Optional[str] = None
    applicant_year: Optional[int] = None
    applicant_specialization: Optional[str] = None
    applicant_skills: Optional[str] = None
    applicant_profile_picture: Optional[str] = None

    class Config:
        from_attributes = True