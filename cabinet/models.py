from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid
import datetime


# Create your models here.

class Role(models.Model):
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=7, default='#FFFFFF')

    COLORS = [
        ('#FF0000', 'Красный'),
        ('#00FF00', 'Зеленый'),
        ('#0000FF', 'Синий'),
        ('#FFFF00', 'Желтый'),
        ('#FF00FF', 'Пурпурный'),
        ('#00FFFF', 'Голубой'),
        ('#FFFFFF', 'Белый'),
        ('#000000', 'Черный'),
        ('#808080', 'Серый'),
        ('#FFA500', 'Оранжевый'),
        ('#800080', 'Фиолетовый'),
        ('#008000', 'Темно-зеленый'),
    ]
    
    color = models.CharField(
        max_length=7,
        choices=COLORS,
        default='#FFFFFF',
    )
    
    def __str__(self):
        return self.name


class SubscriptionType(models.Model):
    name = models.CharField(max_length=255)

    price = models.DecimalField(max_digits=10, decimal_places=2) 
    duration = models.IntegerField() 

    is_active = models.BooleanField(default=True) # Активна ли подписка, тут мб для праздников и т.д.
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class User(AbstractUser):

    otp_secret = models.CharField(max_length=16, null=True, blank=True)
    otp_auth_url = models.CharField(max_length=100, null=True, blank=True)
    mfa_enabled = models.BooleanField(default=False)

    registration_date = models.DateTimeField(auto_now_add=True)
    last_login_date = models.DateTimeField(auto_now=True)
    HWID = models.CharField(max_length=100, blank=True, null=True)
    role_user = models.ForeignKey(Role, on_delete=models.CASCADE, null=True, blank=True)
    
    is_subscribed = models.BooleanField(default=False)
    subscription_end_date = models.DateTimeField(null=True, blank=True)
    subscription_type = models.ForeignKey(SubscriptionType, on_delete=models.CASCADE, null=True, blank=True)

    def get_HWID(self):
        return self.HWID
    
    def get_role(self):
        if self.role_user:
            return self.role_user.name
        else:
            return 'Default'

    def get_subscription_type(self):
        if self.is_subscribed and self.subscription_type:
            return self.subscription_type.name
        else:
            return "Free"
    
    def get_subscription_time_left(self):
        if not self.is_subscribed or not self.subscription_end_date:
            return {
                'years': 0,
                'days': 0,
                'hours': 0,
                'minutes': 0
            }
        
        now = timezone.now()
        if now > self.subscription_end_date:
            self.is_subscribed = False
            self.save()
            return {
                'years': 0,
                'days': 0,
                'hours': 0,
                'minutes': 0
            }
            
        time_left = self.subscription_end_date - now
        
        years = time_left.days // 365
        days = time_left.days % 365
        hours = time_left.seconds // 3600
        minutes = (time_left.seconds % 3600) // 60
        
        return {
            'years': years,
            'days': days,
            'hours': hours,
            'minutes': minutes
        }

    def __str__(self):
        return self.username
        
        
class LicenseKey(models.Model):
    key = models.CharField(max_length=64, unique=True)
    duration_days = models.IntegerField(default=30)
    
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    subscription_type = models.ForeignKey(SubscriptionType, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_used = models.BooleanField(default=False)
    
    used_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='license_keys')
    used_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.key} ({self.duration_days} дней)"
    
    def save(self, *args, **kwargs):
        if not self.key:
            self.key = str(uuid.uuid4()).replace('-', '').upper()
            
        if not self.expires_at and self.is_active:
            self.expires_at = timezone.now() + datetime.timedelta(days=30) 
            
        super().save(*args, **kwargs)


