from django.contrib import admin
from .models import Film, Language, Country
# Register your models here.


admin.site.register(Film)
admin.site.register(Language)
admin.site.register(Country)