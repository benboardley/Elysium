from rest_framework import serializers
from user.models import Profile
from ..models import Post, SongPost
from music.api.serializers import SongSerializer
from datetime import datetime
# Assuming you have Song, Album, and Playlist models defined somewhere

class PostSerializer(serializers.ModelSerializer):
    song_post = serializers.SerializerMethodField()
    profile = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    profile_username = serializers.SerializerMethodField()
    creation_time = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id','profile_username','profile', 'parent_post', 'likes', 'creation_time', 'update_time', 'caption', 'title', 'song_post')

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

    def get_profile_username(self, obj):
        return obj.profile.user.username

    def get_creation_time(self, instance):
        creation_time = instance.creation_time

        if isinstance(creation_time, datetime):  # Check if it's already a datetime object
            creation_time_obj = creation_time
        else:
            creation_time_obj = datetime.strptime(creation_time, "%Y-%m-%dT%H:%M:%S.%fZ")

        return creation_time_obj.strftime("%Y-%m-%d %H:%M:%S")

"""
class PostSerializer(serializers.ModelSerializer):
    song_post = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()#serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())


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
    
    def get_profile(self, obj):
        return obj.profile.user.username
"""


'''
class PostSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()#serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
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
