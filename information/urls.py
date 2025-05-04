from django.urls import path
from .views import BravoTeam_list, MemberInfo, InformationAboutTeam

urlpatterns = [
    path('', BravoTeam_list.as_view(), name='members_list'),
    path('<int:pk>/', MemberInfo.as_view(), name='member_info'),
    path('about/', InformationAboutTeam.as_view(), name='information_about_team'),
]

