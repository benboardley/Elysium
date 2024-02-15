from django.urls import path
from .api.views import *
urlpatterns = [
    path('posts/', Posts.as_view(), name='posts'),
    path('posts/<int:id>', AccessPost.as_view(), name='single post'),
]