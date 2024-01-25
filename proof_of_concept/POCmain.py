import os
import POCspotify
import POCapplmus

### Set Up Environment variables ###
def setup_env():
    print("Set Up Environment variables")


### Authorization of Spotify ###
def spot_auth():
    


### Authorization of Apple Music ###
def spot_auth():
    print("Authorization of Apple Music")


### Request transfer service type ###
def transfer_service():
    streaming_service = input("""Input either 0 or 1 to transfer\n
                              (0) Spotify -> Apple Music\n(1) Apple 
                              Music -> Spotify\nSelection: """)
    return streaming_service


### Request transfer type ###
def transfer_type():
    trans_type = input("""Input either 0 or 1 for type to transfer\n
                              (0) Song\n(1) Playlist\nSelection: """)
    return trans_type


if __name__ == '__main__':
    ### Set Up Environment variables ###

    ### Authorization of Spotify ###

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
