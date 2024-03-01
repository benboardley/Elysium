from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics, permissions, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from user.models import CustomUser, Profile, SpotifyToken
from user.credentials import CLIENT_ID, CLIENT_SECRET
from ..models import Song
from .serializers import SongSerializer
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from .utils import get_playlist_id
# Create your views here.

class GetSpotifyPlaylists(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        if user.spotifytoken:
            spotifytoken = user.spotifytoken
            playlist_list = []
            if(spotifytoken):
                sp = spotipy.Spotify(auth=spotifytoken.access_token)
                try:
                    playlists = sp.current_user_playlists()
                    for playlist in playlists['items']:
                        playlist_list.append([playlist['name'], playlist['id']])
                except spotipy.SpotifyException as e:
                    # Handle Spotify API errors if necessary
                    print(f"Spotify API Error: {e}")
                    return Response({'error': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                code = status.HTTP_200_OK
                message = {'playlists': playlist_list[:3]}
        else:
            code = status.HTTP_400_BAD_REQUEST
            message = {'message': 'Connect with spotify to see playlists'}
        return Response(message, status=code)    

class SpotifySongs(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):
        '''
        track_list = []
        try:
            sp = spotipy.Spotify(auth=spotifytoken.access_token)
            top_tracks = sp.current_user_top_tracks(limit=10)
            for track in top_tracks['items']:
                track_list.append(track)
        except:
            pass
        if track_list:
            code = status.HTTP_200_OK
            message = {'playlists': track_list[:3]}
        else:
            code = status.HTTP_400_BAD_REQUEST
            message = {'message': 'Connect with spotify to see tracks'}
        return Response(message, code)
        '''
        pass

    def post(self, request):
        try:
            user = request.user
            #print(request.data)
            if user.spotifytoken:
                sp = spotipy.Spotify(auth=user.spotifytoken.access_token)
                song_uris = request.data['uri']
                
                if 'location' in request.data and request.data['location']:
                    id = get_playlist_id(request.data['location'], user.spotifytoken)
                    sp.playlist_add_items(id, song_uris)
                sp.current_user_saved_tracks_add(song_uris)
                return Response({'message': 'Song added successfully!'}, status=status.HTTP_200_OK)
            else:
                code = status.HTTP_400_BAD_REQUEST
                message = {'error': 'Connect with spotify to add songs'}
                return Response(message, code)
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class StoredSongs(APIView):

    #def get(self, request, id):
    #    song = get_object_or_404(Song, id = id)
    #    serialized_song = SongSerializer(song)
    #    return Response(serialized_song, status=status.HTTP_200_OK)
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        user = request.user
        
        try:
            if user.spotifytoken:
                print(data)
                uri = data['uri']
                # Check if the song with the given URI already exists
                existing_song = Song.objects.filter(uri=uri).first()
                if existing_song:
                    # If the song already exists, return its data
                    song_data = SongSerializer(existing_song).data
                    return Response(song_data, status=status.HTTP_200_OK)

                #auth_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
                #sp = spotipy.Spotify(auth_manager=auth_manager)
                print(user.spotifytoken.access_token)
                sp = spotipy.Spotify(auth=user.spotifytoken.access_token)
                track_info = sp.track(uri, market=None)
                print(track_info)

                # Get audio features for the track
                audio_features = sp.audio_features(uri)

                # Create a dictionary with the desired information
                if len(track_info['artists']) > 1:
                    features = [track["name"] for track in track_info['artists'][1:]]
                else:
                    features = None

                song_data = {
                    #'album': track_info['album']['name'],
                    'name': track_info['name'],
                    'artist': track_info['artists'][0]['name'],
                    'artist_features': features,
                    'origin': 'spotify',
                    'uri': uri,
                    'audio_features': audio_features[0] if audio_features else None,
                    'other_available_platforms': [],
                    'song_clip_location': track_info['preview_url'],
                    'song_thumbnail_location': track_info['album']['images'][0]['url'] if track_info['album']['images'] else None,
                }

                # Save the new song to the database
                song_serializer = SongSerializer(data=song_data)
                if song_serializer.is_valid():
                    song_serializer.save()
                    return Response(song_serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(song_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                code = status.HTTP_400_BAD_REQUEST
                message = {'error': 'Connect with spotify to add songs'}
                return Response(message, code)
        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSpotifyTopSong(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        spotifytoken = user.spotifytoken
        print(spotifytoken)
        track = []
        if(spotifytoken):
            sp = spotipy.Spotify(auth=spotifytoken.access_token)
            try:
                top_track = sp.current_user_top_tracks(limit=1)
                for song in top_track['items']:
                    track = ([song['name'],
                                song['album']['artists'][0]['name'],
                                song['album']['images'][1]['url'],
                                song['preview_url']])
            except spotipy.SpotifyException as e:
                # Handle Spotify API errors if necessary
                print(f"Spotify API Error: {e}")
        if(track):
            code = status.HTTP_200_OK
            message = {'song': track}
        else:
            code = status.HTTP_404_NOT_FOUND
            message = {'message': 'Connect with spotify to see playlists'}
        return Response(message, status=code)