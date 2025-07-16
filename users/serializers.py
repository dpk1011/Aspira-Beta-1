# aspira-project/users/serializers.py

from rest_framework import serializers
from .models import AspiraUser # Import our custom user model

# Serializer for creating/retrieving AspiraUser data
class AspiraUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AspiraUser
        fields = ['unique_id', 'date_of_birth', 'is_active', 'date_joined']
        read_only_fields = ['is_active', 'date_joined'] # These fields are not set by user directly

# Serializer for the login request (only unique_id and date_of_birth)
class LoginSerializer(serializers.Serializer):
    unique_id = serializers.CharField(max_length=7)
    date_of_birth = serializers.DateField()

