# aspira-project/users/models.py

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

# Custom User Manager for AspiraUser
class AspiraUserManager(BaseUserManager):
    def create_user(self, unique_id, date_of_birth, **extra_fields):
        """
        Creates and saves a regular user with the given unique ID and date of birth.
        """
        if not unique_id:
            raise ValueError('The Unique ID must be set')
        if not date_of_birth:
            raise ValueError('The Date of Birth must be set')

        user = self.model(
            unique_id=unique_id,
            date_of_birth=date_of_birth,
            **extra_fields
        )
        # We don't set a password directly here, as DOB is the validator.
        # However, Django's auth system expects a password hash, so we'll set a dummy one
        # or handle it in a custom authentication backend (more advanced).
        # For simplicity in MVP, we'll just store DOB as plain text for now for validation,
        # but in production, this would require hashing or a custom auth backend.
        user.set_unusable_password() # Marks password as unusable, as DOB is the validator
        user.save(using=self._db)
        return user

    def create_superuser(self, unique_id, date_of_birth, **extra_fields):
        """
        Creates and saves a superuser with the given unique ID and date of birth.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(unique_id, date_of_birth, **extra_fields)

# Custom User Model for Aspira Project
class AspiraUser(AbstractBaseUser, PermissionsMixin):
    unique_id = models.CharField(max_length=7, unique=True, help_text="7-digit alphanumeric ID: AAAA-000")
    date_of_birth = models.DateField(help_text="User's date of birth (YYYY-MM-DD)")

    # Standard Django user fields
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = AspiraUserManager()

    USERNAME_FIELD = 'unique_id' # This tells Django to use unique_id as the username
    REQUIRED_FIELDS = ['date_of_birth'] # These fields are required when creating a user

    def __str__(self):
        return self.unique_id

    class Meta:
        verbose_name = 'Aspira User'
        verbose_name_plural = 'Aspira Users'

