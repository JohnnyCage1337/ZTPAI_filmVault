from django.db import models

class PeopleBasic(models.Model):
    SEX_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]

    name = models.CharField(max_length=256)
    second_name = models.CharField(max_length=256, blank=True)
    surname = models.CharField(max_length=256)
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)  # Poprawka
    birth_date = models.DateField(null=True)
    description = models.TextField(blank=True)
    image = models.URLField(blank=True, help_text="Picture of person")

    def __str__(self):
        return f"{self.name} {self.surname} ({self.get_sex_display()})"
