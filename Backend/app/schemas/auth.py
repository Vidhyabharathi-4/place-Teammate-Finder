from datetime import datetime

from pydantic import BaseModel
from pydantic import EmailStr


# ----------------------------------
# Register
# ----------------------------------

class UserRegister(BaseModel):
    name: str
    register_number: str
    college_email: EmailStr
    password: str


# ----------------------------------
# Login
# ----------------------------------

class UserLogin(BaseModel):
    college_email: EmailStr
    password: str


# ----------------------------------
# Change Password
# ----------------------------------

class ChangePassword(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str


# ----------------------------------
# Token
# ----------------------------------

class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# ----------------------------------
# User Response
# ----------------------------------

class UserResponse(BaseModel):
    id: int
    name: str
    register_number: str
    college_email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True