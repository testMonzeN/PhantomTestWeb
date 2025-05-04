from django.http import HttpResponse
from django.shortcuts import render, redirect
import os
import Phantom.settings as settings
from django.contrib.auth.decorators import login_required



def main(request):
    return render(request, 'main/index.html')

def redirect_to_telegram(request):
    return redirect('https://t.me/phantom_dlc/')

def redirect_to_discord(request):
    return redirect('https://discord.gg/phantomdlc/')

#TODO поставить нормальный файл!
@login_required
def download_launcher(request):
    if not request.user.is_subscribed:
        return redirect('subscription_required')  # Или render с сообщением

    file_path = os.path.join(settings.BASE_DIR, 'YOUR_FILE.txt')
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/vnd.ms-exe")
            response['Content-Disposition'] = 'inline; filename=HZ.txt'
            return response

def subscription_required(request):
    return render(request, 'main/subscription_required.html')