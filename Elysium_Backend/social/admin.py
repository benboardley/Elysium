from django.contrib import admin
from .models import Post, SongPost, PlaylistPost, AlbumPost
# Register your models here.
admin.site.register(Post)
admin.site.register(SongPost)
admin.site.register(PlaylistPost)
admin.site.register(AlbumPost)