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
        playlist_sel = transfer_from.get_playlists()
        print(playlist_sel)
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

