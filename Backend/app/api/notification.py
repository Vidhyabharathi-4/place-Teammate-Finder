from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.user import User

from app.dependencies.auth_dependency import (
    get_current_user
)

from app.schemas.notification import (
    NotificationResponse
)

from app.services.notification_service import (
    NotificationService
)

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
)


@router.get(
    "/",
    response_model=list[NotificationResponse]
)
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return NotificationService.get_notifications(
        current_user.id,
        db
    )


@router.get("/unread-count")
def unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    count = NotificationService.unread_count(
        current_user.id,
        db
    )

    return {
        "count": count
    }


@router.put(
    "/{notification_id}/read",
    response_model=NotificationResponse
)
def mark_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    notification = NotificationService.mark_as_read(
        notification_id,
        current_user.id,
        db
    )

    if not notification:

        raise HTTPException(
            status_code=404,
            detail="Notification not found."
        )

    return notification