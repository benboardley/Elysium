import unittest

from proof_of_concept.POCsong import POCsong
from proof_of_concept.POCspotify import POCspotify
import os
from dotenv import load_dotenv
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
class TestMyModule(unittest.TestCase):
    def __init__(self, methodName='runTest', special_arg=None):
        # Call the base class constructor
        super(TestMyModule, self).__init__(methodName)
        self.spotify = POCspotify()
        # Set your Spotify API credentials
        client_id = os.environ["client_id"]
        client_secret = os.environ["client_secret"]

        # Authenticate using client credentials
        client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
        sp = Spotify(client_credentials_manager=client_credentials_manager)

        # Get an access token
        token_info = client_credentials_manager.get_access_token()
        access_token = token_info['access_token']
        sp = Spotify(auth=access_token)
        self.spotify.sp = sp
    def test_song_name(self):
        results = self.spotify.sp.search(q='artist:Lil Wayne track:Mona Lisa', type='track')
        track = results['tracks']['items'][0]
        result = self.spotify.create_song_obj(track)
        self.assertEqual(result.name, 'Mona Lisa (feat. Kendrick Lamar)')
    def test_song_artist(self):
        results = self.spotify.sp.search(q='artist:Lil Wayne track:Mona Lisa', type='track')
        track = results['tracks']['items'][0]
        result = self.spotify.create_song_obj(track)
        self.assertEqual(result.artist, 'Lil Wayne')
    def test_song_feature_artists(self):
        results = self.spotify.sp.search(q='artist:Lil Wayne track:Mona Lisa', type='track')
        track = results['tracks']['items'][0]
        result = self.spotify.create_song_obj(track)
        self.assertEqual(result.artist_features, ['Kendrick Lamar'])
    def test_song_audio_features(self):
        pass
    def test_song_uri(self):
        pass
    def test_song_urls(self):
        pass