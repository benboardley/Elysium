from django.contrib import admin
from .models import Post, SongPost, PlaylistPost
# Register your models here.
admin.site.register(Post)
admin.site.register(SongPost)
admin.site.register(PlaylistPost)