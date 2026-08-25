from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from app.db.database import Base


class TeamMember(Base):

    __tablename__ = "team_members"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    role = Column(
        String(30),
        nullable=False,
        default="Member"
    )

    joined_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )