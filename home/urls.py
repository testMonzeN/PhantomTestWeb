from django.urls import path
from . import views
from .views import IndexView, FeaturesView, PricingView, ContactsView, UserAgreementView, PersonalDataProcessingView, TeemsAndConditionsView


urlpatterns = [
    path('', IndexView.as_view(), name='home'),
    path('features/', FeaturesView.as_view(), name='features'),
    path('pricing/', PricingView.as_view(), name='pricing'),
    path('contacts/', ContactsView.as_view(), name='contacts'),  

    path('papers/user-agreement/', UserAgreementView.as_view(), name ='user-agreement'),
    path('papers/personal-data-processing/', PersonalDataProcessingView.as_view(), name='personal-data-processing'),
    path('papers/teems-and-conditions/', TeemsAndConditionsView.as_view(), name='teems-and-conditions'),
]

