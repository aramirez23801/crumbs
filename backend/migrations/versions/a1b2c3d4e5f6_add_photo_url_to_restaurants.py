"""add photo_url to restaurants

Revision ID: a1b2c3d4e5f6
Revises: 72f349541bac
Create Date: 2026-02-25 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '72f349541bac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('restaurants', sa.Column('photo_url', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('restaurants', 'photo_url')
