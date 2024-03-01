from django.urls import path
from .api.views import *
urlpatterns = [
    path('posts/', Posts.as_view(), name='posts'),
    path('posts/<int:id>', Posts.as_view(), name='post'),
    path('/posts/follow/', FollowFeed.as_view(), name='follow-feed'),
    path('public/', PublicFeed.as_view(), name='public-feed'),
]