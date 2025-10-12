from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from apps.movies.models import Movie, Person
import requests
import os
from urllib.parse import urlparse

class Command(BaseCommand):
    help = 'Download sample images for movies and people'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=10, help='Number of movies to process')

    def handle(self, *args, **options):
        limit = options['limit']
        self.stdout.write('Downloading sample images...')

        # Sample poster URLs from TMDB (these are real poster URLs)
        sample_posters = [
            'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',  # Oppenheimer
            'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',  # Barbie
            'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',  # Dune 2
            'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',  # The Batman
            'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',  # Everything Everywhere
            'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',  # Top Gun
            'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',  # Avatar 2
            'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',  # Spider-Man
            'https://image.tmdb.org/t/p/w500/6WdKFeK5oqlcc7u8FeqBuaabevM.jpg',  # French Dispatch
            'https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg',  # Knives Out
        ]

        # Sample background URLs
        sample_backgrounds = [
            'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',  # Oppenheimer
            'https://image.tmdb.org/t/p/w1280/nHf61UzkfFno5X1ofIhugCPus2R.jpg',  # Barbie
            'https://image.tmdb.org/t/p/w1280/cszJykWzSIKNVm6c4uUXr3nLfVv.jpg',  # Dune 2
            'https://image.tmdb.org/t/p/w1280/8qppqwRa5n7a6FMqvCCKWIH3PVH.jpg',  # The Batman
            'https://image.tmdb.org/t/p/w1280/l9rkTHrE9t2lJB59PmuCG1HMvjQ.jpg',  # Everything Everywhere
            'https://image.tmdb.org/t/p/w1280/x9zWWGmm67F2TgWTFpFJ5v6W5HW.jpg',  # Top Gun
            'https://image.tmdb.org/t/p/w1280/cOJ3VkxSAY2LK4rSnokL0UBggZC.jpg',  # Avatar 2
            'https://image.tmdb.org/t/p/w1280/cnqwv5Uz3UW5f086IWbQKr3ksJr.jpg',  # Spider-Man
            'https://image.tmdb.org/t/p/w1280/bYqGUXA5NRX6k7F6nGp5FKrjz4W.jpg',  # French Dispatch
            'https://image.tmdb.org/t/p/w1280/yCE4kUZaIvhFvRPqrDWFQJ89fG3.jpg',  # Knives Out
        ]

        movies = Movie.objects.all()[:limit]

        for i, movie in enumerate(movies):
            if i < len(sample_posters):
                # Download poster
                try:
                    poster_response = requests.get(sample_posters[i], timeout=10)
                    if poster_response.status_code == 200:
                        filename = f"{movie.slug}_poster.jpg"
                        movie.poster.save(
                            filename,
                            ContentFile(poster_response.content),
                            save=False
                        )
                        self.stdout.write(f'Downloaded poster for {movie.title}')
                except Exception as e:
                    self.stdout.write(f'Failed to download poster for {movie.title}: {e}')

                # Download background
                try:
                    if i < len(sample_backgrounds):
                        bg_response = requests.get(sample_backgrounds[i], timeout=10)
                        if bg_response.status_code == 200:
                            filename = f"{movie.slug}_background.jpg"
                            movie.background.save(
                                filename,
                                ContentFile(bg_response.content),
                                save=False
                            )
                            self.stdout.write(f'Downloaded background for {movie.title}')
                except Exception as e:
                    self.stdout.write(f'Failed to download background for {movie.title}: {e}')

                movie.save()

        self.stdout.write(self.style.SUCCESS(f'Successfully processed {len(movies)} movies'))