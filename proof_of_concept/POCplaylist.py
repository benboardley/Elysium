from POCsong import POCsong
class POCplaylist:
    ### POCspotify class variables ###
    def __init__(self, name, id, tracks, origin=None):
        self.name = name
        self.playlist_id = id
        self.track_list = tracks

