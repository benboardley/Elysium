from django.db import models
from django.contrib.auth.models import AbstractUser

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
    #profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
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