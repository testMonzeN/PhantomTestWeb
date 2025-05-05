from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse
from .forms import CustomUserCreationForm, CustomAuthenticationForm    
from .models import CustomUser




def account(request):
    if request.method == 'POST' and request.FILES.get('profile_picture'):
        user = request.user
        user.profile_picture = request.FILES['profile_picture']
        user.save()
        return JsonResponse({
            'success': True,
            'avatar_url': user.profile_picture.url
        })
    
    user = request.user
    return render(request, 'user/account.html', {
        'photo': user.profile_picture,
        'username': user.username,
        'email': user.email,
        'is_subscribed': user.is_subscribed
    })
    

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('main')
    else:
        form = CustomUserCreationForm()
    return render(request, 'registration/register.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('account')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})




