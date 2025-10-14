"""please dont

Revision ID: 312bb8a06885
Revises: 9e4947a207a6
Create Date: 2024-05-05 15:38:33.215788

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

from app.alembic.alembic_utils import _table_has_column

revision = '312bb8a06885'
down_revision = '9e4947a207a6'
branch_labels = None
depends_on = None

def upgrade():
    # Add the state_id column to the cases table

    if not _table_has_column('client', 'client_search_terms'):
        op.add_column(
            'client',
            sa.Column('client_search_terms', sa.Text())
        )
    pass

def downgrade():
    pass
