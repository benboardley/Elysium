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
from ..models import Post, SongPost, PlaylistPost, AlbumPost
from music.api.serializers import SongSerializer, PlaylistSerializer, AlbumSerializer
from music.models import Song, Playlist, Album
from music.api.utils import get_song_data, create_playlist, create_album
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
        posts = Post.objects.filter(songpost__isnull=True, playlistpost__isnull=True, albumpost__isnull=True)
        song_posts = SongPost.objects.all()
        playlist_posts = PlaylistPost.objects.all()
        album_posts = AlbumPost.objects.all()
        combined_posts = list(posts) + list(song_posts) + list(playlist_posts) + list(album_posts)
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
        album_uri = request.data.get('album_uri', None)
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
                elif album_uri:
                    album = Album.objects.filter(uri=album_uri).first()
                    album, created = create_album(album_uri)
                    if not album:
                        return Response({"error": "Album not found or Try again later"}, status=status.HTTP_404_NOT_FOUND) 
                    out = serializer.save(album_uri = album.uri)
                    if out:
                        return Response(serializer.data, status=status.HTTP_201_CREATED)   
                    return Response(song_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    serializer.save() 
            except Exception as e:
                print(e)
                return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
                
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self,request,id):
        user = request.user
        user_profile = user.profile
        song_uri = request.data.get('song_uri', None)
        playlist_uri = request.data.get('playlist_uri', None)
        album_uri = request.data.get('album_uri', None)
        # Attempt to fetch a generic post, a song post, or a playlist post
        try:
            post = SongPost.objects.get(id=id, profile=user_profile)
        except SongPost.DoesNotExist:
            post = None

        if not post:
            try:
                post = PlaylistPost.objects.get(id=id, profile=user_profile)
            except PlaylistPost.DoesNotExist:
                post = None

        if not post:
            try:
                post = AlbumPost.objects.get(id=id, profile=user_profile)
            except PlaylistPost.DoesNotExist:
                post = None

        if not post:
            try:
                post = Post.objects.get(id=id, profile=user_profile)
            except Post.DoesNotExist:
                return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create a mutable copy of the request data and update profile
        mutable_data = request.data.copy()
        mutable_data['profile'] = user_profile.pk

        # Use the correct serializer based on the type of post
        if isinstance(post, SongPost):
            serializer = PostSerializer(post, data=mutable_data, partial=True)
            if serializer.is_valid():
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
                        return Response({"message": "Update successful"}, status=status.HTTP_202_ACCEPTED)
            
                post = serializer.save()
                return Response({"message": "Update successful"}, status=status.HTTP_202_ACCEPTED)
            return Response(song_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif isinstance(post, PlaylistPost):
            serializer = PostSerializer(post, data=mutable_data, partial=True)
            if serializer.is_valid():
                if playlist_uri:
                    playlist, created = create_playlist(playlist_uri)
                    if not playlist:
                        return Response({"error": "Playlist not found or Try again later"}, status=status.HTTP_404_NOT_FOUND) 
                    out = serializer.save(playlist_uri = playlist_uri)
                else:
                    out = serializer.save()
                if out:
                    return Response({"message": "Update successful"}, status=status.HTTP_202_ACCEPTED)   
            return Response(song_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif isinstance(post, AlbumPost):
            serializer = PostSerializer(post, data=mutable_data, partial=True)
            if serializer.is_valid():
                if album_uri:
                    playlist, created = create_album(album_uri)
                    if not playlist:
                        return Response({"error": "Playlist not found or Try again later"}, status=status.HTTP_404_NOT_FOUND) 
                    out = serializer.save(album_uri = album_uri)
                else:
                    out = serializer.save()
                if out:
                    return Response({"message": "Update successful"}, status=status.HTTP_202_ACCEPTED)   
            return Response(song_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = PostSerializer(post, data=mutable_data, partial=True)
            if serializer.is_valid():
                post = serializer.save()
                return Response({"message": "Update successful"}, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self,request, id):
        post = get_object_or_404(Post, id=id, profile = request.user.profile)
        post.delete()
        return Response({"message":"delete successful"}, status=status.HTTP_202_ACCEPTED)
        
class PlaylistPosts(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None):
        # Existing implementation for handling specific post retrieval...

        # For listing posts:
        posts = get_object_or_404(PlaylistPost, id=id)
        page = self.request.query_params.get('page', 1)
        page_size = self.request.query_params.get('page_size', 50)
        # Assuming you are serializing PlaylistPost instances that include playlists...
        # You need to pass the pagination context to each serializer
        context = {'request': request, 'page': int(page), 'page_size': int(page_size)}
        post_serializers = PostSerializer(posts, context=context)
        print(len(post_serializers.data['playlist_post']['songs']))
        return Response(post_serializers.data, status=status.HTTP_200_OK)

class FollowFeed(APIView):

    #authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile

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