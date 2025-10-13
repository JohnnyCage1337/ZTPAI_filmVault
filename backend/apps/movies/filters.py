import django_filters
from django_filters import rest_framework as filters
from .models import Movie, Genre


class MovieFilter(filters.FilterSet):
    # Text filters
    title = filters.CharFilter(lookup_expr='icontains')
    year = filters.NumberFilter(field_name='release_date__year')

    # Range filters
    vote_average_min = filters.NumberFilter(field_name='vote_average', lookup_expr='gte')
    vote_average_max = filters.NumberFilter(field_name='vote_average', lookup_expr='lte')
    runtime_min = filters.NumberFilter(field_name='runtime', lookup_expr='gte')
    runtime_max = filters.NumberFilter(field_name='runtime', lookup_expr='lte')
    release_date_from = filters.DateFilter(field_name='release_date', lookup_expr='gte')
    release_date_to = filters.DateFilter(field_name='release_date', lookup_expr='lte')

    # Choice filters
    status = filters.ChoiceFilter(choices=Movie.STATUS_CHOICES)

    # Multiple choice filters
    genres = filters.ModelMultipleChoiceFilter(
        field_name='genres__slug',
        to_field_name='slug',
        queryset=Genre.objects.all()
    )

    # Boolean filters
    has_poster = filters.BooleanFilter(method='filter_has_poster')
    has_backdrop = filters.BooleanFilter(method='filter_has_backdrop')

    class Meta:
        model = Movie
        fields = {
            'popularity': ['exact', 'gte', 'lte'],
            'vote_count': ['exact', 'gte', 'lte'],
        }

    def filter_has_poster(self, queryset, name, value):
        if value:
            return queryset.exclude(poster_path__isnull=True).exclude(poster_path='')
        return queryset.filter(poster_path__isnull=True) | queryset.filter(poster_path='')

    def filter_has_backdrop(self, queryset, name, value):
        if value:
            return queryset.exclude(backdrop_path__isnull=True).exclude(backdrop_path='')
        return queryset.filter(backdrop_path__isnull=True) | queryset.filter(backdrop_path='')