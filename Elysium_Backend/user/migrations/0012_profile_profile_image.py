# Generated by Django 5.0.1 on 2024-03-25 00:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0011_oauthstate'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='profile_image',
            field=models.ImageField(default='profile_images/default.jpg', upload_to='profile_images'),
        ),
    ]
