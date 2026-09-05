import os
import shutil
import uuid

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import UploadFile
from fastapi import File
from fastapi import status

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.user import User

from app.schemas.profile import (
    ProfileResponse,
    ProfileUpdate
)

from app.services.profile_service import ProfileService

from app.dependencies.auth_dependency import (
    get_current_user
)

router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)


@router.get(
    "",
    response_model=ProfileResponse
)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ProfileService.get_profile(
        current_user,
        db
    )


@router.put(
    "",
    response_model=ProfileResponse,
    status_code=status.HTTP_200_OK
)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:

        updated_user = ProfileService.update_profile(
            current_user=current_user,
            profile_data=profile_data,
            db=db
        )

        return updated_user

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ----------------------------------------------------
# Upload Profile Picture
# ----------------------------------------------------

@router.post(
    "/upload-photo",
    response_model=ProfileResponse
)
def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    allowed_extensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ]

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed."
        )

    upload_folder = "uploads/profile"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        upload_folder,
        filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    current_user.profile_picture = f"/uploads/profile/{filename}"

    db.commit()
    db.refresh(current_user)

    return current_user