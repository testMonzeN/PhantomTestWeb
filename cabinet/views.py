from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import CustomUserRegisterForm, CustomLoginForm, CustomUserChangeForm
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from .models import User, LicenseKey
from django.utils import timezone
import datetime
from django.contrib import messages


# Личный кабинет
class CabinetView(View):
   def get(self, request):
        user = request.user
        subscription_time = user.get_subscription_time_left()
        
        key_activation_message = None
        key_activation_success = False
        
        storage = messages.get_messages(request)
        for message in storage:
            key_activation_message = message.message
            key_activation_success = message.level == messages.SUCCESS
            storage.used = False
            break
        
        return render(request, 'account/index.html', {
            'user': user, 
            'subscription_time': subscription_time,
            'key_activation_message': key_activation_message,
            'key_activation_success': key_activation_success
        })

# Регистрация пользователя
class RegisterView(View):
    def get(self, request):
        form = CustomUserRegisterForm()
        return render(request, 'registration/registration.html', {'form': form})
    
    def post(self, request):
        form = CustomUserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('cabinet')
        return render(request, 'registration/registration.html', {'form': form})

# Вход пользователя
class LoginView(View):
    def get(self, request):
        form = CustomLoginForm()
        return render(request, 'login/login.html', {'form': form})
    
    def post(self, request):
        form = CustomLoginForm(request.POST)
        
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            
            user = authenticate(username=username, password=password)
            
            if user is not None:
                login(request, user)
                return redirect('cabinet')
            else:
                try:
                    user = User.objects.get(username=username)
                    if check_password(password, user.password):
                        login(request, user)
                        return redirect('cabinet')
                except User.DoesNotExist:
                    pass
                
                form.add_error(None, "Неверное имя пользователя или пароль")
        
        return render(request, 'login/login.html', {'form': form})


# Представление для активации ключа
class ActivateKeyView(View):   
    def post(self, request):
        key_value = request.POST.get('license_key')
        
        if not key_value:
            messages.error(request, 'Ключ не указан')
            return redirect('cabinet')
        
        try:
            license_key = LicenseKey.objects.get(key=key_value, is_active=True, is_used=False)
            
            user = request.user
            user.is_subscribed = True
            
            if user.subscription_end_date:
                now = timezone.now()
                if user.subscription_end_date < now:
                    user.subscription_end_date = now
                
                user.subscription_end_date += datetime.timedelta(days=license_key.duration_days)
            else:
                user.subscription_end_date = timezone.now() + datetime.timedelta(days=license_key.duration_days)
                
            if license_key.role:
                user.role_user = license_key.role
            
            if license_key.subscription_type:
                user.subscription_type = license_key.subscription_type
            
            user.save()
            

            license_key.is_used = True
            license_key.used_by = user
            license_key.used_at = timezone.now()
            license_key.save()
            
            messages.success(request, f'Ключ успешно активирован! Добавлено {license_key.duration_days} дней подписки.')
            
        except LicenseKey.DoesNotExist:
            messages.error(request, 'Недействительный или уже использованный ключ')
            
        return redirect('cabinet')

# Изменение пользователя
# TODO: Добавить проверку на аутентификацию пользователя + html
class UserChangeView(View):   
    def get(self, request):
        form = CustomUserChangeForm(instance=request.user)
        return render(request, 'account/change.html', {'form': form})
    
    def post(self, request):
        form = CustomUserChangeForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('cabinet')
        return render(request, 'account/change.html', {'form': form})
