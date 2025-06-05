from rest_framework.views import APIView
from rest_framework import serializers, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from cabinet.models import User
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'HWID', 'is_subscribed']


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        # GET-запрос (получение данных)
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        self.queryset = User.objects.filter(username=user.username)
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        # POST-запрос (обновление HWID)
        current_user = request.data.get('username')
        current_password = request.data.get('password')
        new_hwid = request.data.get('HWID')

        user = authenticate(username=current_user, password=current_password)
        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        current_hwid = user.HWID
        if current_hwid is None:
            user.HWID = new_hwid
            user.save()
            return Response({'message': 'HWID updated successfully'}, status=status.HTTP_200_OK)
        elif current_hwid != new_hwid:
            return Response({"error": "This username has a different HWID"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"message": "HWID is already set"}, status=status.HTTP_200_OK)
