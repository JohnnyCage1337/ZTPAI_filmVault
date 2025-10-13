from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.contrib.auth.models import User
from django.utils.text import slugify

class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        ordering = ['name']
        db_table = 'genres'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Person(models.Model):
    ROLE_CHOICES = [
        ('director', 'Director'),
        ('actor', 'Actor'),
        ('writer', 'Writer'),
        ('producer', 'Producer'),
    ]

    name = models.CharField(max_length=100)
    biography = models.TextField(blank=True)
    birth_date = models.DateField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, help_text="Actor/Director photo")

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Movie(models.Model):
    STATUS_CHOICES = [
        ('released', 'Released'),
        ('ongoing', 'Ongoing'),
        ('upcoming', 'Upcoming'),
    ]

    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    og_title = models.CharField(max_length=255, blank=True, help_text="Original title")
    overview = models.TextField(blank=True)

    release_date = models.DateField(null=True, blank=True)
    runtime = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1)],
                                  help_text='Runtime in minutes')

    budget = models.BigIntegerField(null=True, blank=True)
    revenue = models.BigIntegerField(null=True, blank=True)

    poster = models.ImageField(upload_to='posters/', null=True, blank=True, help_text="Poster image (smaller)")
    background = models.ImageField(upload_to='backgrounds/', null=True, blank=True, help_text="Background image (larger)")
    trailer_url = models.URLField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='released')
    adult = models.BooleanField(default=False)
    imdb_id = models.CharField(max_length=20, blank=True)
    language = models.CharField(max_length=10, default='en')
    country = models.CharField(max_length=100, default='USA')

    vote_average = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    vote_count = models.IntegerField(default=0)
    popularity = models.IntegerField(default=0)

    genres = models.ManyToManyField(Genre, blank=True, related_name='movies')
    director = models.ForeignKey(Person, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='directed_movies')
    writers = models.ManyToManyField(Person, blank=True, related_name='written_movies')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'movies'
        ordering = ['-release_date', '-popularity']
        indexes = [
            models.Index(fields=['-release_date', '-popularity']),
            models.Index(fields=['title']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

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

    @property
    def average_rating(self):
        ratings = self.ratings.all()
        if ratings:
            return round(sum(r.rating for r in ratings) / len(ratings), 1)
        return self.vote_average or 0

    @property
    def rating_count(self):
        return self.ratings.count() or self.vote_count

class MovieCast(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='cast')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='filmography')
    character_name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)  
    def __str__(self):
        return f"{self.person.name} as {self.character_name} in {self.movie.title}"

    class Meta:
        ordering = ['order']
        unique_together = ['movie', 'person', 'character_name']

class MovieRating(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movie_ratings')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} rated {self.movie.title}: {self.rating}/10"

    class Meta:
        unique_together = ['movie', 'user']
        ordering = ['-created_at']

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='watchlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"

    class Meta:
        unique_together = ['user', 'movie']
        ordering = ['-added_at']