from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    avatar_url = models.URLField(blank=True)