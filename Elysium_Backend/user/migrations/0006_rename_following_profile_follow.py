# Generated by Django 5.0.1 on 2024-02-14 06:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_profile_creation_time_profile_update_time'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='following',
            new_name='follow',
        ),
    ]
