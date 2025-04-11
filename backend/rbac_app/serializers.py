from rest_framework import serializers
from .models import File, User

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'uploaded_by', 'allowed_roles']

    def validate_allowed_roles(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("allowed_roles must be a list.")
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']