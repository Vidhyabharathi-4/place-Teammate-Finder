from pydantic import BaseModel
from datetime import datetime


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

    class Config:
        from_attributes = True