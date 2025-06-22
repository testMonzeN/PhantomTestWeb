from rest_framework.views import APIView
from rest_framework import serializers, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from cabinet.models import User
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
import json
from django.contrib.auth import authenticate
from cabinet.forms import CustomUserRegisterForm, CustomUserChangeForm


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'HWID', 'is_subscribed', 'id']


class UserViewSet(viewsets.ModelViewSet):
    '''
    metods API django rest framework:

    def list(self, request):
        pass

    def create(self, request):
        pass

    def retrieve(self, request, pk=None):
        pass

    def update(self, request, pk=None):
        pass

    def partial_update(self, request, pk=None):
        pass

    def destroy(self, request, pk=None):
        pass
    '''
    # get
    def list(self, request):
        metod = request.data.get('metod')
        if metod:        
            if metod == 'get_into':
                name = request.data.get('name')
                pas = request.data.get('password')
                user = authenticate(username=name, password=pas)
                if user is not None:
                    queryset = user
                    serializer = UserSerializer(queryset)

                    return Response(serializer.data)

            if metod == 'get_hwid':
                name = request.data.get('name')
                user = User.objects.get(username=name).only('HWID')

                if user is not None:
                    queryset = user
                    serializer = UserSerializer(queryset)
                    return Response(serializer.data)
            
            if metod == 'get_field_user':
                name = request.data.get('name')
                field = request.data.get('field')

                field_list = ['role_user', 'HWID', 'is_subscribed', 'subscription_end_date', 'subscription_type', 'id', 'username']
                if field not in field_list:
                    return Response({'message': 'Field is not allowed to be retrieved'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    user = User.objects.get(username=name).only(field)
                    if user is not None:
                        queryset = user
                        serializer = UserSerializer(queryset)
                        return Response(serializer.data)
                    else:
                        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
                
        else:
            queryset = User.objects.all()
            serializer = UserSerializer(queryset, many=True)
            return Response(serializer.data)

    # post
    def create(self, request):
        metod = request.data.get('metod')

        if metod:
            if metod == 'HWID':
                name = request.data.get('name')
                pas = request.data.get('password')
                new_hwid = request.data.get('HWID')

                user = authenticate(username=name, password=pas)
                if user is not None:
                    if user.is_subscribed:
                        if not user.HWID:
                            user.HWID = new_hwid
                            user.save()
                            return Response({'HWID': user.HWID,}, status=status.HTTP_200_OK)
                    
                    return Response({'HWID': user.HWID,}, status=status.HTTP_403_FORBIDDEN)
                else:

                    return Response({'HWID': None}, status=status.HTTP_404_NOT_FOUND)
            
            if metod == 'new_user':
                form = CustomUserRegisterForm(request.data)
                if form.is_valid():
                    form.save()
                    return Response({'message': 'User created successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'User creation failed'}, status=status.HTTP_400_BAD_REQUEST)
            
            if metod == 'change_password':
                form = CustomUserChangeForm(request.data)
                if form.is_valid():
                    form.save()
                    return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Password change failed'}, status=status.HTTP_400_BAD_REQUEST)

            
        else:
            return Response({'message': 'Invalid method'}, status=status.HTTP_400_BAD_REQUEST)



