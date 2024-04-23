from django.urls import path
from .views import PlaylistGeneratorView

urlpatterns = [
    path('generate/', PlaylistGeneratorView.as_view(), name='generate'),
]
