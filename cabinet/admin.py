from django.contrib import admin
from .models import User, Role, LicenseKey, SubscriptionType
# Register your models here.

admin.site.register(User)
admin.site.register(Role)
admin.site.register(LicenseKey)
admin.site.register(SubscriptionType)
