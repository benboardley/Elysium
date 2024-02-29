import spotipy
from spotipy.oauth2 import SpotifyClientCredentials


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