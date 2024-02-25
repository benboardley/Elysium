from django.urls import path
from .api.views import *
urlpatterns = [
    path('spotify/playlists', GetSpotifyPlaylists.as_view(), name='spotify-playlists'),
]