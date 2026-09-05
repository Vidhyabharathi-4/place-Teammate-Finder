from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.user import User


class TeamMemberService:

    @staticmethod
    def get_team_members(
        team_id: int,
        db: Session
    ):

        team = db.query(Team).filter(
            Team.id == team_id
        ).first()

        if not team:
            raise HTTPException(
                status_code=404,
                detail="Team not found."
            )

        members = (
            db.query(TeamMember, User)
            .join(User, TeamMember.user_id == User.id)
            .filter(TeamMember.team_id == team_id)
            .all()
        )

        result = []

        for member, user in members:

            result.append({

                "id": member.id,
                "user_id": user.id,
                "name": user.name,
                "college_email": user.college_email,
                "department": user.department,
                "year": user.year,
                "specialization": user.specialization,
                "skills": user.skills,
                "profile_picture": user.profile_picture,
                "role": member.role,
                "joined_at": member.joined_at

            })

        return result