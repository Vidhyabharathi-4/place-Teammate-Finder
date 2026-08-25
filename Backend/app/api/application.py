from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth_dependency import get_current_user

from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate
)

from app.services.application_service import ApplicationService

router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"]
)


@router.post(
    "/teams/{team_id}",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED
)
def apply_to_team(
    team_id: int,
    application_data: ApplicationCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ApplicationService.apply_to_team(
        team_id=team_id,
        applicant_id=current_user.id,
        application_data=application_data,
        db=db
    )


@router.get(
    "/teams/{team_id}",
    response_model=list[ApplicationResponse]
)
def get_team_applications(
    team_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ApplicationService.get_team_applications(
        team_id=team_id,
        current_user_id=current_user.id,
        db=db
    )


# NEW ENDPOINT
@router.get(
    "/my",
    response_model=list[ApplicationResponse]
)
def get_my_applications(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ApplicationService.get_my_applications(
        applicant_id=current_user.id,
        db=db
    )


@router.put(
    "/{application_id}",
    response_model=ApplicationResponse
)
def update_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ApplicationService.update_application_status(
        application_id=application_id,
        status_data=status_data,
        current_user_id=current_user.id,
        db=db
    )