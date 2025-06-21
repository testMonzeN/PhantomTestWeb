from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import login
from .forms import CustomUserRegisterForm, CustomLoginForm, CustomUserChangeForm, OtpCodeUserChangeForm
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from .models import User, LicenseKey, Role
from django.utils import timezone
import datetime
from django.contrib import messages
from logs.views import LogsView
import os
from django.http import HttpResponse
from django.conf import settings
from django.contrib.auth import logout

import pyotp
import qrcode
import io
import base64

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
            break
    
        if not user.is_subscribed and user.get_role() != 'Developer':
            user.role_user = Role.objects.get(name='Default')
            user.save()
        
        if user.get_role() == 'Developer':
            status_user = 'DEVELOPER'
        elif user.is_subscribed:
            status_user = 'PREMIUM USER'
        else:
            status_user = 'DEFAULT USER'
            
        return render(request, 'account/index.html', {
            'user': user, 
            'is_subscribed': user.is_subscribed,
            'status_2fa': user.mfa_enabled,
            'mfa_enabled': user.mfa_enabled, 
            'status_user': status_user,
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
        if 'code' in request.POST:
            form2 = OtpCodeUserChangeForm(request.POST)
            username = request.session.get('tmp_username')
            password = request.session.get('tmp_password')
            if not username or not password:
                return redirect('login')
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return redirect('login')
            if form2.is_valid():
                code = form2.cleaned_data.get('code')
                totp = pyotp.TOTP(user.otp_secret)
                if totp.verify(code):
                    login(request, user)

                    request.session.pop('tmp_username', None)
                    request.session.pop('tmp_password', None)
                    return redirect('cabinet')
                else:
                    form2.add_error('code', 'Неверный код')
            return render(request, '2-fa/accept.html', {'form': form2})

        # Обычный вход 
        form = CustomLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.mfa_enabled:
                    request.session['tmp_username'] = username
                    request.session['tmp_password'] = password
                    form2 = OtpCodeUserChangeForm()
                    return render(request, '2-fa/accept.html', {'form': form2})
                else:
                    login(request, user)
                    return redirect('cabinet')
            else:
                try:
                    user = User.objects.get(username=username)
                    if check_password(password, user.password):
                        if user.mfa_enabled:
                            request.session['tmp_username'] = username
                            request.session['tmp_password'] = password
                            form2 = OtpCodeUserChangeForm()
                            return render(request, '2-fa/accept.html', {'form': form2})
                        else:
                            login(request, user)
                            return redirect('cabinet')
                except User.DoesNotExist:
                    pass
                
                form.add_error(None, "Неверное имя пользователя или пароль")
        
        LogsView(request.user.username, 'Вход в систему')
        return render(request, 'login/login.html', {'form': form})



class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('home')
    
    def post(self, request):
        logout(request)
        request.session.clear()
        return redirect('home')
    
    

# Представление для активации ключа
class ActivateKeyView(View):   
    def post(self, request):
        user = request.user
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
            LogsView(user, f'Ключ {key_value} успешно активирован! Добавлено {license_key.duration_days} дней подписки')    

        except LicenseKey.DoesNotExist:
            messages.error(request, 'Недействительный или уже использованный ключ')
               
        return redirect('cabinet')

# Изменение пароля пользователя (если не зарегистрирован, то нельзя)
class UserChangeView(View):   
    def get(self, request):
        form = CustomUserChangeForm(user=request.user)
        return render(request, 'account/change.html', {'form': form})
    
    def post(self, request):
        form = CustomUserChangeForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Пароль успешно изменен')
            LogsView(request.user, 'Пароль успешно изменен')
        return render(request, 'account/change.html', {'form': form})



class DownloadLauncherView(View):
    def check(self, request):
        user = request.user    
        if user.role_user.name == 'Developer':
            return True
        
        if user.is_subscribed:
            return True
        
        return False


    def get(self, request):
        if not self.check(request=request):
            return redirect('cabinet')
        else:
            file_path = os.path.join(settings.BASE_DIR, 'YOUR_FILE.txt')    # YOUR_FILE.txt - изменить на будуший лаунчер 
            file_name = 'launcher.txt'                                      # launcher.txt -> phantom.exr 

            if os.path.exists(file_path):
                with open(file_path, 'rb') as fh:
                    response = HttpResponse(fh.read(), content_type="application/vnd.ms-exe")
                    response['Content-Disposition'] = f'inline; filename={file_name}'
                    return response




class Authentication(View):
    def get(self, request):
        user = request.user

        if not user.otp_secret:
            user.otp_secret = pyotp.random_base32()
            user.save()

        opt_url = pyotp.totp.TOTP(user.otp_secret).provisioning_uri(
            name = user.username,
            issuer_name='Phantom'
        )

        qr = qrcode.make(opt_url)
        buffer = io.BytesIO()
        qr.save(buffer, format='PNG')

        buffer.seek(0)
        qr_code = base64.b64encode(buffer.getvalue()).decode('utf-8')

        qr_code_data_url = f'data:image/png;base64,{qr_code}'

        return render(request, '2-fa/auth.html', {
            'qr_code': qr_code_data_url,
            'user': user
        })

    def post(self, request):
        user = request.user
        otp_code = request.POST.get('otp_code')
        
        if not otp_code:
            messages.error(request, 'Пожалуйста, введите код')
            return redirect('authentication')
            
        totp = pyotp.TOTP(user.otp_secret)
        
        if totp.verify(otp_code):
            user.mfa_enabled = True
            user.save()
            messages.success(request, 'Двухфакторная аутентификация успешно настроена!')
            LogsView(user, 'Двухфакторная аутентификация успешно настроена')
            return redirect('cabinet')
        else:
            messages.error(request, 'Неверный код. Пожалуйста, попробуйте снова.')
            return redirect('authentication')
