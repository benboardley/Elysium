import unittest
import proof_of_concept
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
        self.playlist = None
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
    
    def test_top_ten(self):
        tracks = self.spotify.top_ten_tracks()
        self.assertEqual(10, len(tracks))
    
    def test_get_playlists(self):
        playlists = self.spotify.get_playlists()
        names = [pl[0] for pl in playlists]
        self.assertEqual(True, 'CoUNTry' in names)
    
    def test_get_songs_from_playlist(self):
        playlists = self.spotify.get_playlists()
        names = [pl[0] for pl in playlists]
        playlist_index = names.index('CoUNTry')
        playlist_id = playlists[playlist_index][1]
        track_dict = self.spotify.get_songs_from_playlist(playlist_id)
        self.assertEqual(True, len(track_dict) > 0)
    
    def test_error_get_songs_from_playlist(self):
        track_dict = self.spotify.get_songs_from_playlist('wrong')
        self.assertEqual(True, len(track_dict) == 0)
    
    def test_add_song(self):
        pass
    
    def test_add_playlist(self):
        pass
    
if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestMyModule)
    unittest.TextTestRunner(verbosity=2).run(suite)