import os
from dotenv import load_dotenv
from POCsong import POCsong
#from POCplaylist import POClist
from POCspotify import POCspotify
from POCapplmus import POCapplmus

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


### Select Playlist for Transfer ###
def playlist_select(transfer_from, transfer_to):
    playlist_list = transfer_from.get_playlists()
    while True:
        for i, playlist in enumerate(playlist_list):
            print(f"({i}) - Playlist Name: {playlist.name}")
        view_songs = input(
            "Would you like to view the songs in a playlist before making your selection?\n"
            "(y/n) "
            )
        if 'n' in view_songs:
            break
        list_num = input("Enter a playlist number to view the songs in this playlist-> ")
        playlist_id = playlist_list[int(list_num)].playlist_id
        song_list = transfer_from.get_songs(playlist_id)
        for song in song_list:
            print(f"Track Name: {song.name}, Artist: {song.artist}")
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
    return playlist_sel


### Song Transfer ###
def song_transfer(transfer_from, transfer_to):
    pass



if __name__ == '__main__':
    ### Set Up Environment variables ###
    setup_env()
    spotify = applmus = None
    song_sel = playlist_sel = None
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
    
    ### Request transfer type | Populate select choices | Request user choice ###
        # Done through populus of returned object from other files
        # and displayed to the user of choice 0-9 along with selection
        # choice.
        #
        # If song is chosen, request location of which to transfer
        # (list of current user playlists)
    transfer_from = spotify
    transfer_to = spotify
    if transfer_type():
        ### User selected playlist ###
        #create a variable that holds what playlist to select
        playlist_sel = playlist_select(transfer_from, transfer_to)
    else:
        ### User selected song ###
        # Populate song selection
        song_sel = transfer_from.top_ten_tracks()
        transfer_sel = input(
            "Would you like to transfer this song to a playlist as well as your library?\n"
            "(y/n) "
        )
        if 'y' in transfer_sel:
            transfer_to.get_playlists()
        print(song_sel)


    ### Transfer data to user specifications ### 

