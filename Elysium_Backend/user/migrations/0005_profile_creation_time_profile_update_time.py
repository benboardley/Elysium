# Generated by Django 5.0.1 on 2024-02-14 06:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_alter_profile_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='creation_time',
            field=models.DateTimeField(auto_now_add=True, default='2024-02-13T12:30:00Z'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='profile',
            name='update_time',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
