from django.urls import path
from .api.views import *
urlpatterns = [
    path('spotify/playlists', GetSpotifyPlaylists.as_view(), name='spotify-playlists'),
    path('spotify/songs', SpotifySongs.as_view(), name='spotify-songs'),
    path('stored/songs', StoredSongs.as_view(), name='stored-songs'),
    path('spotify/topsong', GetSpotifyTopSong.as_view(), name='spotify-topsong'),
    path('song/<str:query>', SongSearch.as_view(), name='song-search'),
]