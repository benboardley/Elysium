from django.urls import path
from .api.views import *
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('follow/', Following.as_view(), name='follow'),
    path('profile/<int:id>', ProfileView.as_view(), name='profile'),
]