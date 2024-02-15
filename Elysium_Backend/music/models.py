from django.db import models
from ..user.models import Profile
# Create your models here.


class Artist(models.Model):
    name = models.CharField(max_length=255)
    uri = models.CharField(max_length=255)
    image = models.URLField(max_length=255)


class Album(models.Model):
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    artist_features = models.JSONField(default=list)
    origin = models.CharField(max_length=255)
    uri = models.CharField(max_length=255, unique=True)
    other_available_platforms = models.JSONField(default=list)
    thumb_nail = models.URLField(max_length=255, blank=True, null=True)

class Song(models.Model):
    album = models.ForeignKey(Album, null=True, blank=True)
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    artist_features = models.JSONField(default=list)
    origin = models.CharField(max_length=255)
    uri = models.CharField(max_length=255, unique=True)
    audio_features = models.JSONField(default=dict)
    other_available_platforms = models.JSONField(default=list)
    song_clip_location = models.URLField(max_length=255)
    song_thumbnail_location = models.URLField(max_length=255, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Custom save method if needed
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.artist}"
    
class Playlist(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    artist_features = models.JSONField(default=list)
    origin = models.CharField(max_length=255)
    uri = models.CharField(max_length=255, unique=True)
    songs = models.ManyToManyField(Song, related_name='playlists')

    def __str__(self):
        return f"{self.name} - {self.artist}"