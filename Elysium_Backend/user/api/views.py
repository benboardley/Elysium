from django.shortcuts import render
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
#from rest_auth.views import LoginView
from .serializers import UserSerializer, ProfileSerializer
from ..models import *

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

    def get(self, request,id):
        profile = get_object_or_404(Profile,id=id)
        print(profile.post_set.first())
        serializer = ProfileSerializer(profile, context={'request': request})
        print(serializer.data)
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

        
class Following(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Your endpoint logic here
        user = self.request.user
        profile = user.profile.first()
        following = profile.follow.all()
        response_data = ProfileSerializer(following, many=True)
        return Response(response_data.data, status=status.HTTP_200_OK)
    
class Follow(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        # Your endpoint logic here
        user = self.request.user
        profile = user.profile.follow.get(id=id)
        response_data = ProfileSerializer(following, many=True)
        return Response(response_data.data, status=status.HTTP_200_OK)