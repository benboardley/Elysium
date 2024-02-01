import os
from dotenv import load_dotenv
from proof_of_concept.POCsong import POCsong
from proof_of_concept.POCplaylist import POClist
from proof_of_concept.POCspotify import POCspotify
from proof_of_concept.POCapplmus import POCapplmus

### Set Up Environment variables ###
def setup_env():
    print("Set Up Environment variables")
    load_dotenv(dotenv_path='../keys.env', verbose=True)


### Authorization of Spotify ###
def spot_auth():
    spotify = POCspotify()
    spotify.request_auth()
    while not spotify.sp:
        exit_bool = input(
            "Authentication failed. Would you like to try again?\n"
            "(y/n) "
            )
        if 'y' in exit_bool:
            spotify.request_auth()
        else:
            break
    return spotify


### Authorization of Apple Music ###
def applmus_auth():
    print("Authorization of Apple Music")


### Request transfer service type ###
def transfer_service():
    selection = input(
        "\nInput either 0 or 1 to transfer\n"
        "(0) Spotify -> Apple Music\n"
        "(1) Apple Music -> Spotify\n"
        "Selection: "
    )
    return int(selection)


### Request transfer type ###
def transfer_type():
    selection = input(
        "Input either 0 or 1 for type to transfer\n"
        "(0) Song\n"
        "(1) Playlist\n"
        "Selection: "
    )
    return int(selection)

"""
def get_all_songs(playlist_obj):
    for track in playlist_obj.track_list:
        print(f"Track Name: {track.name}, Artist: {track.artist}")
"""


### Select Playlist for Transfer ###
def playlist_select(transfer_from):
    playlist_list = transfer_from.get_playlists()
    while True:
        for i, playlist in enumerate(playlist_list):
            print(f"({i}) - Playlist Name: {playlist[0]}")
        view_songs = input(
            "Would you like to view the songs in a playlist before making your selection?\n"
            "(y/n) "
            )
        if 'n' in view_songs:
            break
        list_num = input("Enter a playlist number to view the songs in this playlist-> ")
        playlist_id = playlist_list[int(list_num)][1]
        track_dict = transfer_from.get_songs_from_playlist(playlist_id)
        for track, artist in track_dict.items():
            print(f"Track Name: {track}, Artist: {artist}")
        input("\nPress enter to return.")
        if os.name == 'nt':
            os.system('cls')
        else:
            os.system('clear')
    num_playlists = len(playlist_list)-1
    playlist_num = input(
        "Which playlist would you like to select?\n"
        f'Selection (0-{num_playlists}): '
                            )
    playlist_sel = playlist_list[int(playlist_num)]
    playlist_obj = transfer_from.create_playlist_obj(playlist_sel[0], playlist_sel[1])
    print([track.name for track in playlist_obj.track_list])
    return playlist_obj


def song_select(transfer_from):
    track_list = transfer_from.top_ten_tracks()
    print("Your top tracks:")
    for i, track in enumerate(track_list):
        print(f"({i}) - {track['name']} by {track['artists'][0]['name']}")
    song_num = input("Select a song by choosing a number 0-9: ")
    song_sel = track_list[int(song_num)]
    song = transfer_from.create_song_obj(song_sel)
    return song


### Song Transfer ###
def song_transfer(transfer_from, transfer_to):
    pass


if __name__ == '__main__':
    ### Set Up Environment variables ###
    setup_env()
    spotify = applmus = None
    song_obj = playlist_obj = None
    transfer_to = transfer_from = transfer_sel = None

    ### Authorization of Spotify ###
    spotify = spot_auth()
    if not spotify.sp:
        ValueError("Authentication Failed. Aborting Proccess.")
        exit(0)

    ### Authorization of Apple Music ###
    """
    applmus = applmus_auth()
    if not applmus.sp:
        ValueError("Authentication Failed. Aborting Proccess.")
        exit(0)
    """

    ### Request transfer service type ###
    if transfer_service():
        """transfer_from = applmus"""
        transfer_to = spotify
    else:
        transfer_from = spotify
        """transfer_to = applmus"""

    ### CONDITIONAL ON APPLE MUSIC ###
    transfer_from = spotify
    transfer_to = spotify
    ##################################

    ### Request transfer type | Populate select choices | Request user choice ###
        # Done through populus of returned object from other files
        # and displayed to the user of choice 0-9 along with selection
        # choice.
        #
        # If song is chosen, request location of which to transfer
        # (list of current user playlists)
    if transfer_type():
        ### User selected playlist ###
        # variable created that holds playlist object
        playlist_obj = playlist_select(transfer_from)
        playlist_obj.name = "Test Elysium"
        transfer_from.add_playlist(playlist_obj)
    else:
        ### User selected song ###
        # Populate song selection
        song_obj = song_select(transfer_from)
        song_name = song_obj.name
        song_artist = song_obj.artist
        print(f'Selected song: {song_name} by {song_artist}')
        transfer_sel = input(
            "Would you like to transfer this song to a playlist as well as your library?\n"
            "(y/n) "
        )
        if 'y' in transfer_sel:
            playlist_obj = playlist_select(transfer_from)
            transfer_to.add_songs([song_obj], playlist_obj.playlist_id)
        else:
            transfer_to.add_songs([song_obj], None)

    ### Transfer data to user specifications ### 

