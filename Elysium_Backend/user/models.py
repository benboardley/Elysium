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
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)