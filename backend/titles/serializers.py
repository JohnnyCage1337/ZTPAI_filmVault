from rest_framework import serializers
from .models import Country, Language, Film, TVSeries, Season, Episode

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name']

class FilmSerializer(serializers.ModelSerializer):
    # Używamy PrimaryKeyRelatedField, aby zwrócić tylko ID krajów i języków
    country = serializers.PrimaryKeyRelatedField(many=True, queryset=Country.objects.all())
    languages = serializers.PrimaryKeyRelatedField(many=True, queryset=Language.objects.all())

    class Meta:
        model = Film
        fields = ['id', 'title', 'title_og', 'plot', 'year', 'runtime', 'poster_url', 'country', 'languages']

class TVSeriesSerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(many=True, queryset=Country.objects.all())
    languages = serializers.PrimaryKeyRelatedField(many=True, queryset=Language.objects.all())

    class Meta:
        model = TVSeries
        fields = ['id', 'title', 'title_og', 'plot', 'year', 'year_last_season', 'runtime',
                  'poster_url', 'country', 'languages', 'seasons_amount']

class SeasonSerializer(serializers.ModelSerializer):
    tv_series = serializers.PrimaryKeyRelatedField(queryset=TVSeries.objects.all())

    class Meta:
        model = Season
        fields = ['id', 'tv_series', 'season_number', 'episodes_count', 'release_date', 'description', 'poster_url']


class EpisodeSerializer(serializers.ModelSerializer):
    season = serializers.PrimaryKeyRelatedField(queryset=Season.objects.all())

    class Meta:
        model = Episode
        fields = ['id', 'season', 'title', 'episode_number', 'runtime', 'description', 'release_date', 'poster_url']