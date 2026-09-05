"""add specialization to users

Revision ID: e718b2c45d67
Revises: c151ade72610
Create Date: 2026-09-02 14:38:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e718b2c45d67'
down_revision: Union[str, Sequence[str], None] = 'c151ade72610'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('specialization', sa.String(length=100), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'specialization')
