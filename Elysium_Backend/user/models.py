from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Your custom fields here
    # Should already containt:
    # username
    # email
    # password
    # first_name + last_name
    # is_active, is_staff, is_superuser
    pass

class Profile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    id_user = models.IntegerField()
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    #profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    spotify_access_token = models.CharField(max_length=50, blank=True)
    apple_access_token = models.CharField(max_length=50, blank=True)
    following = models.ManyToManyField(
        "self",
        related_name="followers",
        symmetrical=False,
        blank=True
    )
    def __str__(self):
        return self.user.username