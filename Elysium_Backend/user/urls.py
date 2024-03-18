from django.urls import path
from .api.views import *
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('follow/', Follow.as_view(), name='follow'),
    path('follow/<int:id>', Follow.as_view(), name='follow'),
    path('followers/', Followers.as_view(), name='followers'),
    path('profile/<int:id>', ProfileView.as_view(), name='profile'),
    path('search/<str:substring>', UserSearch.as_view(), name='profile-search'),
    path('spotify/get-auth-url', AuthURL.as_view()),
    path('spotify/redirect', spotify_callback),
    path('spotify/is-authenticated', SpotifyAuthenticated.as_view())
]