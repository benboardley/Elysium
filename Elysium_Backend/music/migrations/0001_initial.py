# Generated by Django 5.0.1 on 2024-02-15 23:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0007_remove_profile_apple_access_token_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('artist', models.CharField(max_length=255)),
                ('artist_features', models.JSONField(default=list)),
                ('origin', models.CharField(max_length=255)),
                ('uri', models.CharField(max_length=255, unique=True)),
                ('other_available_platforms', models.JSONField(default=list)),
                ('thumb_nail', models.URLField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Artist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('uri', models.CharField(max_length=255)),
                ('image', models.URLField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('artist', models.CharField(max_length=255)),
                ('artist_features', models.JSONField(default=list)),
                ('origin', models.CharField(max_length=255)),
                ('uri', models.CharField(max_length=255, unique=True)),
                ('audio_features', models.JSONField(default=dict)),
                ('other_available_platforms', models.JSONField(default=list)),
                ('song_clip_location', models.URLField(max_length=255)),
                ('song_thumbnail_location', models.URLField(blank=True, max_length=255, null=True)),
                ('album', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='music.album')),
            ],
        ),
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('artist', models.CharField(max_length=255)),
                ('artist_features', models.JSONField(default=list)),
                ('origin', models.CharField(max_length=255)),
                ('uri', models.CharField(max_length=255, unique=True)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.profile')),
                ('songs', models.ManyToManyField(related_name='playlists', to='music.song')),
            ],
        ),
    ]
