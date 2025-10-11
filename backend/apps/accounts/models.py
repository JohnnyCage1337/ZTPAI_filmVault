from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('moderator', 'Moderator'),
        ('admin', 'Admin'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username

    @property
    def is_moderator(self):
        return self.role in ['moderator', 'admin']

    @property
    def is_admin(self):
        return self.role == 'admin'