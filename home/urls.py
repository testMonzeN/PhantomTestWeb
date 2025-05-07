from django.urls import path
from . import views
from .views import IndexView, FeaturesView, PricingView, ContactsView


urlpatterns = [
    path('', IndexView.as_view(), name='home'),
    path('features/', FeaturesView.as_view(), name='features'),
    path('pricing/', PricingView.as_view(), name='pricing'),
    path('contacts/', ContactsView.as_view(), name='contacts'),  
]

