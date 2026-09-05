from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_teams: int
    teams_created: int
    teams_joined: int
    pending_applications: int
    accepted_applications: int
    profile_completion: int


class DashboardEvent(BaseModel):
    id: int
    title: str
    date: str
    category: Optional[str] = "Hackathon"
    description: Optional[str] = None
    team_id: Optional[int] = None