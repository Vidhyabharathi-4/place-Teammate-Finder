from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class TeamMessage(Base):

    __tablename__ = "team_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id"),
        nullable=False,
        index=True
    )

    sender_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    message = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True
    )

    team = relationship(
        "Team",
        foreign_keys=[team_id]
    )

    sender = relationship(
        "User",
        foreign_keys=[sender_id]
    )

    @property
    def sender_name(self) -> str | None:
        return self.sender.name if self.sender else None

    @property
    def sender_profile_picture(self) -> str | None:
        return self.sender.profile_picture if self.sender else None

    @property
    def sender_department(self) -> str | None:
        return self.sender.department if self.sender else None
