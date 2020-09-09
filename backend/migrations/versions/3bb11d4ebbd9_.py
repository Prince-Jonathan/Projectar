"""empty message

Revision ID: 3bb11d4ebbd9
Revises: e91eb82851d4
Create Date: 2020-09-06 21:25:03.300336

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3bb11d4ebbd9'
down_revision = 'e91eb82851d4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('register', sa.Column('t_and_t', sa.Float(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('register', 't_and_t')
    # ### end Alembic commands ###