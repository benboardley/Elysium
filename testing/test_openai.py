from credentials import OPENAI_KEY
from credentials import SPOTIPY_ID
from credentials import SPOTIPY_SECRET
# Set your OpenAI API key here
from openai import OpenAI
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

def generate_playlist_description(query):
    client = OpenAI(api_key=OPENAI_KEY)
    

    examples = [
        {"input": "A playlist for a cozy evening by the fireplace", "output": "Query: Relaxing, cozy, and warm songs. Title: Cozy Fireplace"},
        {"input": "A playlist for when I'm at the gym working out", "output": "Query: Upbeat, energetic, and  motivating songs. Title: Gym Workout"},
        {"input": "A playlist for Drake's most hype songs", "output": "Query: Hype Drake songs. Title: Drake Hype"},

    ]

    prompt = "\n".join([f"Q: {example['input']} A:{example['output']}" for example in examples]) + f"\nQ: {query} A:"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    openai_output = response.choices[0].message.content.strip()
    playlist_title = openai_output.split(". ")[1].split(": ")[1]
    print("Playlist Title: " + playlist_title)
    spotify_query = openai_output.split(". ")[0].split(": ")[1]
    print("Spotify Query: " + spotify_query)

    auth_manager = SpotifyClientCredentials(client_id=SPOTIPY_ID, client_secret=SPOTIPY_SECRET)
    sp = spotipy.Spotify(auth_manager=auth_manager)
    results = sp.search(q=spotify_query, type='track', limit=20)


    for track in results['tracks']['items']:
        print(track['name'])

    return results['tracks']['items']


if __name__ == "__main__":
    playlist_text = "A playlist for a cozy evening by the fireplace"
