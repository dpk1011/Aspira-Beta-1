# aspira-project/users/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import AspiraUser
from rest_framework.authtoken.models import Token # Import Token model
from django.contrib.auth import authenticate # Django's built-in authenticate function
from .serializers import LoginSerializer # Import our LoginSerializer

# API View for User Login
class LoginView(APIView):
    permission_classes = [] # Allow unauthenticated access to this view

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            unique_id = serializer.validated_data['unique_id']
            date_of_birth = serializer.validated_data['date_of_birth']

            # Authenticate the user using Django's authenticate function
            # Note: Django's default authenticate requires a password.
            # Since our password is DOB, we need a custom authentication backend
            # or a simplified approach for MVP.
            # For MVP, let's manually check unique_id and DOB.
            # In a real production system, you MUST use a custom authentication backend
            # that hashes DOB or uses a more secure method.
            try:
                user = AspiraUser.objects.get(unique_id=unique_id)
                # Basic DOB check for MVP. Replace with secure authentication.
                if str(user.date_of_birth) == str(date_of_birth): # Compare as strings for simplicity
                    # If authentication is successful, get or create a token
                    token, created = Token.objects.get_or_create(user=user)
                    return Response({'token': token.key, 'message': 'Login successful'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            except AspiraUser.DoesNotExist:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

