from django.urls import path
from .views import (
    CabinetView, RegisterView, LoginView, 
    UserChangeView, ActivateKeyView, DownloadLauncherView, 
    LogoutView, Authentication
)



urlpatterns = [
    path('', CabinetView.as_view(), name='cabinet'),

    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('change/', UserChangeView.as_view(), name='change'),

    path('logout/', LogoutView.as_view(), name='logout'),
    
    path('download-launcher/', DownloadLauncherView.as_view(), name='download_launcher'),
    path('activate-key/', ActivateKeyView.as_view(), name='activate_key'),

    path('authentication/', Authentication.as_view(), name='authentication'),

]
    
