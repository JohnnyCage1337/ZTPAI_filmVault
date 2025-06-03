from rest_framework import serializers
from titles.models import Film, TVSeries, Season, Episode
from people.serializers import CreditSerializer

class FilmSerializer(serializers.ModelSerializer):
    credits = serializers.SerializerMethodField()
    class Meta:
        model = Film
        fields = ['id', 'title', 'plot', 'year', 'runtime', 'credits']
    def get_credits(self, obj):
        qs = obj.credits.all().order_by('billing_order')
        return CreditSerializer(qs, many=True).data

class TVSeriesSerializer(serializers.ModelSerializer):
    credits = serializers.SerializerMethodField()
    seasons_amount = serializers.ReadOnlyField()
    class Meta:
        model = TVSeries
        fields = ['id', 'title', 'plot', 'year', 'year_last_season', 'runtime', 'seasons_amount', 'credits']
    def get_credits(self, obj):
        qs = obj.credits.all().order_by('billing_order')
        return CreditSerializer(qs, many=True).data

class SeasonSerializer(serializers.ModelSerializer):
    episodes_count = serializers.ReadOnlyField()

    class Meta:
        model = Season
        fields = [
            'id',
            'tv_series',
            'season_number',
            'episodes_count',
            'release_date',
            'description',
            'poster_url',
        ]


class EpisodeSerializer(serializers.ModelSerializer):
    credits = serializers.SerializerMethodField()
    class Meta:
        model = Episode
        fields = ['id', 'season', 'title', 'episode_number', 'runtime', 'release_date', 'credits']
    def get_credits(self, obj):
        qs = obj.credits.all().order_by('billing_order')
        return CreditSerializer(qs, many=True).data
