from django.shortcuts import render, get_object_or_404
from .models import ClanMember, Role
from django.views import View


# Create your views here.
class BravoTeam_list(View):
    def get(self, request):
        members = ClanMember.objects.all().order_by('role')
        return render(request, 'team_list/bravo_team.html', context={
            'members': members,
            })


class MemberInfo(View):
    def get(self, request, pk):
        member = get_object_or_404(ClanMember, pk=pk)
        return render(request, 'team_list/member_info.html', context={
            'member': member,
            })


class InformationAboutTeam(View):
    def get(self, request):
        return render(request, 'about/information_about_team.html')
