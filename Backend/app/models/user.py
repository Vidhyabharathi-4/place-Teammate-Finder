from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import Text
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from app.db.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    register_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    college_email = Column(
        String(150),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    # -----------------------------
    # Profile Information
    # -----------------------------

    department = Column(
        String(100),
        nullable=True
    )

    year = Column(
        Integer,
        nullable=True
    )

    about_me = Column(
        Text,
        nullable=True
    )

    skills = Column(
        String(500),
        nullable=True
    )

    github_url = Column(
        String(255),
        nullable=True
    )

    linkedin_url = Column(
        String(255),
        nullable=True
    )

    portfolio_url = Column(
        String(255),
        nullable=True
    )

    profile_picture = Column(
        String(255),
        nullable=True
    )

    # -----------------------------
    # Version 2 Fields
    # -----------------------------

    profile_completion = Column(
        Integer,
        default=20,
        nullable=False
    )

    last_seen = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    # -----------------------------
    # Timestamps
    # -----------------------------

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