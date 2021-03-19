# Generated by Django 3.1.5 on 2021-03-19 19:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0004_auto_20210318_1715'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movieactor',
            name='age',
        ),
        migrations.AddField(
            model_name='movieactor',
            name='date_of_birth',
            field=models.DateField(default=datetime.date(1999, 1, 1), verbose_name='дата рождения'),
        ),
    ]
