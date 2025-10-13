from django.contrib import admin
from .models import Genre, Movie, Person, MovieCast, MovieRating, Watchlist

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug' : ('name',)}
    search_fields = ['name']


class MovieCastInline(admin.TabularInline):
    model = MovieCast
    extra = 0
    fields = ['person', 'character_name', 'order']


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'year', 'status', 'vote_average', 'vote_count', 'popularity']
    list_filter = ['status', 'adult', 'release_date', 'genres']
    search_fields = ['title', 'og_title']
    filter_horizontal = ['genres', 'writers']
    readonly_fields = ['slug', 'created_at', 'updated_at']
    inlines = [MovieCastInline]

    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'og_title', 'slug', 'overview', 'genres', 'director')
        }),
        ('Release Info', {
            'fields': ('release_date', 'status', 'adult', 'runtime', 'language', 'country')
        }),
        ('Media', {
            'fields': ('poster', 'background', 'trailer_url'),
            'classes': ('collapse',)
        }),
        ('Financial', {
            'fields': ('budget', 'revenue'),
            'classes': ('collapse',)
        }),
        ('External IDs', {
            'fields': ('imdb_id',),
            'classes': ('collapse',)
        }),
        ('Stats', {
            'fields': ('vote_average', 'vote_count', 'popularity'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    def year(self, obj):
        return obj.year

    year.short_description = 'Year'
    year.admin_order_field = 'release_date'


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ['name', 'birth_date']
    search_fields = ['name']
    list_filter = ['birth_date']


@admin.register(MovieRating)
class MovieRatingAdmin(admin.ModelAdmin):
    list_display = ['movie', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['movie__title', 'user__username']
    readonly_fields = ['created_at']


@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'movie', 'added_at']
    list_filter = ['added_at']
    search_fields = ['user__username', 'movie__title']
    readonly_fields = ['added_at']

