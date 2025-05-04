from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import os


def get_default_avatar():
    return os.path.join('profile_pics', 'default.png')

class CustomUser(AbstractUser):
    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        default=get_default_avatar,
        blank=True
    )
    is_subscribed = models.BooleanField(default=False)
    registration_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


#TODO: Добавить историю действий пользователя   
class History(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action}"
