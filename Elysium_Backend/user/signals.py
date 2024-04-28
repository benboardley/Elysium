from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db import models
from django.contrib.auth.models import User
from .models import CustomUser, Profile
from .api.serializers import ProfileSerializer

@receiver(post_save, sender=CustomUser)
def create_profile(sender, instance, created, **kwargs):
    if created:
        # Use the ProfileSerializer to create a profile instance
        user_profile = Profile(user=instance)
        user_profile.save()
        profile = Profile.objects.get(user=instance)
        user_profile.follow.add(profile.id)
        user_profile.save()


