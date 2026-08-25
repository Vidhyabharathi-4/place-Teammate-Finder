from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from app.db.database import Base


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