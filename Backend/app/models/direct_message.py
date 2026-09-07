from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class DirectMessage(Base):

    __tablename__ = "direct_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    sender_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    receiver_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    message = Column(
        Text,
        nullable=False
    )

    is_read = Column(
        Boolean,
        default=False,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True
    )

    sender = relationship(
        "User",
        foreign_keys=[sender_id]
    )

    receiver = relationship(
        "User",
        foreign_keys=[receiver_id]
    )

    @property
    def sender_name(self) -> str | None:
        return self.sender.name if self.sender else None

    @property
    def sender_profile_picture(self) -> str | None:
        return self.sender.profile_picture if self.sender else None

    @property
    def receiver_name(self) -> str | None:
        return self.receiver.name if self.receiver else None

    @property
    def receiver_profile_picture(self) -> str | None:
        return self.receiver.profile_picture if self.receiver else None
