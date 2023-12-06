"""update migration again

Revision ID: b90210371593
Revises: e7d725b645d0
Create Date: 2023-12-06 14:11:06.609118

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b90210371593'
down_revision = 'e7d725b645d0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_connections',
    sa.Column('sender_id', sa.Integer(), nullable=False),
    sa.Column('receiver_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('reason', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], name=op.f('fk_user_connections_receiver_id_users')),
    sa.ForeignKeyConstraint(['sender_id'], ['users.id'], name=op.f('fk_user_connections_sender_id_users')),
    sa.PrimaryKeyConstraint('sender_id', 'receiver_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_connections')
    # ### end Alembic commands ###
