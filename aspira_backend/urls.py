"""
URL configuration for aspira_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include # Import include for app URLs

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')), # Include URLs from our users app
    # You will add other API paths here as you build more features, e.g.:
    # path('api/dashboard/', include('dashboard.urls')),
    # path('api/content/', include('content.urls')),
]
