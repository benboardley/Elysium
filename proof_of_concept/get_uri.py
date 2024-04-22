import unittest
import os
from dotenv import load_dotenv
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
import requests

load_dotenv('../keys.env')
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
results = sp.search("artist:Drake track:Motto", limit=20, offset=0, market='US')
tracks = results['tracks']
for item in tracks['items']:
    print(item['artists'][0]['name'])
    print(item['preview_url'])


def get_access_token(client_id, client_secret):
    url = "https://accounts.spotify.com/api/token"
    headers = {}
    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    }
    response = requests.post(url, headers=headers, data=data)
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        raise Exception("Could not obtain token")

# Function to search tracks
def search_tracks(query, access_token, limit=10, offset=0, type='track', market=None):
    url = "https://api.spotify.com/v1/search"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "q": query,
        "limit": limit,
        "offset": offset,
        "type": type,
        "market": market
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Get an access token
access_token = get_access_token(client_id, client_secret)

# Search for tracks
results = search_tracks("Motto", access_token)
tracks = results['tracks']
for item in tracks['items']:
    print(item['artists'][0]['name'])
    print(item['preview_url'])