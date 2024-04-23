from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import generate_playlist  # Assuming your function is in utils.py

class PlaylistGeneratorView(APIView):
    def get(self, request, *args, **kwargs):
        # Extract the query from the request data
        query = request.data.get('query', '')  # Default to empty string if not provided

        if not query:
            return JsonResponse({'error': 'No query provided'}, status=400)

        # Call your existing function to generate the playlist
        results = generate_playlist(query)

        # Optionally, create a Spotify playlist and add these tracks to it
        # For simplicity, this example just returns the track names
        songs = []
        for track in results['tracks']['items']:
            song = {
            'name': track['name'],
            'artist': track['artists'][0]['name'],
            'uri': track['uri'],
            'song_thumbnail_location': track['album']['images'][0]['url'] if track['album']['images'] else None,
            }
            songs.append(song)

        return Response(songs, status=status.HTTP_200_OK)
        return JsonResponse({
            'message': 'Playlist generated successfully',
            'tracks': track_names
        })

# Ensure to import PlaylistGeneratorView in your urls.py and route it appropriately
