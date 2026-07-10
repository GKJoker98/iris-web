"""merge lsi and v2.4.27 heads

Reconciles the two Alembic heads that resulted from merging upstream tag
v2.4.27 into the lsi branch:
  - e5d79b8c4a55 (upstream: add custom dashboards tables)
  - 1297c38a1620 (lsi: add binnenmarkt)

Revision ID: 91b57830a613
Revises: e5d79b8c4a55, 1297c38a1620
Create Date: 2026-07-10 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '91b57830a613'
down_revision = ('e5d79b8c4a55', '1297c38a1620')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
