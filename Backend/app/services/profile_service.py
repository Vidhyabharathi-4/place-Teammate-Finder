from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.profile import ProfileUpdate


class ProfileService:

    @staticmethod
    def get_profile(
        current_user: User
    ) -> User:
        """
        Return the authenticated user's profile.
        """
        return current_user

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