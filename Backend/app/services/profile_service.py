from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.profile import ProfileUpdate


class ProfileService:

    @staticmethod
    def get_profile(
        current_user: User,
        db: Session = None
    ) -> User:
        """
        Return the authenticated user's profile with calculated metrics.
        """
        teams_created = 0
        teams_joined = 0

        if db:
            from app.models.team import Team
            from app.models.team_member import TeamMember

            teams_created = db.query(Team).filter(Team.owner_id == current_user.id).count()
            teams_joined = db.query(TeamMember).filter(TeamMember.user_id == current_user.id).count()

        score = 0
        if current_user.name: score += 10
        if current_user.department: score += 10
        if current_user.year: score += 10
        if current_user.specialization: score += 10
        if current_user.about_me: score += 20
        if current_user.skills: score += 20
        if current_user.github_url: score += 10
        if current_user.linkedin_url: score += 5
        if current_user.portfolio_url: score += 5

        current_user.teams_created = teams_created
        current_user.teams_joined = teams_joined
        current_user.profile_completion = score

        return current_user

    @staticmethod
    def get_user_profile(
        user_id: int,
        db: Session
    ) -> User:
        """
        Return any student's public profile by user ID.
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )
        return ProfileService.get_profile(user, db)

    @staticmethod
    def update_profile(
        current_user: User,
        profile_data: ProfileUpdate,
        db: Session
    ) -> User:
        """
        Update the authenticated user's profile.
        """

        update_data = profile_data.model_dump(
            exclude_unset=True,
            exclude_none=True
        )

        for field, value in update_data.items():
            setattr(current_user, field, value)

        db.commit()
        db.refresh(current_user)

        return current_user