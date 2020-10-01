"""empty message

Revision ID: e88787e1b110
Revises: 0d25c2df4a65
Create Date: 2020-09-15 21:48:43.951036

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e88787e1b110'
down_revision = '0d25c2df4a65'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('statuss', sa.String(length=100), nullable=True))
    op.drop_column('project', 'status')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('status', sa.VARCHAR(length=20), autoincrement=False, nullable=True))
    op.drop_column('project', 'statuss')
    # ### end Alembic commands ###