from django.core.management.base import BaseCommand
from titles.models import Country, Language

class Command(BaseCommand):
    help = "Populates the database with popular countries and languages"

    countries = [
        "United States", "United Kingdom", "France", "Germany", "India",
        "Japan", "Canada", "Italy", "Spain", "South Korea",
        "China", "Australia", "Mexico", "Brazil", "Russia",
        "Sweden", "Denmark", "Netherlands", "Poland", "Turkey"
    ]

    languages = [
        "English", "Spanish", "French", "German", "Hindi",
        "Mandarin", "Japanese", "Korean", "Italian", "Portuguese",
        "Russian", "Turkish", "Polish", "Dutch", "Swedish",
        "Danish", "Arabic", "Bengali", "Thai", "Persian"
    ]

    def handle(self, *args, **kwargs):
        # Dodawanie krajów
        for country_name in self.countries:
            country, created = Country.objects.get_or_create(name=country_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Added country: {country_name}'))

        # Dodawanie języków
        for language_name in self.languages:
            language, created = Language.objects.get_or_create(name=language_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Added language: {language_name}'))

        self.stdout.write(self.style.SUCCESS("Database populated with countries and languages!"))
