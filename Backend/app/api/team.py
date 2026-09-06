from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from typing import Optional

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.user import User

from app.dependencies.auth_dependency import (
    get_current_user
)

from app.schemas.team import (
    TeamCreate,
    TeamUpdate,
    TeamResponse
)

from app.schemas.team_member import (
    TeamMemberResponse
)

from app.services.team_service import TeamService
from app.services.team_member_service import TeamMemberService


router = APIRouter(
    prefix="/api/teams",
    tags=["Teams"]
)


# -------------------------------------------------------
# Create Team
# -------------------------------------------------------

@router.post(
    "",
    response_model=TeamResponse,
    status_code=status.HTTP_201_CREATED
)
@router.post(
    "/",
    response_model=TeamResponse,
    status_code=status.HTTP_201_CREATED
)
def create_team(
    team_data: TeamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return TeamService.create_team(
        team_data=team_data,
        owner_id=current_user.id,
        db=db
    )


# -------------------------------------------------------
# Get All Teams
# -------------------------------------------------------

@router.get(
    "",
    response_model=list[TeamResponse]
)
@router.get(
    "/",
    response_model=list[TeamResponse]
)
def get_all_teams(
    search: Optional[str] = None,
    specialization: Optional[str] = None,
    department: Optional[str] = None,
    year: Optional[int] = None,
    skills: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):

    return TeamService.search_teams(
        search=search,
        specialization=specialization,
        department=department,
        year=year,
        skills=skills,
        category=category,
        status=status,
        db=db
    )


# -------------------------------------------------------
# Get My Teams
# -------------------------------------------------------

@router.get(
    "/my",
    response_model=list[TeamResponse]
)
@router.get(
    "/my/",
    response_model=list[TeamResponse]
)
def get_my_teams(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return TeamService.get_my_teams(
        owner_id=current_user.id,
        db=db
    )


# -------------------------------------------------------
# Get Team Members
# -------------------------------------------------------

@router.get(
    "/{team_id}/members",
    response_model=list[TeamMemberResponse]
)
@router.get(
    "/{team_id}/members/",
    response_model=list[TeamMemberResponse]
)
def get_team_members(
    team_id: int,
    db: Session = Depends(get_db)
):

    return TeamMemberService.get_team_members(
        team_id,
        db
    )


# -------------------------------------------------------
# Get Single Team
# -------------------------------------------------------

@router.get(
    "/{team_id}",
    response_model=TeamResponse
)
@router.get(
    "/{team_id}/",
    response_model=TeamResponse
)
def get_team(
    team_id: int,
    db: Session = Depends(get_db)
):

    team = TeamService.get_team_by_id(
        team_id,
        db
    )

    if not team:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found."
        )

    return team


# -------------------------------------------------------
# Update Team
# -------------------------------------------------------

@router.put(
    "/{team_id}",
    response_model=TeamResponse
)
@router.put(
    "/{team_id}/",
    response_model=TeamResponse
)
def update_team(
    team_id: int,
    team_data: TeamUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    team = TeamService.get_team_by_id(
        team_id,
        db
    )

    if not team:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found."
        )

    if team.owner_id != current_user.id:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this team."
        )

    return TeamService.update_team(
        team=team,
        team_data=team_data,
        db=db
    )


# -------------------------------------------------------
# Delete Team
# -------------------------------------------------------

@router.delete(
    "/{team_id}"
)
@router.delete(
    "/{team_id}/"
)
def delete_team(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    team = TeamService.get_team_by_id(
        team_id,
        db
    )

    if not team:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found."
        )

    if team.owner_id != current_user.id:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this team."
        )

    TeamService.delete_team(
        team=team,
        db=db
    )

    return {
        "success": True,
        "message": "Team deleted successfully."
    }