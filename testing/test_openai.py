from credentials import OPENAI_KEY
# Set your OpenAI API key here
from openai import OpenAI

def generate_playlist_description(playlist_text):
    client = OpenAI(api_key=OPENAI_KEY)

    examples = [
        {"input": "A playlist for a cozy evening by the fireplace", "output": " Relaxing, cozy, warm"},
        {"input": "A playlist for when I'm at the gym working out", "output": "Upbeat, energetic, motivating"},
    ]

    query = "A playlist for when I am feeling sad"

    prompt = "\n".join([f"Q: {example['input']} A:{example['output']}" for example in examples]) + f"\nQ: {query} A:"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

if __name__ == "__main__":
    playlist_text = "A playlist for a cozy evening by the fireplace"
    playlist_description = generate_playlist_description(playlist_text)
    print("Generated Playlist Description:", playlist_description)
