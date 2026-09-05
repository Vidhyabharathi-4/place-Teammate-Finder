from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from app.db.database import Base


class Application(Base):

    __tablename__ = "applications"

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

    applicant_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    message = Column(
        Text,
        nullable=False
    )

    status = Column(
        String(20),
        nullable=False,
        default="Pending"
    )

    reviewed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    reviewed_at = Column(
        DateTime(timezone=True),
        nullable=True
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

    applicant = relationship(
        "User",
        foreign_keys=[applicant_id]
    )

    reviewer = relationship(
        "User",
        foreign_keys=[reviewed_by]
    )

    team = relationship("Team")

    @property
    def team_name(self) -> str | None:
        return self.team.team_name if self.team else None

    @property
    def applicant_name(self) -> str | None:
        return self.applicant.name if self.applicant else None

    @property
    def applicant_email(self) -> str | None:
        return self.applicant.college_email if self.applicant else None

    @property
    def applicant_department(self) -> str | None:
        return self.applicant.department if self.applicant else None

    @property
    def applicant_year(self) -> int | None:
        return self.applicant.year if self.applicant else None

    @property
    def applicant_specialization(self) -> str | None:
        return self.applicant.specialization if self.applicant else None

    @property
    def applicant_skills(self) -> str | None:
        return self.applicant.skills if self.applicant else None

    @property
    def applicant_profile_picture(self) -> str | None:
        return self.applicant.profile_picture if self.applicant else None