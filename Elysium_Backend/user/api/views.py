from django.shortcuts import render, redirect
from django.http import JsonResponse
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView
from requests import Request, post
from ..credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from .serializers import UserSerializer, ProfileSerializer, MyTokenObtainPairSerializer, ProfileSearchSerializer
from .utils import create_user_tokens, is_spotify_authenticated, get_user_tokens
from ..models import *
from datetime import datetime
from social.api.serializers import PostSerializer
from social.models import Post, SongPost, PlaylistPost, AlbumPost
import secrets

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # If the data is valid, save the user and return a success response
            user = serializer.save()
            response_data = {
                'message': 'User registered successfully',
                'user_id': user.id,
                'username': user.username,
                # Add other user details as needed
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            # If the data is not valid, return a response with errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    print(datetime.today())
    serializer_class = MyTokenObtainPairSerializer
'''
class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        provider = request.data.get('provider')  # You may add a 'provider' field in the request data
        if provider:
            # Handle OAuth authentication
            return self.handle_oauth_login(request, provider)
        else:
            # Handle custom authentication
            return self.handle_custom_login(request)

    def handle_custom_login(self, request):
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=401)

    def handle_oauth_login(self, request, provider):
        # Implement OAuth authentication logic for the specified provider
        # You can use a library like `allauth` for this purpose
        # Example: Google OAuth2
        if provider == 'google':
            adapter = GoogleOAuth2Adapter()
            client = OAuthClient(adapter, allauth_settings.SOCIALACCOUNT_QUERY_EMAIL)
            state = SocialAccount.generate_nonce()
            login_url = adapter.get_authorize_url(
                state,
                redirect_uri=adapter.get_callback_url(request, app=adapter.provider_id),
            )
            return JsonResponse({'login_url': login_url, 'state': state})
        else:
            return Response({'error': 'Invalid OAuth provider'}, status=400)
'''
class UserLoginView(APIView):
    
    def post(self, request, *args, **kwargs):
        print(request.data)
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=401)      

        
class ProfileView(APIView):
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    permission_classes = [permissions.AllowAny]
    def get(self, request, id):
        profile = get_object_or_404(Profile,id=id)
        #print(profile.post_set.first())
        serializer = ProfileSerializer(profile, context={'request': request})
        #print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def put(self, request, id):
        profile = get_object_or_404(Profile, id=id)
        profile_serializer = ProfileSerializer(profile, data=request.data)

        if profile_serializer.is_valid():
            profile = profile_serializer.save()
            return Response({"message":"update successful"}, status=status.HTTP_202_ACCEPTED)
        return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, id):
        profile = get_object_or_404(Profile, id=id)
        profile.delete()
        return Response({"message":"delete successful"}, status=status.HTTP_202_ACCEPTED)
    
class UserSearch(APIView):
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    
    def get(self, request, substring, *args, **kwargs):
        # Your endpoint logic
        profiles = Profile.objects.filter(user__username__icontains=substring)
        response_data = ProfileSearchSerializer(profiles, many=True)
        if not profiles:
            return Response({"message":"No profiles found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(response_data.data, status=status.HTTP_200_OK)
class PersonalView(APIView):
    #authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)   

class ProfilePosts(APIView):
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]

    def get(self, request,id):
        profile = get_object_or_404(Profile, id=id)
        posts = Post.objects.filter(songpost__isnull=True, playlistpost__isnull=True, albumpost__isnull=True, profile=profile)
        song_posts = SongPost.objects.filter(profile=profile)
        playlist_posts = PlaylistPost.objects.filter(profile=profile)
        album_posts = AlbumPost.objects.filter(profile=profile)
        combined_posts = list(posts) + list(song_posts) + list(playlist_posts) + list(album_posts)
        sorted_posts = sorted(combined_posts, key=lambda post: post.creation_time, reverse=True)
        serializer = PostSerializer(sorted_posts, many=True)
        sorted_posts = sorted(combined_posts, key=lambda post: post.creation_time, reverse=True)
        serializer = PostSerializer(sorted_posts, many=True)
        #serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class Followers(APIView):
   # authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Your endpoint logic here
        user = self.request.user
        profile = user.profile
        followers = profile.followers.all()
        response_data = ProfileSearchSerializer(followers, many=True)
        return Response(response_data.data, status=status.HTTP_200_OK)
    
class Follow(APIView):
    #authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id = None, *args, **kwargs):
        # Your endpoint logic here
        user = request.user
        profile = user.profile
        following = profile.follow.all()
        response_data = ProfileSearchSerializer(following, many=True)
        return Response(response_data.data, status=status.HTTP_200_OK)
    
    def post(self, request, id = None, *args, **kwargs):
        user = request.user
        profile = user.profile
        profile_to_follow = get_object_or_404(Profile, id=request.data['id'])
        profile.follow.add(profile_to_follow)
        return Response({"message":"followed"}, status=status.HTTP_202_ACCEPTED)
    
    def delete(self, request, id = None, *args, **kwargs):
        user = request.user
        profile = user.profile
        profile_to_unfollow = get_object_or_404(Profile, id=id)
        profile.follow.remove(profile_to_unfollow)
        return Response({"message":"unfollowed"}, status=status.HTTP_202_ACCEPTED)
    
class AuthURL(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        print("in here")
        state_value = secrets.token_urlsafe(16)
        scopes = 'user-library-read user-top-read playlist-modify-private playlist-modify-public user-library-modify'
        OAuthState.objects.create(state_value=state_value, user = request.user)
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'state': state_value
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    #serializer_class = UserSerializer
    #permission_classes = [permissions.AllowAny]
    code = request.GET.get('code')
    state_value = request.GET.get('state')
    print('callback')
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'state': state_value,
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    create_user_tokens(
        state_value, access_token, token_type, expires_in, refresh_token)

    return redirect('http://localhost:8080/')


class SpotifyAuthenticated(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        is_authenticated = is_spotify_authenticated(
            request.user)
        print(is_authenticated)
        return Response({'auth': is_authenticated}, status=status.HTTP_200_OK)