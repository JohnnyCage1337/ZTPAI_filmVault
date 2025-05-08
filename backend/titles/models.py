from django.db import models

# Create your models here.


class Country(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Language(models.Model):
    name = models.CharField(max_length=100)

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

    def __str__(self):
        return self.title
    
class Season()
