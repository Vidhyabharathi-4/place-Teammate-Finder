from pydantic import BaseModel


class DashboardStats(BaseModel):
    teams_created: int
    teams_joined: int
    pending_applications: int
    accepted_applications: int
    profile_completion: int