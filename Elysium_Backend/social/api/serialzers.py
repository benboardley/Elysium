from rest_framework import serializers
from user.models import Profile
from ..models import Post
# Assuming you have Song, Album, and Playlist models defined somewhere

class PostSerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    creation_time = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Post
        fields = '__all__'

'''
class SongPostSerializer(serializers.ModelSerializer):
    # Assuming you have a SongSerializer defined somewhere
    song = SongSerializer()

    class Meta:
        model = SongPost
        fields = ['id', 'profile', 'parent_post', 'likes', 'timestamp', 'caption', 'song']

class AlbumPostSerializer(serializers.ModelSerializer):
    # Assuming you have an AlbumSerializer defined somewhere
    album = AlbumSerializer()

    class Meta:
        model = AlbumPost
        fields = ['id', 'profile', 'parent_post', 'likes', 'timestamp', 'caption', 'album']

class PlaylistPostSerializer(serializers.ModelSerializer):
    # Assuming you have a PlaylistSerializer defined somewhere
    playlist = PlaylistSerializer()

    class Meta:
        model = PlaylistPost
        fields = ['id', 'profile', 'parent_post', 'likes', 'timestamp', 'caption', 'playlist']
'''
