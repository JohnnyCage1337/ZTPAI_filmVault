from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_lenght=100)
    email = models.EmailField()
    avatar_url = models.URLField(blank=True)

    def __str__(self):
        return self.username