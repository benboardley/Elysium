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
        # Retrieve pagination parameters from context, with defaults
        page_size = self.context.get('page_size', 20)  # Default to 50 items per page
        page = self.context.get('page', 1)  # Default to first page
        start_index = (page - 1) * page_size
        end_index = page * page_size
        #print(start_index, end_index)
        songs_info = obj.songs.all().values('pk', 'name', 'artist', 'song_thumbnail_location')[start_index:end_index]
        return list(songs_info)