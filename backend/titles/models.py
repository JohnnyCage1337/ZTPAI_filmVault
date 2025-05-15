from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from people.models import Person
from people.models import Credit


class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Language(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class TitleBase(models.Model):
    title = models.CharField(max_length=256, help_text="Title in English")
    title_og = models.CharField(max_length=256, help_text="Original title", blank=True)
    plot = models.TextField(blank=True)
    year = models.IntegerField()
    runtime = models.SmallIntegerField(null=True, help_text="Minutes")
    poster_url = models.URLField(blank=True)
    country = models.ManyToManyField(Country, help_text="Country of production")
    languages = models.ManyToManyField(Language, help_text="Languages used")

    class Meta:
        abstract = True
        unique_together = ("title", "year")
        ordering = ["title"]


class Film(TitleBase):
    credits = GenericRelation(Credit,
                              content_type_field='content_type',
                              object_id_field='object_id',
                              related_query_name='films')

    def __str__(self):
        return self.title


class TVSeries(TitleBase):
    year_last_season = models.PositiveSmallIntegerField(null=True, blank=True)
    credits = GenericRelation(Credit,
                              content_type_field='content_type',
                              object_id_field='object_id',
                              related_query_name='tvseries')

    @property
    def seasons_amount(self):
        return self.seasons.count()

    def __str__(self):
        return self.title


class Season(models.Model):
    tv_series = models.ForeignKey(TVSeries, on_delete=models.CASCADE, related_name='seasons')
    season_number = models.PositiveSmallIntegerField(help_text="Season number")
    release_date = models.DateField(null=True, blank=True, help_text="Air date of season")
    description = models.TextField(blank=True)
    poster_url = models.URLField(blank=True)
    credits = GenericRelation(Credit,
                              content_type_field='content_type',
                              object_id_field='object_id',
                              related_query_name='seasons')

    class Meta:
        unique_together = ("tv_series", "season_number")
        ordering = ["season_number"]

    def __str__(self):
        return f"{self.tv_series.title} - Season {self.season_number}"

    @property
    def episodes_count(self):
        return self.episode_set.count()


class Episode(models.Model):
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='episodes')
    title = models.CharField(max_length=256)
    episode_number = models.PositiveSmallIntegerField(help_text="Episode number")
    runtime = models.SmallIntegerField(default=0)
    description = models.TextField(blank=True)
    release_date = models.DateField(null=True, blank=True, help_text="Air date of episode")
    poster_url = models.URLField(blank=True)
    credits = GenericRelation(Credit,
                              content_type_field='content_type',
                              object_id_field='object_id',
                              related_query_name='episodes')

    class Meta:
        unique_together = ("season", "episode_number")
        ordering = ["episode_number"]

    def __str__(self):
        return f"S{self.season.season_number}.E{self.episode_number}: {self.title}"
