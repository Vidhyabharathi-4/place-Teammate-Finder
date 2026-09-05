from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.user import User
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
        search: str | None = None,
        specialization: str | None = None,
        department: str | None = None,
        year: int | None = None,
        skills: str | None = None,
        category: str | None = None,
        status: str | None = None,
        db: Session = None
    ):

        query = db.query(Team)

        # 1. Search text filter across team_name, description, required_skills, hashtags
        if search and search.strip():
            search_term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Team.team_name.ilike(search_term),
                    Team.required_skills.ilike(search_term),
                    Team.description.ilike(search_term),
                    Team.hashtags.ilike(search_term)
                )
            )

        # 2. Specialization filter (Owner or Member specialization)
        if (
            specialization
            and specialization.strip()
            and specialization.strip() != "All Specializations"
        ):
            spec_val = specialization.strip()
            owner_has_spec = Team.owner_id.in_(
                db.query(User.id).filter(User.specialization == spec_val)
            )
            member_has_spec = Team.id.in_(
                db.query(TeamMember.team_id)
                .join(User, TeamMember.user_id == User.id)
                .filter(User.specialization == spec_val)
            )
            query = query.filter(or_(owner_has_spec, member_has_spec))

        # 3. Department filter
        if (
            department
            and department.strip()
            and department.strip() != "All Departments"
        ):
            dept_term = f"%{department.strip()}%"
            owner_has_dept = Team.owner_id.in_(
                db.query(User.id).filter(User.department.ilike(dept_term))
            )
            member_has_dept = Team.id.in_(
                db.query(TeamMember.team_id)
                .join(User, TeamMember.user_id == User.id)
                .filter(User.department.ilike(dept_term))
            )
            query = query.filter(or_(owner_has_dept, member_has_dept))

        # 4. Year filter
        if year is not None:
            owner_has_year = Team.owner_id.in_(
                db.query(User.id).filter(User.year == year)
            )
            member_has_year = Team.id.in_(
                db.query(TeamMember.team_id)
                .join(User, TeamMember.user_id == User.id)
                .filter(User.year == year)
            )
            query = query.filter(or_(owner_has_year, member_has_year))

        # 5. Skills filter
        if skills and skills.strip():
            skill_term = f"%{skills.strip()}%"
            team_has_skill = Team.required_skills.ilike(skill_term)
            member_has_skill = Team.id.in_(
                db.query(TeamMember.team_id)
                .join(User, TeamMember.user_id == User.id)
                .filter(User.skills.ilike(skill_term))
            )
            owner_has_skill = Team.owner_id.in_(
                db.query(User.id).filter(User.skills.ilike(skill_term))
            )
            query = query.filter(or_(team_has_skill, member_has_skill, owner_has_skill))

        # 6. Category filter
        if (
            category
            and category.strip()
            and category.strip() != "All Categories"
        ):
            query = query.filter(
                Team.category == category.strip()
            )

        # 7. Status filter
        if (
            status
            and status.strip()
            and status.strip() != "All"
        ):
            query = query.filter(
                Team.status == status.strip()
            )

        return (
            query
            .order_by(Team.created_at.desc())
            .all()
        )