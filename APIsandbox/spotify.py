import spotipy
from spotipy.oauth2 import SpotifyOAuth

#Spotify Credentials
client_id = 
client_secret =
redirect_uri = 'http://localhost:3000/callback'

scope = 'user-library-read user-top-read'

sp_oauth = SpotifyOAuth(client_id, client_secret, redirect_uri, scope=scope)

auth_url = sp_oauth.get_authorize_url()

print(f"Please go to {auth_url}")

redirected_url = input("Paste the redirected URL here: ")

token_info = sp_oauth.get_access_token(redirected_url)

sp = spotipy.Spotify(auth=token_info['access_token'])

top_tracks = sp.current_user_top_tracks(limit=10)

print("Your top tracks:")
for track in top_tracks['items']:
    print(f"- {track['name']} by {track['artists'][0]['name']}")

results = sp.search(q='artist:Lil Wayne track:Mona Lisa', type='track')
track_uri = results['tracks']['items'][0]['uri']
audio_features = sp.audio_features(track_uri)[0]
# Get more details about the track
print(f"Name: {results['tracks']['items'][0]['name']}")
print(f"Artist: {results['tracks']['items'][0]['artists'][0]['name']}")
print(f"Album: {results['tracks']['items'][0]['album']['name']}")
print(f"Popularity: {results['tracks']['items'][0]['popularity']}")
print(f"Energy: {audio_features['energy']}")
print(f"Danceability: {audio_features['danceability']}")
print(f"Duration: {audio_features['duration_ms']} milliseconds")
