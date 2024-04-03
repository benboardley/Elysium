from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta
import os
class CustomUser(AbstractUser):
    # Your custom fields here
    # Should already contain:
    # username
    # email
    # password
    # first_name + last_name
    # is_active, is_staff, is_superuser
    spotify_access_token = models.CharField(max_length=50, blank=True)
    apple_access_token = models.CharField(max_length=50, blank=True)

    # Make username and email unique
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="profile")
    #id_user = models.IntegerField()
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    profile_image = models.ImageField(upload_to='profile_images', default="profile_images/default.png")
    creation_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    follow = models.ManyToManyField(
        "self",
        related_name="followers",
        symmetrical=False,
        blank=True
    )
    def __str__(self):
        return self.user.username

class SpotifyToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="spotifytoken")
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

class OAuthState(models.Model):
    state_value = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return self.expires_at < timezone.now()
    
    def save(self, *args, **kwargs):
        # Set expiration time to 15 minutes from now
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(minutes=15)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.state_value}"