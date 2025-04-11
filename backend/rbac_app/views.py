import json
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import File
from .serializers import FileSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from .serializers import UserSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['role'] = user.role

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def file_list(request):
    files = File.objects.all()
    serializer = FileSerializer(files, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_access(request, file_id):
    try:
        file = File.objects.get(id=file_id)
    except File.DoesNotExist:
        return Response({'error': 'File not found'}, status=404)
    
    if request.user.role in file.allowed_roles:
        return Response({'message': 'Access granted'})
    return Response({'error': 'Access denied'}, status=403)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    if request.user.role != 'admin':
        return Response({'error': 'Only admins can upload'}, status=403)
    
    # Ensure allowed_roles is a list
    allowed_roles = request.data.get('allowed_roles', [])
    if isinstance(allowed_roles, str):
        try:
            allowed_roles = json.loads(allowed_roles)
        except json.JSONDecodeError:
            allowed_roles = []

    serializer = FileSerializer(data={
        'name': request.data.get('name'),
        'allowed_roles': allowed_roles,
    })
    if serializer.is_valid():
        serializer.save(uploaded_by=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)