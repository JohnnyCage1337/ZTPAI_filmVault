from rest_framework import serializers
from .models import Genre, Movie

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'slug']

class MovieListSerializer(serializers.ModelSerialzer):
    genres = GenreSerializer(many=True, read_only = True)
    year = serializers.ReadOnlyField()

    class Meta:
        model = Movie
        fields = ['id', 'title', 'year', 'poster', 'vote_average', 'vote_count',
                  'popularity', 'status', 'genres']


class MovieDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only = True)
    genres_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Genre.objects.all(), source='genres'
    )
    year = serializers.ReadOnlyField()
    profit = serializers.ReadOnlyField()

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'original_title', 'overview', 'year', 'profit',
            'release_date', 'runtime', 'budget', 'revenue', 'status', 'adult',
            'poster', 'backdrop', 'vote_average', 'vote_count', 'popularity',
            'genres', 'genre_ids', 'created_at', 'updated_at'
        ]

        read_only_fields = ['vote_average', 'vote_count', 'popularity', 'created_at', 'updated_at']



class MovieCreateSerializer(serializers.ModelSerializer):
    """Serializer dla tworzenia filmu"""
    genre_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Genre.objects.all(), source='genres'
    )

    class Meta:
        model = Movie
        fields = [
            'title', 'original_title', 'overview', 'release_date', 'runtime',
            'budget', 'revenue', 'status', 'adult', 'poster', 'backdrop',
            'trailer_url', 'imdb_id', 'genre_ids'
        ]