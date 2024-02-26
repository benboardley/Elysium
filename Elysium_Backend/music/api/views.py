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
import spotipy
# Create your views here.

class GetSpotifyPlaylists(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        spotifytoken = user.spotifytoken
        print(spotifytoken)
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
        if(len(playlist_list)):
            code = status.HTTP_200_OK
            message = {'playlists': playlist_list[:3]}
        else:
            code = status.HTTP_404_NOT_FOUND
            message = {'message': 'Connect with spotify to see playlists'}
        return Response(message, status=code)


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