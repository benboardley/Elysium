# Generated by Django 5.0.1 on 2024-02-26 00:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='song_clip_location',
            field=models.URLField(blank=True, max_length=255, null=True),
        ),
    ]
