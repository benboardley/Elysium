from rest_framework import serializers
from user.models import Profile
from ..models import Post, SongPost
from music.api.serializers import SongSerializer
# Assuming you have Song, Album, and Playlist models defined somewhere


class PostSerializer(serializers.ModelSerializer):
    song_post = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('profile', 'parent_post', 'likes', 'creation_time', 'update_time', 'caption', 'title', 'song_post')

    def get_song_post(self, instance):
        if isinstance(instance, SongPost):
            # If the post is a SongPost, serialize the related Song
            return SongSerializer(instance.song).data
        return None  # If it's not a SongPost, return None or customize as needed

    def to_representation(self, instance):
        # Customize representation if needed
        ret = super().to_representation(instance)
        # Add more customization here if needed
        return ret



'''
class PostSerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    creation_time = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Post
        fields = '__all__'


class SongPostSerializer(serializers.ModelSerializer):
    # Assuming you have a SongSerializer defined somewhere
    song = serializers.SerializerMethodField()

    class Meta:
        model = SongPost
        fields = ['id', 'profile', 'parent_post', 'likes', 'timestamp', 'caption', 'song']

    def get_song(self, obj):
        song = SongSerializer(obj.song)  # Assuming 'posts' is the related name in your Profile model
        return song

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
