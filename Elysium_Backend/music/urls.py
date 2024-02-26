from django.urls import path
from .api.views import *
urlpatterns = [
    path('spotify/playlists', GetSpotifyPlaylists.as_view(), name='spotify-playlists'),
    path('spotify/songs', SpotifySongs.as_view(), name='spotify-songs'),
    path('stored/songs', StoredSongs.as_view(), name='stored-songs'),
]