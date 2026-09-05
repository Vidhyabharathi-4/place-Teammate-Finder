from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.auth import (
    UserRegister,
    TokenResponse,
    UserResponse,
    ChangePassword
)

from app.services.auth_service import AuthService

from app.dependencies.auth_dependency import (
    get_current_user
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    try:

        user = AuthService.register_user(
            user_data,
            db
        )

        return user

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        token = AuthService.login_user(
            form_data.username,
            form_data.password,
            db
        )
        return token
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user=Depends(get_current_user)
):
    return current_user


# -----------------------------------------
# Change Password
# -----------------------------------------

@router.put(
    "/change-password"
)
def change_password(
    password_data: ChangePassword,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:

        return AuthService.change_password(
            current_user=current_user,
            password_data=password_data,
            db=db
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )