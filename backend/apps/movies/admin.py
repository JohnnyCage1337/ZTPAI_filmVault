from django.contrib import admin
from .models import Genre, Movie

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug' : ('name',)}
    search_fields = ['name']

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'year', 'status', 'vote_average', 'vote_count', 'popularity']
    list_filter = ['status', 'adult', 'release_date', 'genres']
    search_fields = ['title', 'og_title']
    filter_horizontal = ['genres']
    readonly_fields = ['created_at', 'updated_at', 'vote_average', 'vote_count']

    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'og_title', 'overview', 'genres')
        }),
        ('Release Info', {
            'fields': ('release_date', 'status', 'adult', 'runtime')
        }),
        ('Media', {
            'fields': ('poster', 'backdrop'),
            'classes': ('collapse',)
        }),
        ('Financial', {
            'fields': ('budget', 'revenue'),
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

