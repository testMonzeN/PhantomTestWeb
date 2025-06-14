from rest_framework.views import APIView
from rest_framework import serializers, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from cabinet.models import User
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
import json
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'HWID', 'is_subscribed', 'id']


class UserViewSet(viewsets.ModelViewSet):
    '''
    metods:

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
    def list(self, request):
        name = request.data.get('name')
        pas = request.data.get('password')
        if name and pas:
            user = authenticate(username=name, password=pas)
            if user is not None:
                queryset = user
                serializer = UserSerializer(queryset)

                return Response(serializer.data)
        else:
            queryset = User.objects.all()
            serializer = UserSerializer(queryset, many=True)
            return Response(serializer.data)

    def create(self, request):
        name = request.data.get('name')
        pas = request.data.get('password')
        new_hwid = request.data.get('HWID')

        user = authenticate(username=name, password=pas)
        if user is not None:
            if user.is_subscribed:
                if not user.HWID:
                    user.HWID = new_hwid
                    user.save()
                    return Response({'HWID': user.HWID}, status=status.HTTP_200_OK)
            
            return Response({'HWID': user.HWID}, status=status.HTTP_403_FORBIDDEN)
        else:

            return Response({'HWID': None}, status=status.HTTP_404_NOT_FOUND)
            


