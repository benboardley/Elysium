import os
from dotenv import load_dotenv

from POCspotify import POCspotify
from POCapplmus import POCapplmus

### Set Up Environment variables ###
def setup_env():
    print("Set Up Environment variables")
    #load_dotenv(dotenv_path='../keys.env', verbose=True)


### Authorization of Spotify ###
def spot_auth():
    spotify = POCspotify()
    spotify.request_auth()
    if spotify.sp:
        spotify.top_ten_tracks()


### Authorization of Apple Music ###
def applmus_auth():
    print("Authorization of Apple Music")


### Request transfer service type ###
def transfer_service():
    streaming_service = input(
        "\nInput either 0 or 1 to transfer\n"
        "(0) Spotify -> Apple Music\n"
        "(1) Apple Music -> Spotify\n"
        "Selection: "
    )
    return streaming_service


### Request transfer type ###
def transfer_type():
    trans_type = input(
        "Input either 0 or 1 for type to transfer\n"
        "(0) Song\n"
        "(1) Playlist\n"
        "Selection: "
    )
    return trans_type


if __name__ == '__main__':
    ### Set Up Environment variables ###
    setup_env()

    ### Authorization of Spotify ###
    spot_auth()

    ### Authorization of Apple Music ###

    ### Request transfer service type ###
    streaming_service = transfer_service()
    
    ### Request transfer type ###
    trans_type = transfer_type()
    
    ### Populate select choices ###

    ### Request user choice ###
        # Done through populus of returned object from other files
        # and displayed to the user of choice 0-9 along with selection
        # choice.
        #
        # If song is chosen, request location of which to transfer
        # (list of current user playlists)
    
    ### Transfer data to user specifications ### 
