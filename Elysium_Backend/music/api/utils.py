import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from user.credentials import CLIENT_ID, CLIENT_SECRET
from ..models import Song, Playlist
from .serializers import SongSerializer
from django.core.exceptions import ObjectDoesNotExist
import math

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

def get_song_data_list(uris, page=1, save=False):
    # Check if the song with the given URI already exists
    single = False
    auth_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
    sp = spotipy.Spotify(auth_manager=auth_manager)
    max_page = math.ceil(len(uris)/50)
    if not isinstance(uris, list):
        single = True
        uris = [uris]

    if len(uris) > 50:
        uris = uris[(page-1)*50:(page-1)*50 + 50]

    songs = []
    track_infos = []
    audio_features = []
    existing_songs = Song.objects.filter(uri__in=uris)
    songs.extend(SongSerializer(existing_songs,many=True).data)
    existing_song_uris = set(existing_songs.values_list('uri', flat=True))
    new_uris = set(uris) - existing_song_uris

    if len(new_uris) > 0:
        track_infos = sp.tracks(uris, market=None)['tracks']
        audio_features = sp.audio_features(uris)

    for i,track_info in enumerate(track_infos):

        # Create a dictionary with the desired information
        if len(track_info['artists']) > 1:
            features = [track["name"] for track in track_info['artists'][1:]]
        else:
            features = None

        song_data = {
            'name': track_info['name'],
            'artist': track_info['artists'][0]['name'],
            'artist_features': features,
            'origin': 'spotify',
            'uri': track_info['uri'],
            'audio_features': audio_features[i] if audio_features[i] else None,
            'other_available_platforms': [],
            'song_clip_location': track_info['preview_url'],
            'song_thumbnail_location': track_info['album']['images'][0]['url'] if track_info['album']['images'] else None,
        }
        serialized = SongSerializer(data=song_data)
        if(serialized.is_valid()):
            if save:
                serialized.save()
            songs.append(serialized.data)
        else:
            print(serialized.errors)

    # Save the new songs to the database
    #song_serializer = SongSerializer(data=songs, many=True)
    if single:
        return songs[0]
    return songs, page, max_page

def create_playlist(playlist_uri):
    auth_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
    sp = spotipy.Spotify(auth_manager=auth_manager)
    playlist_id = playlist_uri.split(':')[-1]
    try:
        playlist = sp.playlist(playlist_id)
    except:
        return None, False
    playlist_name = playlist['name']
    playlist_description = playlist.get('description', '')
    results = sp.playlist_tracks(playlist_id)
    song_uris = [track['track']['uri'] for track in results['items']]
    while results['next']:
        results = sp.next(results)
        song_uris.extend([track['track']['uri'] for track in results['items']])
    songs, page, max_page = get_song_data_list(song_uris, save=True)
    while page < max_page:
        songs, page, max_page = get_song_data_list(song_uris, page=page+1, save=True)
    all_relevant_songs = Song.objects.filter(uri__in=song_uris)
    playlist, created = Playlist.objects.update_or_create(
        uri=playlist_uri,  
        defaults={
            'name': playlist_name,
            'description': playlist_description,
            'origin': 'spotify',  
            'playlist_thumbnail_location': playlist['images'][0]['url'] if playlist['images'] else None,   
        }
    )
    playlist.songs.set(all_relevant_songs)
    return playlist, created

def add_playlist(playlist, user_token):
    sp = spotipy.Spotify(auth=user_token.access_token)
    playlist_name = playlist.name
    playlist_description = playlist.description
    user_id = sp.current_user()['id']  # Get the current user's ID

    new_playlist = sp.user_playlist_create(user=user_id, name=playlist_name, public=True, description=playlist_description)

    playlist_id = new_playlist['id']
    # Add songs to the playlist
    tracks = playlist.songs.all().values('uri')
    tracks = [track['uri'] for track in tracks]
    max_page = math.ceil(len(tracks)/50)
    page = 0
    
    while page < max_page:
        track_uris =  tracks[page*50:(page+1)*50]
        sp.playlist_add_items(playlist_id, track_uris)
        page += 1