from django.db import models

# Create your models here.


class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
    


class Language(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class TitleBase(models.Model):
    title = models.CharField(max_length=256, help_text="title in English")
    title_og = models.CharField(max_length=256, help_text="original title", blank=True)
    plot = models.TextField(blank=True)
    year = models.IntegerField()
    runtime = models.SmallIntegerField(null=True, help_text="minutes")
    poster_url = models.URLField(blank=True)
    country = models.ManyToManyField("Country", help_text="country production")
    languages = models.ManyToManyField("Language", help_text="languages used in film")


# dodatkowe informacje o modelu w DJANGO
    class Meta:
        abstract = True
        # ordering = ["title"] domyslna kolejnosc wynikow
        # verbose_name = "Film" przyjazna nazwa modelu
        unique_together = ("title", "year") #wymuszenie unikalnosci


class Film(TitleBase):
    def __str__(self):
        return self.title


class TVSeries(TitleBase):
    seasons_amount = models.PositiveSmallIntegerField(default=0)
    year_last_season = models.PositiveSmallIntegerField(null = True, blank = True, default=None)

    def __str__(self):
        return self.title
    
class Season(models.Model):
    tv_series = models.ForeignKey(TVSeries, on_delete=models.CASCADE)
    season_number = models.PositiveSmallIntegerField(help_text="Season number")
    episodes_count = models.PositiveSmallIntegerField(default=0, help_text="Number of episodes in this season")
    release_date = models.DateField(null=True, blank=True, help_text="Release date of this season.")
    description = models.TextField(blank=True)
    poster_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.tv_series.title} - Season {self.season_number}"
    
    class Meta:
        unique_together = ("tv_series", "season_number")
        ordering = ["season_number"]


class Episode(models.Model):
    season = models.ForeignKey(Season, on_delete=models.CASCADE)
    title = models.CharField(max_length=256)
    episode_number = models.PositiveSmallIntegerField(help_text="Duration in minutes")
    runtime = models.SmallIntegerField(default = 0)
    description = models.TextField(blank=True)
    release_date = models.DateField(null=True, blank=True, help_text="Air date of episode")
    poster_url = models.URLField(blank=True)

    class Meta:
        unique_together = ("season", "episode_number")

    def __str__(self):
        return f"S{self.season.season_number}.E{self.episode_number}:{self.title}"

