from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from app.db.database import Base
from app.models.user import User
from app.models.team_member import TeamMember


class Team(Base):

    __tablename__ = "teams"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    team_name = Column(
        String(100),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    required_skills = Column(
        Text,
        nullable=False
    )

    max_members = Column(
        Integer,
        nullable=False
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # -------------------------------
    # New Version 2 Fields
    # -------------------------------

    category = Column(
        String(100),
        nullable=True
    )

    hashtags = Column(
        Text,
        nullable=True
    )

    banner_image = Column(
        String(255),
        nullable=True
    )

    event_date = Column(
        DateTime,
        nullable=True
    )

    registration_deadline = Column(
        DateTime,
        nullable=True
    )

    status = Column(
        String(30),
        nullable=False,
        default="Open"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    owner = relationship("User", foreign_keys=[owner_id])
    members = relationship("TeamMember", backref="team", cascade="all, delete-orphan")

    @property
    def owner_name(self) -> str | None:
        return self.owner.name if self.owner else None

    @property
    def owner_email(self) -> str | None:
        return self.owner.college_email if self.owner else None

    @property
    def owner_department(self) -> str | None:
        return self.owner.department if self.owner else None

    @property
    def owner_specialization(self) -> str | None:
        return self.owner.specialization if self.owner else None

    @property
    def current_members(self) -> int:
        return len(self.members) if self.members else 1

    @property
    def members_needed(self) -> int:
        return max(0, self.max_members - self.current_members)