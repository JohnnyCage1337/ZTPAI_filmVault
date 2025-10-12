from rest_framework import serializers
from .models import Genre, Movie, Person, MovieCast, MovieRating, Watchlist

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'slug']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'name', 'biography', 'birth_date', 'avatar']

class MovieCastSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only=True)

    class Meta:
        model = MovieCast
        fields = ['person', 'character_name', 'order']

class MovieListSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    year = serializers.ReadOnlyField()
    average_rating = serializers.ReadOnlyField()
    rating_count = serializers.ReadOnlyField()
    poster = serializers.SerializerMethodField()

    def get_poster(self, obj):
        if obj.poster:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.poster.url)
            return f"/media/{obj.poster}"
        return None

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'slug', 'overview', 'year', 'poster',
            'vote_average', 'vote_count', 'popularity', 'status',
            'genres', 'average_rating', 'rating_count', 'release_date', 'runtime'
        ]

class MovieDetailSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    director = PersonSerializer(read_only=True)
    writers = PersonSerializer(many=True, read_only=True)
    cast = MovieCastSerializer(many=True, read_only=True)
    year = serializers.ReadOnlyField()
    profit = serializers.ReadOnlyField()
    average_rating = serializers.ReadOnlyField()
    rating_count = serializers.ReadOnlyField()
    poster = serializers.SerializerMethodField()
    background = serializers.SerializerMethodField()

    def get_poster(self, obj):
        if obj.poster:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.poster.url)
            return f"/media/{obj.poster}"
        return None

    def get_background(self, obj):
        if obj.background:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.background.url)
            return f"/media/{obj.background}"
        return None

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'slug', 'og_title', 'overview', 'year', 'profit',
            'release_date', 'runtime', 'budget', 'revenue', 'status', 'adult',
            'poster', 'background', 'trailer_url', 'language', 'country',
            'vote_average', 'vote_count', 'popularity', 'imdb_id',
            'genres', 'director', 'writers', 'cast',
            'average_rating', 'rating_count', 'created_at', 'updated_at'
        ]

class MovieCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating movies"""
    genre_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Genre.objects.all(), source='genres'
    )

    class Meta:
        model = Movie
        fields = [
            'title', 'og_title', 'overview', 'release_date', 'runtime',
            'budget', 'revenue', 'status', 'adult', 'poster', 'background',
            'trailer_url', 'imdb_id', 'language', 'country', 'genre_ids'
        ]

class MovieRatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = MovieRating
        fields = ['id', 'user', 'rating', 'review', 'created_at']
        read_only_fields = ['user', 'created_at']

class WatchlistSerializer(serializers.ModelSerializer):
    movie = MovieListSerializer(read_only=True)

    class Meta:
        model = Watchlist
        fields = ['id', 'movie', 'added_at']
        read_only_fields = ['added_at']