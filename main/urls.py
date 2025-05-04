from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='main'),

    path('download-launcher', views.download_launcher, name='download-launcher'),
    path('subscription-required', views.subscription_required, name='subscription_required'),

    path('#', views.redirect_to_telegram, name='telegram'),
    path('?', views.redirect_to_discord, name='discord'),
]
