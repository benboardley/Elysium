# Generated by Django 5.0.1 on 2024-02-16 18:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0003_albumpost_playlistpost_songpost'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='title',
            field=models.TextField(blank=True),
        ),
    ]
