# aspira-project/users/urls.py

from django.urls import path
from .views import LoginView # Import our LoginView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
]
