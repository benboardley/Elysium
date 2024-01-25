import os
import spotipy
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyOAuth

class POCspotify:
    ### POCspotify class variables ###

    def __init__(self):
        load_dotenv(dotenv_path='../keys.env', verbose=True)
        self.client_id = os.environ["client_id"]
        self.client_secret = os.environ["client_secret"]
        self.redirect_uri = 'http://localhost:3000/callback'
        self.scope = 'user-library-read user-top-read' # Take as argument l8r
        self.sp = None


    def request_auth(self):
        sp_oauth = SpotifyOAuth(
            self.client_id, self.client_secret, self.redirect_uri, scope=self.scope)

        auth_url = sp_oauth.get_authorize_url()

        print(f"Please go to {auth_url}")

        redirected_url = input("Paste the redirected URL here: ")

        #token_info = sp_oauth.get_access_token(redirected_url)
        token_info = sp_oauth.get_cached_token()
        access_token = token_info['access_token']

        self.sp = spotipy.Spotify(auth=access_token)

    
    def top_ten_tracks(self):
        top_tracks = self.sp.current_user_top_tracks(limit=10)

        print("Your top tracks:")
        for track in top_tracks['items']:
            print(f"- {track['name']} by {track['artists'][0]['name']}")
        #print(track)

        results = self.sp.search(q='artist:Lil Wayne track:Mona Lisa', type='track')
        track_uri = results['tracks']['items'][0]['uri']
        audio_features = self.sp.audio_features(track_uri)[0]
        # Get more details about the track
        print(f"Name: {results['tracks']['items'][0]['name']}")
        print(f"Artist: {results['tracks']['items'][0]['artists'][0]['name']}")
        print(f"Album: {results['tracks']['items'][0]['album']['name']}")
        print(f"Popularity: {results['tracks']['items'][0]['popularity']}")
        print(f"Energy: {audio_features['energy']}")
        print(f"Danceability: {audio_features['danceability']}")
        print(f"Duration: {audio_features['duration_ms']} milliseconds")
    
    def get_playlists(self):
        playlists = self.sp.current_user_playlists()
        for playlist in playlists['items']:
            print(f"Playlist Name: {playlist['name']}, Playlist ID: {playlist['id']}")
        playlist_id = input("Enter a playlist ID to view the songs in this playlist-> ")
        for playlist in playlists['items']:
            #print(playlist_id, ' ', playlist['id'])
            if playlist_id == playlist['id']:
                tracks = self.sp.playlist_tracks(playlist_id)
                for track in tracks['items']:
                    print(f"Track Name: {track['track']['name']}, Artist: {track['track']['artists'][0]['name']}")
                self.convert_song_metadata(track)

    def add_songs(self):
        pass

    def add_playlist(self):
        pass

    def convert_song_metadata(self, track):
        #print(track)
        track_uri = track['track']['uri']
        audio_features = self.sp.audio_features(track_uri)[0]
        #print(audio_features)