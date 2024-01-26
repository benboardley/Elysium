import os
import spotipy
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyOAuth
from POCsong import POCsong
from POCplaylist import POCplaylist

class POCspotify:
    ### POCspotify class variables ###

    def __init__(self):
        script_dir = os.path.dirname(os.path.abspath(__file__))

        # Construct the path to the .env file
        dotenv_path = os.path.join(script_dir, '../keys.env')

        # Load the .env file
        load_dotenv(dotenv_path=dotenv_path, verbose=True)

        #set important information
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

    """
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
    """
    def top_ten_tracks(self):
        top_tracks = self.sp.current_user_top_tracks(limit=10)

        print("Your top tracks:")
        for i, track in enumerate(top_tracks['items']):
            print(f"({i}) - {track['name']} by {track['artists'][0]['name']}")
        song_num = input("Select a song by choosing a number 0-9: ")
        song_sel = top_tracks['items'][int(song_num)]
        return song_sel

    
    def get_playlists(self):
        # return: a list of playlist objects
        playlist_list = []
        playlists = self.sp.current_user_playlists()
        for playlist in playlists['items']:
            track_list = []
            playlist_id = playlist['id']
            tracks = self.sp.playlist_tracks(playlist_id)
            for track in tracks['items']:
                track_list.append(self.create_song_obj(track))
            playlist_list.append(self.create_playlist_obj(playlist['name'], playlist_id, track_list))
        return playlist_list


    def get_songs(self, playlist_id):
        song_list = []
        tracks = self.sp.playlist_tracks(playlist_id)
        for track in tracks['items']:
            song_list.append(track)
        #self.convert_song_metadata(track)
        return song_list


    def add_songs(self):
        pass


    def add_playlist(self):
        pass

    def create_song_obj(self, track):
        #print(track)
        if 'track' in track:
            track = track['track']
        track_uri = track['uri']
        #print(track)
        audio_features = self.sp.audio_features(track_uri)[0]
        #print(audio_features)
        return POCsong(track, audio_features, origin = 'spotify')
    

    def create_playlist_obj(self, name, id, track_list):
        return POCplaylist(name, id, track_list, origin = 'spotify')