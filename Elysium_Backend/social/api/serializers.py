from rest_framework import serializers
from user.models import Profile
from ..models import Post, SongPost, PlaylistPost
from music.models import Song, Playlist
from music.api.serializers import SongSerializer, PlaylistSerializer
from datetime import datetime
# Assuming you have Song, Album, and Playlist models defined somewhere

class PostSerializer(serializers.ModelSerializer):
    song_post = serializers.SerializerMethodField()
    playlist_post = serializers.SerializerMethodField()
    profile = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    profile_username = serializers.SerializerMethodField()
    creation_time = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id','profile_username','profile', 'parent_post', 'likes', 'creation_time', 'update_time', 'caption', 'title', 'song_post', 'playlist_post')

    def get_song_post(self, instance):
        if isinstance(instance, SongPost):
            # If the post is a SongPost, serialize the related Song
            return SongSerializer(instance.song).data
        return None  # If it's not a SongPost, return None or customize as needed
    
    def get_playlist_post(self, instance):
        if isinstance(instance, PlaylistPost):
            context = self.context  # This grabs the context passed to PostSerializer
            
            return PlaylistSerializer(instance.playlist, context=context).data
        return None
    
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
    def create(self, validated_data):
        # Check if song data is present in the validated data
        song_uri = validated_data.pop('song_uri', None)
        playlist_uri = validated_data.pop('playlist_uri', None)
        # If song data is present, create a SongPost; otherwise, create a generic Post
        if song_uri:
            song = Song.objects.filter(uri=song_uri).first()
            if not song:
                return None
            #    song_serializer = get_song_data(song_uri)
            #    song = song_serializer.save()
            post = SongPost.objects.create(song=song, **validated_data)
        elif playlist_uri:
            playlist = Playlist.objects.filter(uri=playlist_uri).first()
            if not playlist:
                return None
            #    song_serializer = get_song_data(song_uri)
            #    song = song_serializer.save()
            post = PlaylistPost.objects.create(playlist=playlist, **validated_data)
        else:
            post = Post.objects.create(**validated_data)

        return post
    def update(self, instance, validated_data):
        song_uri = validated_data.pop('song_uri', instance.song.uri if isinstance(instance, SongPost) else None)
        playlist_uri = validated_data.pop('playlist_uri', instance.playlist.uri if isinstance(instance, PlaylistPost) else None)
        #print(playlist_uri)
        # Update based on the type of post
        if song_uri:
            song = Song.objects.filter(uri=song_uri).first()
            if not song:
                # Optionally, handle the case where the song does not exist yet
                return None
            if isinstance(instance, SongPost):
                instance.song = song
            else:
                # Optionally handle changing a generic post to a song post, or error out
                return None
        elif playlist_uri:
            playlist = Playlist.objects.filter(uri=playlist_uri).first()
            if not playlist:
                # Optionally, handle the case where the playlist does not exist yet
                return None
            if isinstance(instance, PlaylistPost):
                instance.playlist = playlist
            else:
                # Optionally handle changing a generic post to a playlist post, or error out
                return None
        else:
            if isinstance(instance, SongPost) or isinstance(instance, PlaylistPost):
                # Handle converting a SongPost or PlaylistPost to a generic post, or error out
                return None

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
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
