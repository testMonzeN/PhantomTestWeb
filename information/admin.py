from django.contrib import admin
from .models import ClanMember, Role, LinksMember


# Register your models here.
admin.site.register(ClanMember)
admin.site.register(Role)
admin.site.register(LinksMember)
