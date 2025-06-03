from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Person(models.Model):
    SEX_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]

    first_name = models.CharField(max_length=256)
    middle_name = models.CharField(max_length=256, blank=True)
    last_name = models.CharField(max_length=256)
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    birth_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    image = models.URLField(blank=True)

    class Meta:
        unique_together = ("first_name", "middle_name", "last_name", "birth_date")
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Credit(models.Model):
    ROLE_CHOICES = [
        ('ACTOR', 'Actor'),
        ('DIRECTOR', 'Director'),
        ('WRITER', 'Writer'),
        ('PRODUCER', 'Producer'),
    ]

    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='credits')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    character_name = models.CharField(max_length=256, blank=True)
    billing_order = models.PositiveSmallIntegerField(null=True, blank=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    production_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        indexes = [models.Index(fields=['content_type', 'object_id'])]
        ordering = ['content_type', 'object_id', 'billing_order']

    def __str__(self):
        return f"{self.person} as {self.role}"
