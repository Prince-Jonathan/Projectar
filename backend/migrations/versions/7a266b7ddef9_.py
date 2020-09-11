"""empty message

Revision ID: 7a266b7ddef9
Revises: 9290843e677f
Create Date: 2020-09-11 08:26:27.242029

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7a266b7ddef9'
down_revision = '9290843e677f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('register', sa.Column('time_in', sa.Time(), nullable=True))
    op.add_column('register', sa.Column('time_out', sa.Time(), nullable=True))
    op.drop_column('register', 'sign_in')
    op.drop_column('register', 'sign_out')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('register', sa.Column('sign_out', postgresql.TIME(), autoincrement=False, nullable=True))
    op.add_column('register', sa.Column('sign_in', postgresql.TIME(), autoincrement=False, nullable=True))
    op.drop_column('register', 'time_out')
    op.drop_column('register', 'time_in')
    # ### end Alembic commands ###
