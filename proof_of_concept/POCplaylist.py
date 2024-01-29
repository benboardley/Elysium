from POCsong import POCsong

class POCplaylist:
    ### POCspotify class variables ###
    def __init__(self, name, playlist_id, tracks, origin=None):
        self.name = name
        self.playlist_id = playlist_id
        self.track_list = tracks

