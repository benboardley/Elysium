from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from ..models import CustomUser, Profile
from social.models import Post
from social.api.serialzers import PostSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'first_name', 'last_name')
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super(UserSerializer, self).create(validated_data)
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # These are claims, you can add custom claims
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['username'] = user.username
        token['email'] = user.email
        token['bio'] = user.profile.bio
        #token['image'] = str(user.profile.image)
        #token['verified'] = user.profile.verified
        # ...
        return token

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    username = serializers.SerializerMethodField()
    #posts = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    #posts = PostSerializer(many=True, read_only=True)
    #posts = serializers.RelatedField(queryset=Post.objects.all(),many=True)
    posts = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    creation_time = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'

    
    def get_posts(self, obj):
        post_ids = obj.post_set.all().values_list('pk', flat=True)  # Assuming 'posts' is the related name in your Profile model
        return list(post_ids)
    def get_username(self, obj):
        return obj.user.username
    
    def get_followers(self, obj):
        post_ids = obj.followers.all().values_list('pk', flat=True)  # Assuming 'posts' is the related name in your Profile model
        return list(post_ids)
'''
    def create(self, validated_data):
        # Extract user data from validated_data
        user_data = validated_data.pop('user')

        # Get the CustomUser instance or create a new one if it doesn't exist
        user, created = CustomUser.objects.get_or_create(**user_data)

        # Create a new Profile instance with the user field
        
        profile = Profile.objects.create(user=user, **validated_data)

        # Set the id_user for the profile
        profile.id_user = user.pk

        # Save the profile
        profile.save()

        return profile
'''