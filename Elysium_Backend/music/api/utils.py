import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from user.credentials import CLIENT_ID, CLIENT_SECRET
from ..models import Song
from .serializers import SongSerializer


def get_playlist_id(playlist_name, spotifytoken):
    sp = spotipy.Spotify(auth=spotifytoken.access_token)
    user_id = sp.current_user()['id'] 
    playlists = sp.current_user_playlists()
    print(playlist_name)
    print("--------")
    id = None
    for playlist in playlists['items']:
        print(playlist['name'])
        if playlist_name == playlist['name']:
            id = playlist['id']
        # Add more information as needed
    if not id:
        new_playlist = sp.user_playlist_create(user=user_id, name=playlist_name, public=True, description='playlist_description')
        id = new_playlist['id']
    return id

def get_song_data(uri):
    # Check if the song with the given URI already exists

    auth_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
    sp = spotipy.Spotify(auth_manager=auth_manager)
    #print(user.spotifytoken.access_token)
    #sp = spotipy.Spotify(auth=user.spotifytoken.access_token)
    track_info = sp.track(uri, market=None)
    print(track_info)

    # Get audio features for the track
    audio_features = sp.audio_features(uri)

    # Create a dictionary with the desired information
    if len(track_info['artists']) > 1:
        features = [track["name"] for track in track_info['artists'][1:]]
    else:
        features = None

    song_data = {
        #'album': track_info['album']['name'],
        'name': track_info['name'],
        'artist': track_info['artists'][0]['name'],
        'artist_features': features,
        'origin': 'spotify',
        'uri': uri,
        'audio_features': audio_features[0] if audio_features else None,
        'other_available_platforms': [],
        'song_clip_location': track_info['preview_url'],
        'song_thumbnail_location': track_info['album']['images'][0]['url'] if track_info['album']['images'] else None,
    }

    # Save the new song to the database
    song_serializer = SongSerializer(data=song_data)
    return song_serializer