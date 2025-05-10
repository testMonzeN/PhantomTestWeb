from django.shortcuts import render
from .models import UserLoginHistory
from django.utils import timezone
from django.views import View


# Create your views here.

class LogsView(View):
    def __init__(self, user, text):
        self.user = user
        self.text = text
        self.date = timezone.now()

    def post(self):
        log = UserLoginHistory

        log.user = self.user
        log.date = self.date
        log.text = self.text

        log.save()

