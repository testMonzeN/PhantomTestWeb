from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, PasswordChangeForm
from .models import User
from django.contrib.auth import authenticate


# Регистрация пользователя
class CustomUserRegisterForm(UserCreationForm):
    username = forms.CharField(max_length=255)
    email = forms.EmailField(max_length=255)
    password1 = forms.CharField(max_length=255)
    password2 = forms.CharField(max_length=255)
    
    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Пароли не совпадают")
        
        return cleaned_data
        
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')


# Вход в аккаунт
class CustomLoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput)

    
    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')
               
        return cleaned_data


# Форма смены пароля зарегестрированного пользователя
class CustomUserChangeForm(PasswordChangeForm):
    old_password = forms.CharField(
        label="Текущий пароль",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )
    new_password1 = forms.CharField(
        label="Новый пароль",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )
    new_password2 = forms.CharField(
        label="Подтверждение нового пароля",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )

class OtpCodeUserChangeForm(forms.Form):
    code = forms.CharField(
        max_length=255, 
        label='2FA код подтверждения'
    )

    def clean(self):
        cleaned_data = super().clean()
        code = cleaned_data.get('code')

       
        return cleaned_data

    
    
    