"""init

Revision ID: a22d31e365e1
Revises: 
Create Date: 2024-10-26 22:51:43.128651

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a22d31e365e1'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('devicehistorys',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('deviceName', sa.String(length=200), nullable=False),
    sa.Column('field', sa.String(length=200), nullable=False),
    sa.Column('type', sa.String(length=100), nullable=False),
    sa.Column('value', sa.String(length=500), nullable=False),
    sa.Column('unit', sa.String(length=10), nullable=True),
    sa.Column('datatime', sa.String(length=20), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('devices',
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('system_name', sa.String(length=200), nullable=False),
    sa.Column('class_device', sa.String(length=200), nullable=False),
    sa.Column('type', sa.String(length=200), nullable=False),
    sa.Column('address', sa.String(length=200), nullable=True),
    sa.Column('token', sa.String(length=200), nullable=True),
    sa.Column('type_command', sa.String(length=200), nullable=True),
    sa.Column('device_polling', sa.Boolean(), nullable=True),
    sa.Column('device_cyclic_polling', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('system_name')
    )
    op.create_table('device_fields',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('address', sa.String(length=200), nullable=True),
    sa.Column('type', sa.String(length=200), nullable=False),
    sa.Column('low', sa.String(length=200), nullable=True),
    sa.Column('high', sa.String(length=200), nullable=True),
    sa.Column('enum_values', sa.String(length=200), nullable=True),
    sa.Column('read_only', sa.Boolean(), nullable=False),
    sa.Column('icon', sa.String(length=200), nullable=True),
    sa.Column('unit', sa.String(length=200), nullable=True),
    sa.Column('entity', sa.String(length=2000), nullable=True),
    sa.Column('virtual_field', sa.Boolean(), nullable=True),
    sa.Column('device', sa.String(length=200), nullable=True),
    sa.ForeignKeyConstraint(['device'], ['devices.system_name'], name='fk_device_fields_devices_system_name_device', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('values',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('datatime', sa.String(length=20), nullable=False),
    sa.Column('value', sa.String(length=500), nullable=False),
    sa.Column('field', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['field'], ['device_fields.id'], name='fk_values_device_fields_id_field', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('values')
    op.drop_table('device_fields')
    op.drop_table('devices')
    op.drop_table('devicehistorys')
    # ### end Alembic commands ###
