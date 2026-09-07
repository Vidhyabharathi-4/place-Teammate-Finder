"""create chat tables

Revision ID: e8a1b2c3d4e5
Revises: c151ade72610
Create Date: 2026-09-07 11:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e8a1b2c3d4e5'
down_revision: Union[str, Sequence[str], None] = 'c151ade72610'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Direct Messages Table
    op.create_table(
        'direct_messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sender_id', sa.Integer(), nullable=False),
        sa.Column('receiver_id', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), server_default=sa.text('false'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_direct_messages_id'), 'direct_messages', ['id'], unique=False)
    op.create_index(op.f('ix_direct_messages_sender_id'), 'direct_messages', ['sender_id'], unique=False)
    op.create_index(op.f('ix_direct_messages_receiver_id'), 'direct_messages', ['receiver_id'], unique=False)
    op.create_index(op.f('ix_direct_messages_created_at'), 'direct_messages', ['created_at'], unique=False)

    # 2. Team Messages Table
    op.create_table(
        'team_messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('team_id', sa.Integer(), nullable=False),
        sa.Column('sender_id', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_team_messages_id'), 'team_messages', ['id'], unique=False)
    op.create_index(op.f('ix_team_messages_team_id'), 'team_messages', ['team_id'], unique=False)
    op.create_index(op.f('ix_team_messages_sender_id'), 'team_messages', ['sender_id'], unique=False)
    op.create_index(op.f('ix_team_messages_created_at'), 'team_messages', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_table('team_messages')
    op.drop_table('direct_messages')
