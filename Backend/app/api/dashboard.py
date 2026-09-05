from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.user import User

from app.dependencies.auth_dependency import (
    get_current_user
)

from app.schemas.dashboard import (
    DashboardStats,
    DashboardEvent
)

from app.services.dashboard_service import (
    DashboardService
)

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/stats",
    response_model=DashboardStats
)
def dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return DashboardService.get_dashboard_stats(
        current_user,
        db
    )


@router.get(
    "/events",
    response_model=list[DashboardEvent]
)
def dashboard_events(
    db: Session = Depends(get_db)
):
    return DashboardService.get_upcoming_events(db)