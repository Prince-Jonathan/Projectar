"""empty message

Revision ID: cc89bd523a2d
Revises: 01b016beaed7
Create Date: 2020-10-26 09:08:45.819883

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cc89bd523a2d'
down_revision = '01b016beaed7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('announcement', sa.Column('description', sa.String(length=1000), nullable=False))
    op.drop_column('announcement', 'note')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('announcement', sa.Column('note', sa.VARCHAR(length=1000), autoincrement=False, nullable=False))
    op.drop_column('announcement', 'description')
    # ### end Alembic commands ###
