"""add role to users

Revision ID: f829c3d14e78
Revises: e718b2c45d67
Create Date: 2026-09-02 14:48:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f829c3d14e78'
down_revision: Union[str, Sequence[str], None] = 'e718b2c45d67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('role', sa.String(length=50), nullable=False, server_default='Student'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'role')
