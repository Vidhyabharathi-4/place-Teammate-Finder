from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class DirectMessageCreate(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class DirectMessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    message: str
    is_read: bool
    created_at: datetime

    sender_name: Optional[str] = None
    sender_profile_picture: Optional[str] = None
    receiver_name: Optional[str] = None
    receiver_profile_picture: Optional[str] = None

    class Config:
        from_attributes = True


class TeamMessageCreate(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class TeamMessageResponse(BaseModel):
    id: int
    team_id: int
    sender_id: int
    message: str
    created_at: datetime

    sender_name: Optional[str] = None
    sender_profile_picture: Optional[str] = None
    sender_department: Optional[str] = None

    class Config:
        from_attributes = True


class ConversationSummary(BaseModel):
    id: str
    type: str  # 'direct' or 'team'
    target_id: int  # user_id or team_id
    name: str
    avatar: Optional[str] = None
    subtext: Optional[str] = None
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: int = 0
    is_online: Optional[bool] = False
    role: Optional[str] = None


class UnreadCountsResponse(BaseModel):
    total_unread: int
    dm_unread: int
    team_unread: int = 0


class ChatUserResponse(BaseModel):
    id: int
    name: str
    register_number: Optional[str] = None
    college_email: str
    department: Optional[str] = None
    year: Optional[int] = None
    specialization: Optional[str] = None
    skills: Optional[str] = None
    profile_picture: Optional[str] = None
    is_online: Optional[bool] = False

    class Config:
        from_attributes = True
