from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str
    notification_type: str


class NotificationResponse(BaseModel):
    id: int
    user_id: int

    title: str
    message: str

    notification_type: str

    is_read: bool

    created_at: datetime

    class Config:
        from_attributes = True


class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None