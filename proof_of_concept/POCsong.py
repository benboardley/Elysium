class POCsong:

    ### POCspotify class variables ###
    def __init__(self, track, audio_features, origin=None):
        self.name = track['name']
        self.album_uri = track['album']['uri']
        self.artist = track['album']['artists'][0]['name']
        self.artist_features = [artist['name'] for artist in track['album']['artists'][1:] if len(track['album']['artists']) > 0]
        self.artist_features.extend([artist['name'] for artist in track['artists'] if artist['name'] not in self.artist])
        self.origin = origin
        self.uri = track['uri']
        self.audio_features = audio_features
        self.other_available_platforms = []
        self.song_clip_location = track['preview_url']
        self.song_thumbnail_location = None#track['video_thumbnail']['url']
        self.cover_pic_l = track['album']['images'][0]['url'] # 640x640
        self.cover_pic_m = track['album']['images'][1]['url'] # 300x300
        self.cover_pic_s = track['album']['images'][2]['url'] # 64x64