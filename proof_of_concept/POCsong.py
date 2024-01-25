class POCsong:
    ### POCspotify class variables ###
    def __init__(self, track, audio_features, origin=None):
        self.name = track['track']['name']
        self.artist = track['track']['album']['artists'][0]['name']
        self.artist_features = [artist['name'] for artist in track['track']['album']['artists'][1:] if len(track['track']['album']['artists']) > 0]
        self.artist_features.extend([artist['name'] for artist in track['track']['artists'] if artist['name'] not in self.artist])
        self.origin = origin
        self.uri = track['track']['uri']
        self.audio_features = audio_features
        self.other_available_platforms = []
        self.song_clip_location = track['track']['preview_url']
        self.song_thumbnail_location = None#track['track']['video_thumbnail']['url']