from django.db import models
from user.models import Profile
# Create your models here.


class Artist(models.Model):
    name = models.CharField(max_length=255)
    uri = models.CharField(max_length=255)
    image = models.URLField(max_length=255)


class Song(models.Model):
    #album = models.ForeignKey(Album, null=True, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    artist_features = models.JSONField(default=list, blank=True, null=True)
    origin = models.CharField(max_length=255)
    uri = models.CharField(max_length=255, unique=True)
    audio_features = models.JSONField(default=dict)
    other_available_platforms = models.JSONField(default=list)
    song_clip_location = models.URLField(max_length=255, blank=True, null=True)
    song_thumbnail_location = models.URLField(max_length=255, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Custom save method if needed
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.artist}"
    
class Album(models.Model):
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    artist_features = models.JSONField(default=list)
    origin = models.CharField(max_length=255)
    songs = models.ManyToManyField(Song, related_name='albums')
    uri = models.CharField(max_length=255, unique=True)
    other_available_platforms = models.JSONField(default=list)
    album_thumbnail_location = models.URLField(max_length=255, blank=True, null=True)
    def __str__(self):
        return f"{self.name} - {self.artist}"

class Playlist(models.Model):
    #creator_uri = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    #artist = models.CharField(max_length=255)
    #artist_features = models.JSONField(default=list)
    origin = models.CharField(max_length=255)
    uri = models.CharField(max_length=255, unique=True)
    songs = models.ManyToManyField(Song, related_name='playlists')
    description = models.TextField(blank=True, null=True)
    playlist_thumbnail_location = models.URLField(max_length=255, blank=True, null=True)
    def __str__(self):
        return f"{self.name}"