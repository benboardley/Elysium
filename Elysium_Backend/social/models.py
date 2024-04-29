from django.db import models
from user.models import Profile
from model_utils.managers import InheritanceManager
from music.models import Album, Song, Artist, Playlist
# Create your models here.

class Post(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    parent_post = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='responses')
    likes = models.ManyToManyField(Profile, related_name='liked_posts', blank=True)
    creation_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    caption = models.TextField()
    title = models.TextField(blank=True)
    #objects = InheritanceManager()

class SongPost(Post):
    # Fields specific to song posts
    song = models.ForeignKey(Song, on_delete=models.CASCADE)

class AlbumPost(Post):
    # Fields specific to album posts
    album = models.ForeignKey(Album, on_delete=models.CASCADE)

class PlaylistPost(Post):
    # Fields specific to playlist posts
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
