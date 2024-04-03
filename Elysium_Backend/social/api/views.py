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
from .serializers import PostSerializer
from user.models import CustomUser, Profile
from ..models import Post, SongPost, PlaylistPost
from music.api.serializers import SongSerializer, PlaylistSerializer
from music.models import Song, Playlist
from music.api.utils import get_song_data, create_playlist
# Create your views here.

class Posts(APIView):
    #authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request, id=None):
        if id:
            post = Post.objects.filter(songpost__isnull=True, id=id)
            if post:
                post_serializer = PostSerializer(post)
                return Response(post_serializer.data, status=status.HTTP_200_OK)
            song_posts = SongPost.objects.filter(id = id)
            if song_posts:
                post_serializer = PostSerializer(post)
                return Response(post_serializer.data, status=status.HTTP_200_OK)
            
            return Response({"message":"Post not found"}, status=status.HTTP_404_NOT_FOUND)
        posts = Post.objects.filter(songpost__isnull=True, playlistpost__isnull=True)
        song_posts = SongPost.objects.all()
        playlist_posts = PlaylistPost.objects.all()
        combined_posts = list(posts) + list(song_posts) + list(playlist_posts)
        sorted_posts = sorted(combined_posts, key=lambda post: post.creation_time, reverse=True)
        post_serializers = PostSerializer(sorted_posts, many=True)
        return Response(post_serializers.data, status=status.HTTP_200_OK)
    
    def post(self, request, id=None, *args, **kwargs):
        user_profile = request.user.profile

        if not user_profile:
            return Response({"error": "User profile not found"}, status=status.HTTP_400_BAD_REQUEST)

        mutable_data = request.data.copy()
        mutable_data['profile'] = user_profile.pk
        
        # Assuming you have a PostSerializer defined
        serializer = PostSerializer(data=mutable_data)
        song_uri = request.data.get('song_uri', None)
        playlist_uri = request.data.get('playlist_uri', None)
        if serializer.is_valid():
            try:
                if song_uri:
                    
                        song = Song.objects.filter(uri=song_uri).first()
                        if not song:
                            song_serializer = get_song_data(song_uri)
                            if song_serializer.is_valid():
                                song = song_serializer.save()
                            else:
                                return Response(song_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                        out = serializer.save(song_uri = song.uri)
                        if out:
                            return Response(serializer.data, status=status.HTTP_201_CREATED)   
                        return Response(song_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                elif playlist_uri:
                    playlist = Playlist.objects.filter(uri=playlist_uri).first()
                    playlist, created = create_playlist(playlist_uri)
                    if not playlist:
                        return Response({"error": "Playlist not found or Try again later"}, status=status.HTTP_404_NOT_FOUND) 
                    out = serializer.save(playlist_uri = playlist.uri)
                    if out:
                        return Response(serializer.data, status=status.HTTP_201_CREATED)   
                    return Response(song_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    
            except Exception as e:
                print(e)
                return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
                
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self,request,id):
        user = request.user
        user_profile = user.profile
        post = get_object_or_404(Post, id=id, profile = user_profile)
        mutable_data = request.data.copy()
        mutable_data['profile'] = user_profile.pk
        post_serializer = PostSerializer(post, data=mutable_data, partial=True)

        if post_serializer.is_valid():
            post = post_serializer.save()
            return Response({"message":"update successful"}, status=status.HTTP_202_ACCEPTED)
        return Response(post_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self,request, id):
        post = get_object_or_404(Post, id=id, profile = request.user.profile)
        post.delete()
        return Response({"message":"delete successful"}, status=status.HTTP_202_ACCEPTED)
        


class FollowFeed(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile.first()

        following = profile.follow.all()
        feed = []

        for prof in following:
            feed.extend(prof.post_set.all())

        # Sort the feed based on timestamp
        sorted_feed = sorted(feed, key=lambda post: post.creation_time, reverse=True)

        serialized_feed = PostSerializer(sorted_feed, many=True)
        # Now you can proceed with the serialized_feed using sorted_feed
        # ...

        return Response(serialized_feed.data, status=status.HTTP_200_OK)
    
class PublicFeed(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        #profile = user.profile.first()

        users = Profile.objects.exclude(user=user)
        feed = []

        for prof in users:
            feed.extend(prof.post_set.all())

        # Sort the feed based on timestamp
        sorted_feed = sorted(feed, key=lambda post: post.creation_time, reverse=True)

        serialized_feed = PostSerializer(sorted_feed, many=True)
        # Now you can proceed with the serialized_feed using sorted_feed
        # ...

        return Response(serialized_feed.data, status=status.HTTP_200_OK)

'''
serializer_mapping = {
    Post: PostSerializer,
    SongPost: SongPostSerializer,
    AlbumPost: AlbumPostSerializer,
}

all_posts = Post.objects.all()

serialized_data = []
for post in all_posts:
    model_class = post.__class__
    serializer_class = serializer_mapping.get(model_class, PostSerializer)
    serializer = serializer_class(post)
    serialized_data.append(serializer.data)
'''