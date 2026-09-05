from sqlalchemy.orm import Session

from app.models.user import User

from app.schemas.auth import (
    UserRegister,
    ChangePassword
)

from app.core.security import (
    hash_password,
    verify_password
)

from app.core.jwt_handler import create_access_token


class AuthService:

    @staticmethod
    def register_user(
        user_data: UserRegister,
        db: Session
    ):
        email_clean = user_data.college_email.strip().lower()
        role = (user_data.role or "Student").strip()

        # Email domain validation:
        # Students MUST use a @rathinam.in email address.
        # Staff can use ANY email address (e.g. @gmail.com, @rathinam.in, etc.)
        if role.lower() == "student":
            if not email_clean.endswith("@rathinam.in"):
                raise ValueError(
                    "Student email must end with @rathinam.in"
                )

        existing_email = db.query(User).filter(
            User.college_email == email_clean
        ).first()

        if existing_email:
            raise ValueError(
                "Email already registered"
            )

        existing_register_number = db.query(User).filter(
            User.register_number == user_data.register_number
        ).first()

        if existing_register_number:
            raise ValueError(
                "Register number already exists"
            )

        user = User(
            name=user_data.name,
            register_number=user_data.register_number,
            college_email=email_clean,
            specialization=user_data.specialization,
            role=role,
            password_hash=hash_password(
                user_data.password
            )
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def login_user(
        email: str,
        password: str,
        db: Session
    ):
        email_clean = email.strip().lower()

        user = db.query(User).filter(
            User.college_email == email_clean
        ).first()

        if not user:
            raise ValueError(
                "No account found with this email. Please register first."
            )

        if not verify_password(
            password,
            user.password_hash
        ):
            raise ValueError(
                "Incorrect password. Please try again."
            )

        access_token = create_access_token(
            {
                "sub": user.college_email,
                "user_id": user.id
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    @staticmethod
    def change_password(
        current_user: User,
        password_data: ChangePassword,
        db: Session
    ):

        # Verify current password
        if not verify_password(
            password_data.current_password,
            current_user.password_hash
        ):
            raise ValueError(
                "Current password is incorrect."
            )

        # Check new password confirmation
        if (
            password_data.new_password
            != password_data.confirm_password
        ):
            raise ValueError(
                "New password and Confirm Password do not match."
            )

        # Prevent using the same password
        if verify_password(
            password_data.new_password,
            current_user.password_hash
        ):
            raise ValueError(
                "New password cannot be the same as the current password."
            )

        # Update password
        current_user.password_hash = hash_password(
            password_data.new_password
        )

        db.commit()
        db.refresh(current_user)

        return {
            "message": "Password updated successfully."
        }