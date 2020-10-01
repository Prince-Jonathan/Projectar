"""empty message

Revision ID: 978cad030ad7
Revises: e88787e1b110
Create Date: 2020-09-16 06:50:58.720247

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '978cad030ad7'
down_revision = 'e88787e1b110'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('status', sa.String(length=100), nullable=True))
    op.drop_column('project', 'statuss')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('statuss', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    op.drop_column('project', 'status')
    # ### end Alembic commands ###