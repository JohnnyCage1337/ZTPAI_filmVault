from django.db import models
from django.core.validators import MinValueValidator, MaxLengthValidator
from django.utils import timezone

class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        ordering = ['name']
        db_table = 'genres'

    def __str__(self):
        return self.name

class BaseContent(models.Model):
    """Abstract class for Movie and Series"""
    STATUS_CHOICES =[
        ('released', 'Released'),
        ('ongoing', 'Ongoing'),
        ('upcoming', 'Upcoming'),
    ]

    title = models.CharField(max_length=255, db_index=True)
    og_title = models.CharField(max_length=255, blank=True)
    overview = models.TextField(blank=True)
    poster = models.ImageField(upload_to='posters/', null=True, blank=True)
    backdrop = models.ImageField(upload_to='backdrops/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='released')
    adult = models.BooleanField(default=False)
    genres = models.ManyToManyField(Genre, blank=True, related_name='%(class)s_set')

    vote_average = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    vote_count = models.IntegerField(default=0)
    popularity = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        abstract = True

class Movie(BaseContent):
    release_date = models.DateField(null=True, blank=True)
    runtime = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1)],
                                  help_text='Runtime in minutes')
    budget = models.BigIntegerField(null=True, blank=True)
    revenue = models.BigIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'movies'
        ordering = ['release_date', ['-popularity']]
        indexes = [
            models.Index(fields=['-release_date', '-popularity']),
            models.Index(fields=['title']),
        ]

    def __str__(self):
        year = self.release_date.year if self.release_date else "TBA"
        return f"{self.title} ({year})"

    @property
    def year(self):
        return self.release_date.year if self.release_date else None

    @property
    def profit(self):
        if self.budget and self.revenue:
            return self.revenue - self.budget
        return None