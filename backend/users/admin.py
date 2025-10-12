from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

# Możemy rozszerzyć UserAdmin jeśli będziemy chcieli dodać dodatkowe pola
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
