from rest_framework import serializers
from ..models import Song, Playlist

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'

class PlaylistSerializer(serializers.ModelSerializer):
    songs = serializers.SerializerMethodField()
    class Meta:
        model = Playlist
        fields = ('name', 'uri', 'description', 'songs', 'playlist_thumbnail_location')
    
    def get_songs(self, obj):
        songs_info = obj.songs.all().values('pk', 'name', 'artist', 'song_thumbnail_location')[:20]
        return list(songs_info)