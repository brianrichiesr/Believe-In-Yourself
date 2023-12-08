"""finish models again

Revision ID: 3375361c4bf3
Revises: d19c06035361
Create Date: 2023-12-07 16:02:08.266050

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3375361c4bf3'
down_revision = 'd19c06035361'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_connections', schema=None) as batch_op:
        batch_op.alter_column('sender_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('receiver_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('reason',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=True)
        batch_op.drop_column('id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_connections', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id', sa.INTEGER(), nullable=True))
        batch_op.alter_column('reason',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=True)
        batch_op.alter_column('receiver_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('sender_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###