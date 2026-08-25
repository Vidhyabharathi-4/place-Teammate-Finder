from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.team import Team
from app.models.team_member import TeamMember
from app.schemas.team import TeamCreate, TeamUpdate


class TeamService:

    @staticmethod
    def create_team(
        team_data: TeamCreate,
        owner_id: int,
        db: Session
    ):

        team = Team(
            team_name=team_data.team_name,
            description=team_data.description,
            required_skills=team_data.required_skills,
            max_members=team_data.max_members,
            owner_id=owner_id,
            category=team_data.category,
            hashtags=team_data.hashtags,
            event_date=team_data.event_date,
            registration_deadline=team_data.registration_deadline
        )

        db.add(team)
        db.commit()
        db.refresh(team)

        # Add team owner as the first member
        owner_member = TeamMember(
            team_id=team.id,
            user_id=owner_id,
            role="Owner"
        )

        db.add(owner_member)
        db.commit()

        return team

    @staticmethod
    def get_all_teams(db: Session):

        return (
            db.query(Team)
            .order_by(Team.created_at.desc())
            .all()
        )

    @staticmethod
    def get_my_teams(
        owner_id: int,
        db: Session
    ):

        return (
            db.query(Team)
            .filter(Team.owner_id == owner_id)
            .order_by(Team.created_at.desc())
            .all()
        )

    @staticmethod
    def get_team_by_id(
        team_id: int,
        db: Session
    ):

        return (
            db.query(Team)
            .filter(Team.id == team_id)
            .first()
        )

    @staticmethod
    def update_team(
        team: Team,
        team_data: TeamUpdate,
        db: Session
    ):

        update_data = team_data.model_dump(
            exclude_unset=True,
            exclude_none=True
        )

        for field, value in update_data.items():
            setattr(team, field, value)

        db.commit()
        db.refresh(team)

        return team

    @staticmethod
    def delete_team(
        team: Team,
        db: Session
    ):

        db.delete(team)
        db.commit()

    @staticmethod
    def search_teams(
        search: str,
        category: str | None,
        status: str | None,
        db: Session
    ):

        query = db.query(Team)

        if search:
            query = query.filter(
                or_(
                    Team.team_name.ilike(f"%{search}%"),
                    Team.required_skills.ilike(f"%{search}%"),
                    Team.description.ilike(f"%{search}%"),
                    Team.hashtags.ilike(f"%{search}%")
                )
            )

        if category:
            query = query.filter(
                Team.category == category
            )

        if status:
            query = query.filter(
                Team.status == status
            )

        return (
            query
            .order_by(Team.created_at.desc())
            .all()
        )