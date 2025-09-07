from django.db import models
from cabinet.models import User
from django.views import View

# Create your models here.
class UserLoginHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    
    text = models.TextField()
    
    def __str__(self):
        return f"{self.user.username} - {self.date}"
    