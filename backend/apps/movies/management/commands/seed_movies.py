from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.movies.models import Movie, Genre, Person, MovieCast
from datetime import date
import random

class Command(BaseCommand):
    help = 'Seed the database with 50 movies'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database with movies...')

        # Create genres
        genres_data = [
            'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
            'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
            'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
        ]

        genres = {}
        for genre_name in genres_data:
            genre, created = Genre.objects.get_or_create(name=genre_name)
            genres[genre_name] = genre
            if created:
                self.stdout.write(f'Created genre: {genre_name}')

        # Create directors and actors
        directors_data = [
            'Christopher Nolan', 'Martin Scorsese', 'Steven Spielberg', 'Quentin Tarantino',
            'Denis Villeneuve', 'Greta Gerwig', 'Jordan Peele', 'Rian Johnson',
            'Edgar Wright', 'Wes Anderson', 'David Fincher', 'Coen Brothers',
            'Guillermo del Toro', 'Alfonso Cuarón', 'Ridley Scott', 'James Cameron'
        ]

        actors_data = [
            'Leonardo DiCaprio', 'Margot Robbie', 'Ryan Gosling', 'Emma Stone',
            'Christian Bale', 'Scarlett Johansson', 'Robert Downey Jr.', 'Tom Hardy',
            'Amy Adams', 'Oscar Isaac', 'Saoirse Ronan', 'Timothée Chalamet',
            'Zendaya', 'Michael Cera', 'Tilda Swinton', 'Ralph Fiennes',
            'Frances McDormand', 'Daniel Kaluuya', 'Lupita Nyong\'o', 'Adam Driver'
        ]

        directors = {}
        actors = {}

        for director_name in directors_data:
            director, created = Person.objects.get_or_create(name=director_name)
            directors[director_name] = director
            if created:
                self.stdout.write(f'Created director: {director_name}')

        for actor_name in actors_data:
            actor, created = Person.objects.get_or_create(name=actor_name)
            actors[actor_name] = actor
            if created:
                self.stdout.write(f'Created actor: {actor_name}')

        # Movies data
        movies_data = [
            {
                'title': 'Oppenheimer',
                'overview': 'The story of J. Robert Oppenheimer and the development of the atomic bomb.',
                'release_date': date(2023, 7, 21),
                'runtime': 180,
                'vote_average': 8.3,
                'vote_count': 5234,
                'popularity': 98,
                'director': 'Christopher Nolan',
                'genres': ['Drama', 'History'],
                'cast': ['Christian Bale', 'Robert Downey Jr.', 'Emily Blunt']
            },
            {
                'title': 'Barbie',
                'overview': 'Barbie lives in Barbieland where everything is perfect - until she starts having thoughts of death.',
                'release_date': date(2023, 7, 21),
                'runtime': 114,
                'vote_average': 7.2,
                'vote_count': 8976,
                'popularity': 95,
                'director': 'Greta Gerwig',
                'genres': ['Comedy', 'Adventure', 'Fantasy'],
                'cast': ['Margot Robbie', 'Ryan Gosling', 'America Ferrera']
            },
            {
                'title': 'Dune: Part Two',
                'overview': 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.',
                'release_date': date(2024, 3, 1),
                'runtime': 166,
                'vote_average': 8.5,
                'vote_count': 4521,
                'popularity': 92,
                'director': 'Denis Villeneuve',
                'genres': ['Science Fiction', 'Adventure', 'Drama'],
                'cast': ['Timothée Chalamet', 'Zendaya', 'Oscar Isaac']
            },
            {
                'title': 'The Batman',
                'overview': 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.',
                'release_date': date(2022, 3, 4),
                'runtime': 176,
                'vote_average': 7.8,
                'vote_count': 7234,
                'popularity': 89,
                'director': 'Matt Reeves',
                'genres': ['Action', 'Crime', 'Drama'],
                'cast': ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano']
            },
            {
                'title': 'Everything Everywhere All at Once',
                'overview': 'An aging Chinese immigrant is swept up in an insane adventure in which she alone can save the world.',
                'release_date': date(2022, 3, 25),
                'runtime': 139,
                'vote_average': 7.8,
                'vote_count': 5678,
                'popularity': 87,
                'director': 'Daniels',
                'genres': ['Science Fiction', 'Comedy', 'Action'],
                'cast': ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan']
            },
            {
                'title': 'Top Gun: Maverick',
                'overview': 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.',
                'release_date': date(2022, 5, 27),
                'runtime': 130,
                'vote_average': 8.2,
                'vote_count': 6789,
                'popularity': 85,
                'director': 'Joseph Kosinski',
                'genres': ['Action', 'Drama'],
                'cast': ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly']
            },
            {
                'title': 'Avatar: The Way of Water',
                'overview': 'Jake Sully lives with his newfound family formed on the planet of Pandora.',
                'release_date': date(2022, 12, 16),
                'runtime': 192,
                'vote_average': 7.6,
                'vote_count': 8901,
                'popularity': 83,
                'director': 'James Cameron',
                'genres': ['Science Fiction', 'Adventure', 'Action'],
                'cast': ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver']
            },
            {
                'title': 'Spider-Man: No Way Home',
                'overview': 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help.',
                'release_date': date(2021, 12, 17),
                'runtime': 148,
                'vote_average': 8.1,
                'vote_count': 12345,
                'popularity': 81,
                'director': 'Jon Watts',
                'genres': ['Action', 'Adventure', 'Science Fiction'],
                'cast': ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch']
            },
            {
                'title': 'The French Dispatch',
                'overview': 'A love letter to journalists set in an outpost of an American newspaper in a fictional 20th-century French city.',
                'release_date': date(2021, 10, 22),
                'runtime': 107,
                'vote_average': 7.1,
                'vote_count': 3456,
                'popularity': 79,
                'director': 'Wes Anderson',
                'genres': ['Comedy', 'Drama'],
                'cast': ['Benicio del Toro', 'Adrien Brody', 'Tilda Swinton']
            },
            {
                'title': 'Knives Out',
                'overview': 'A detective investigates the death of a patriarch of an eccentric, combative family.',
                'release_date': date(2019, 11, 27),
                'runtime': 130,
                'vote_average': 7.9,
                'vote_count': 5678,
                'popularity': 77,
                'director': 'Rian Johnson',
                'genres': ['Comedy', 'Crime', 'Drama'],
                'cast': ['Daniel Craig', 'Ana de Armas', 'Chris Evans']
            },
            # Dodaję więcej filmów...
            {
                'title': 'Parasite',
                'overview': 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
                'release_date': date(2019, 5, 30),
                'runtime': 132,
                'vote_average': 8.5,
                'vote_count': 9876,
                'popularity': 75,
                'director': 'Bong Joon-ho',
                'genres': ['Comedy', 'Thriller', 'Drama'],
                'cast': ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong']
            },
            {
                'title': 'Inception',
                'overview': 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
                'release_date': date(2010, 7, 16),
                'runtime': 148,
                'vote_average': 8.3,
                'vote_count': 15432,
                'popularity': 73,
                'director': 'Christopher Nolan',
                'genres': ['Action', 'Science Fiction', 'Adventure'],
                'cast': ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy']
            },
            {
                'title': 'Interstellar',
                'overview': 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                'release_date': date(2014, 11, 7),
                'runtime': 169,
                'vote_average': 8.1,
                'vote_count': 11234,
                'popularity': 71,
                'director': 'Christopher Nolan',
                'genres': ['Adventure', 'Drama', 'Science Fiction'],
                'cast': ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain']
            },
            {
                'title': 'The Grand Budapest Hotel',
                'overview': 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy.',
                'release_date': date(2014, 3, 28),
                'runtime': 99,
                'vote_average': 8.1,
                'vote_count': 6789,
                'popularity': 69,
                'director': 'Wes Anderson',
                'genres': ['Comedy', 'Drama'],
                'cast': ['Ralph Fiennes', 'F. Murray Abraham', 'Mathieu Amalric']
            },
            {
                'title': 'Mad Max: Fury Road',
                'overview': 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.',
                'release_date': date(2015, 5, 15),
                'runtime': 120,
                'vote_average': 7.6,
                'vote_count': 8901,
                'popularity': 67,
                'director': 'George Miller',
                'genres': ['Action', 'Adventure', 'Science Fiction'],
                'cast': ['Tom Hardy', 'Charlize Theron', 'Nicholas Hoult']
            },
            {
                'title': 'Blade Runner 2049',
                'overview': 'Young Blade Runner K discovers a long-buried secret that leads him to track down former Blade Runner Rick Deckard.',
                'release_date': date(2017, 10, 6),
                'runtime': 164,
                'vote_average': 7.9,
                'vote_count': 7654,
                'popularity': 65,
                'director': 'Denis Villeneuve',
                'genres': ['Science Fiction', 'Drama'],
                'cast': ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas']
            },
            {
                'title': 'Get Out',
                'overview': 'A young African-American visits his white girlfriend\'s parents for the weekend, where his simmering uneasiness becomes a nightmare.',
                'release_date': date(2017, 2, 24),
                'runtime': 104,
                'vote_average': 7.7,
                'vote_count': 6543,
                'popularity': 63,
                'director': 'Jordan Peele',
                'genres': ['Mystery', 'Thriller', 'Horror'],
                'cast': ['Daniel Kaluuya', 'Allison Williams', 'Bradley Whitford']
            },
            {
                'title': 'La La Land',
                'overview': 'Mia, an aspiring actress, serves lattes to movie stars in between auditions and Sebastian, a jazz musician.',
                'release_date': date(2016, 12, 9),
                'runtime': 128,
                'vote_average': 7.9,
                'vote_count': 8765,
                'popularity': 61,
                'director': 'Damien Chazelle',
                'genres': ['Comedy', 'Drama', 'Music'],
                'cast': ['Ryan Gosling', 'Emma Stone', 'John Legend']
            },
            {
                'title': 'The Shape of Water',
                'overview': 'At a top secret research facility, a lonely janitor forms a unique relationship with an amphibious creature.',
                'release_date': date(2017, 12, 1),
                'runtime': 123,
                'vote_average': 7.3,
                'vote_count': 5432,
                'popularity': 59,
                'director': 'Guillermo del Toro',
                'genres': ['Adventure', 'Drama', 'Fantasy'],
                'cast': ['Sally Hawkins', 'Michael Shannon', 'Richard Jenkins']
            },
            {
                'title': 'Moonlight',
                'overview': 'A chronicle of the childhood, adolescence and burgeoning adulthood of a young black man growing up in a rough neighborhood.',
                'release_date': date(2016, 10, 21),
                'runtime': 111,
                'vote_average': 7.4,
                'vote_count': 4321,
                'popularity': 57,
                'director': 'Barry Jenkins',
                'genres': ['Drama'],
                'cast': ['Trevante Rhodes', 'André Holland', 'Janelle Monáe']
            },
            # Kontynuuję z resztą filmów...
            {
                'title': 'Joker',
                'overview': 'Arthur Fleck, a failed comedian, is driven insane and turns to a life of crime and chaos in Gotham City.',
                'release_date': date(2019, 10, 4),
                'runtime': 122,
                'vote_average': 8.2,
                'vote_count': 9876,
                'popularity': 85,
                'director': 'Todd Phillips',
                'genres': ['Crime', 'Drama', 'Thriller'],
                'cast': ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz']
            },
            {
                'title': 'Once Upon a Time in Hollywood',
                'overview': 'A faded television actor and his stunt double strive to achieve fame and success in the film industry.',
                'release_date': date(2019, 7, 26),
                'runtime': 161,
                'vote_average': 7.4,
                'vote_count': 7654,
                'popularity': 75,
                'director': 'Quentin Tarantino',
                'genres': ['Comedy', 'Drama'],
                'cast': ['Leonardo DiCaprio', 'Brad Pitt', 'Margot Robbie']
            },
            {
                'title': 'The Irishman',
                'overview': 'A mob hitman recalls his possible involvement with the slaying of Jimmy Hoffa.',
                'release_date': date(2019, 11, 27),
                'runtime': 209,
                'vote_average': 7.8,
                'vote_count': 6543,
                'popularity': 70,
                'director': 'Martin Scorsese',
                'genres': ['Crime', 'Drama'],
                'cast': ['Robert De Niro', 'Al Pacino', 'Joe Pesci']
            },
            {
                'title': 'Ford v Ferrari',
                'overview': 'American car designer Carroll Shelby and driver Ken Miles battle corporate interference as they try to build a revolutionary race car.',
                'release_date': date(2019, 11, 15),
                'runtime': 152,
                'vote_average': 8.1,
                'vote_count': 5432,
                'popularity': 68,
                'director': 'James Mangold',
                'genres': ['Action', 'Biography', 'Drama'],
                'cast': ['Matt Damon', 'Christian Bale', 'Jon Bernthal']
            },
            {
                'title': 'Little Women',
                'overview': 'Four sisters come of age in America in the aftermath of the Civil War.',
                'release_date': date(2019, 12, 25),
                'runtime': 135,
                'vote_average': 7.8,
                'vote_count': 4321,
                'popularity': 65,
                'director': 'Greta Gerwig',
                'genres': ['Drama', 'Romance'],
                'cast': ['Saoirse Ronan', 'Emma Watson', 'Florence Pugh']
            },
            {
                'title': 'Marriage Story',
                'overview': 'Noah Baumbach\'s incisive and compassionate look at a marriage breaking up.',
                'release_date': date(2019, 11, 6),
                'runtime': 137,
                'vote_average': 7.9,
                'vote_count': 3210,
                'popularity': 62,
                'director': 'Noah Baumbach',
                'genres': ['Comedy', 'Drama'],
                'cast': ['Adam Driver', 'Scarlett Johansson', 'Laura Dern']
            },
            {
                'title': 'Uncut Gems',
                'overview': 'A charismatic New York City jeweler always on the lookout for the next big score makes a series of high-stakes bets.',
                'release_date': date(2019, 12, 13),
                'runtime': 135,
                'vote_average': 7.4,
                'vote_count': 4567,
                'popularity': 58,
                'director': 'Safdie Brothers',
                'genres': ['Crime', 'Drama', 'Thriller'],
                'cast': ['Adam Sandler', 'Julia Fox', 'Idina Menzel']
            },
            {
                'title': 'Midsommar',
                'overview': 'A couple travels to Northern Europe to visit a rural hometown\'s fabled Swedish mid-summer festival.',
                'release_date': date(2019, 7, 3),
                'runtime': 148,
                'vote_average': 7.1,
                'vote_count': 3456,
                'popularity': 55,
                'director': 'Ari Aster',
                'genres': ['Drama', 'Horror', 'Mystery'],
                'cast': ['Florence Pugh', 'Jack Reynor', 'Vilhelm Blomgren']
            },
            {
                'title': 'Us',
                'overview': 'A family\'s serenity turns to chaos when a group of doppelgängers begins to terrorize them.',
                'release_date': date(2019, 3, 22),
                'runtime': 116,
                'vote_average': 6.8,
                'vote_count': 5678,
                'popularity': 52,
                'director': 'Jordan Peele',
                'genres': ['Horror', 'Mystery', 'Thriller'],
                'cast': ['Lupita Nyong\'o', 'Winston Duke', 'Elisabeth Moss']
            },
            {
                'title': 'Birdman',
                'overview': 'A washed-up superhero actor attempts to revive his fading career by writing, directing, and starring in a Broadway production.',
                'release_date': date(2014, 10, 17),
                'runtime': 119,
                'vote_average': 7.7,
                'vote_count': 6789,
                'popularity': 48,
                'director': 'Alejandro G. Iñárritu',
                'genres': ['Comedy', 'Drama'],
                'cast': ['Michael Keaton', 'Zach Galifianakis', 'Edward Norton']
            },
            # Dodaję jeszcze więcej filmów do 50...
            {
                'title': 'The Revenant',
                'overview': 'A frontiersman on a fur trading expedition in the 1820s fights for survival after being mauled by a bear.',
                'release_date': date(2015, 12, 25),
                'runtime': 156,
                'vote_average': 8.0,
                'vote_count': 7890,
                'popularity': 78,
                'director': 'Alejandro G. Iñárritu',
                'genres': ['Adventure', 'Drama', 'Action'],
                'cast': ['Leonardo DiCaprio', 'Tom Hardy', 'Domhnall Gleeson']
            },
            {
                'title': 'Whiplash',
                'overview': 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor.',
                'release_date': date(2014, 10, 10),
                'runtime': 106,
                'vote_average': 8.5,
                'vote_count': 6543,
                'popularity': 72,
                'director': 'Damien Chazelle',
                'genres': ['Drama', 'Music'],
                'cast': ['Miles Teller', 'J.K. Simmons', 'Paul Reiser']
            },
            {
                'title': 'Hereditary',
                'overview': 'A grieving family is haunted by tragedy and disturbing secrets.',
                'release_date': date(2018, 6, 8),
                'runtime': 127,
                'vote_average': 7.3,
                'vote_count': 4321,
                'popularity': 68,
                'director': 'Ari Aster',
                'genres': ['Horror', 'Mystery', 'Drama'],
                'cast': ['Toni Collette', 'Alex Wolff', 'Milly Shapiro']
            },
            {
                'title': 'A Quiet Place',
                'overview': 'A family lives in silence while hiding from creatures that hunt by sound.',
                'release_date': date(2018, 4, 6),
                'runtime': 90,
                'vote_average': 7.5,
                'vote_count': 5432,
                'popularity': 65,
                'director': 'John Krasinski',
                'genres': ['Horror', 'Drama', 'Science Fiction'],
                'cast': ['Emily Blunt', 'John Krasinski', 'Millicent Simmonds']
            },
            {
                'title': 'Black Panther',
                'overview': 'T\'Challa returns home to the African nation of Wakanda to take his rightful place as king.',
                'release_date': date(2018, 2, 16),
                'runtime': 134,
                'vote_average': 7.3,
                'vote_count': 8765,
                'popularity': 82,
                'director': 'Ryan Coogler',
                'genres': ['Action', 'Adventure', 'Science Fiction'],
                'cast': ['Chadwick Boseman', 'Michael B. Jordan', 'Lupita Nyong\'o']
            },
            {
                'title': 'Three Billboards Outside Ebbing, Missouri',
                'overview': 'A mother personally challenges the local authorities to solve her daughter\'s murder when they fail to catch the culprit.',
                'release_date': date(2017, 11, 10),
                'runtime': 115,
                'vote_average': 8.1,
                'vote_count': 5678,
                'popularity': 74,
                'director': 'Martin McDonagh',
                'genres': ['Crime', 'Drama'],
                'cast': ['Frances McDormand', 'Woody Harrelson', 'Sam Rockwell']
            },
            {
                'title': 'Call Me by Your Name',
                'overview': 'In 1980s Italy, romance blossoms between a seventeen-year-old student and the older man hired as his father\'s research assistant.',
                'release_date': date(2017, 11, 24),
                'runtime': 132,
                'vote_average': 7.9,
                'vote_count': 4321,
                'popularity': 71,
                'director': 'Luca Guadagnino',
                'genres': ['Romance', 'Drama'],
                'cast': ['Timothée Chalamet', 'Armie Hammer', 'Michael Stuhlbarg']
            },
            {
                'title': 'Lady Bird',
                'overview': 'In 2002, an artistically inclined seventeen-year-old girl comes of age in Sacramento, California.',
                'release_date': date(2017, 11, 3),
                'runtime': 94,
                'vote_average': 7.4,
                'vote_count': 3456,
                'popularity': 68,
                'director': 'Greta Gerwig',
                'genres': ['Comedy', 'Drama'],
                'cast': ['Saoirse Ronan', 'Laurie Metcalf', 'Tracy Letts']
            },
            {
                'title': 'Arrival',
                'overview': 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecrafts appear around the world.',
                'release_date': date(2016, 11, 11),
                'runtime': 116,
                'vote_average': 7.9,
                'vote_count': 6789,
                'popularity': 75,
                'director': 'Denis Villeneuve',
                'genres': ['Drama', 'Science Fiction'],
                'cast': ['Amy Adams', 'Jeremy Renner', 'Forest Whitaker']
            },
            {
                'title': 'Manchester by the Sea',
                'overview': 'A depressed uncle is asked to take care of his teenage nephew after the boy\'s father dies.',
                'release_date': date(2016, 11, 18),
                'runtime': 137,
                'vote_average': 7.8,
                'vote_count': 4567,
                'popularity': 69,
                'director': 'Kenneth Lonergan',
                'genres': ['Drama'],
                'cast': ['Casey Affleck', 'Michelle Williams', 'Kyle Chandler']
            },
            {
                'title': 'Hell or High Water',
                'overview': 'A divorced father and his ex-con older brother resort to a desperate scheme in order to save their family\'s farm in West Texas.',
                'release_date': date(2016, 8, 12),
                'runtime': 102,
                'vote_average': 7.6,
                'vote_count': 3456,
                'popularity': 66,
                'director': 'David Mackenzie',
                'genres': ['Crime', 'Drama', 'Western'],
                'cast': ['Chris Pine', 'Ben Foster', 'Jeff Bridges']
            },
            {
                'title': 'Spotlight',
                'overview': 'The true story of how the Boston Globe uncovered the massive scandal of child molestation and cover-up within the local Catholic Archdiocese.',
                'release_date': date(2015, 11, 6),
                'runtime': 129,
                'vote_average': 8.1,
                'vote_count': 5678,
                'popularity': 73,
                'director': 'Tom McCarthy',
                'genres': ['Drama', 'Crime'],
                'cast': ['Mark Ruffalo', 'Michael Keaton', 'Rachel McAdams']
            },
            {
                'title': 'Room',
                'overview': 'A young boy is raised within the confines of a small shed.',
                'release_date': date(2015, 10, 16),
                'runtime': 118,
                'vote_average': 8.1,
                'vote_count': 4321,
                'popularity': 70,
                'director': 'Lenny Abrahamson',
                'genres': ['Drama', 'Thriller'],
                'cast': ['Brie Larson', 'Jacob Tremblay', 'Joan Allen']
            },
            {
                'title': 'Ex Machina',
                'overview': 'A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence.',
                'release_date': date(2015, 4, 24),
                'runtime': 108,
                'vote_average': 7.7,
                'vote_count': 6789,
                'popularity': 67,
                'director': 'Alex Garland',
                'genres': ['Drama', 'Science Fiction'],
                'cast': ['Domhnall Gleeson', 'Alicia Vikander', 'Oscar Isaac']
            },
            {
                'title': 'Inside Out',
                'overview': 'After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict.',
                'release_date': date(2015, 6, 19),
                'runtime': 95,
                'vote_average': 8.1,
                'vote_count': 7890,
                'popularity': 85,
                'director': 'Pete Docter',
                'genres': ['Animation', 'Family', 'Adventure'],
                'cast': ['Amy Poehler', 'Phyllis Smith', 'Richard Kind']
            },
            {
                'title': 'Her',
                'overview': 'In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.',
                'release_date': date(2013, 12, 18),
                'runtime': 126,
                'vote_average': 7.9,
                'vote_count': 5432,
                'popularity': 64,
                'director': 'Spike Jonze',
                'genres': ['Romance', 'Science Fiction', 'Drama'],
                'cast': ['Joaquin Phoenix', 'Scarlett Johansson', 'Amy Adams']
            },
            {
                'title': 'Gravity',
                'overview': 'A medical engineer and an astronaut work together to survive after an accident leaves them adrift in space.',
                'release_date': date(2013, 10, 4),
                'runtime': 91,
                'vote_average': 7.7,
                'vote_count': 8765,
                'popularity': 76,
                'director': 'Alfonso Cuarón',
                'genres': ['Science Fiction', 'Thriller', 'Drama'],
                'cast': ['Sandra Bullock', 'George Clooney', 'Ed Harris']
            },
            {
                'title': '12 Years a Slave',
                'overview': 'In the antebellum United States, Solomon Northup, a free black man from upstate New York, is abducted and sold into slavery.',
                'release_date': date(2013, 10, 18),
                'runtime': 134,
                'vote_average': 8.1,
                'vote_count': 6543,
                'popularity': 71,
                'director': 'Steve McQueen',
                'genres': ['Drama', 'History'],
                'cast': ['Chiwetel Ejiofor', 'Michael Fassbender', 'Lupita Nyong\'o']
            },
            {
                'title': 'Django Unchained',
                'overview': 'With the help of a German hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.',
                'release_date': date(2012, 12, 25),
                'runtime': 165,
                'vote_average': 8.4,
                'vote_count': 9876,
                'popularity': 82,
                'director': 'Quentin Tarantino',
                'genres': ['Drama', 'Western'],
                'cast': ['Jamie Foxx', 'Christoph Waltz', 'Leonardo DiCaprio']
            },
            {
                'title': 'Life of Pi',
                'overview': 'A young man who survives a disaster at sea is hurtled into an epic journey of adventure and discovery.',
                'release_date': date(2012, 11, 21),
                'runtime': 127,
                'vote_average': 7.9,
                'vote_count': 5678,
                'popularity': 68,
                'director': 'Ang Lee',
                'genres': ['Adventure', 'Drama', 'Family'],
                'cast': ['Suraj Sharma', 'Irrfan Khan', 'Tabu']
            },
            {
                'title': 'Argo',
                'overview': 'Acting under the cover of a Hollywood producer scouting a location for a science fiction film, a CIA agent launches a dangerous operation.',
                'release_date': date(2012, 10, 12),
                'runtime': 120,
                'vote_average': 7.7,
                'vote_count': 7890,
                'popularity': 74,
                'director': 'Ben Affleck',
                'genres': ['Drama', 'Thriller'],
                'cast': ['Ben Affleck', 'Bryan Cranston', 'Alan Arkin']
            },
            {
                'title': 'The Artist',
                'overview': 'A silent movie star meets a young dancer, but the arrival of talking pictures sends their careers in opposite directions.',
                'release_date': date(2011, 11, 25),
                'runtime': 100,
                'vote_average': 7.9,
                'vote_count': 4321,
                'popularity': 61,
                'director': 'Michel Hazanavicius',
                'genres': ['Drama', 'Comedy', 'Romance'],
                'cast': ['Jean Dujardin', 'Bérénice Bejo', 'John Goodman']
            }
        ]

        created_count = 0
        for movie_data in movies_data:
            # Check if movie already exists
            if Movie.objects.filter(title=movie_data['title']).exists():
                self.stdout.write(f'Movie "{movie_data["title"]}" already exists, skipping...')
                continue

            # Create movie
            movie = Movie.objects.create(
                title=movie_data['title'],
                overview=movie_data['overview'],
                release_date=movie_data['release_date'],
                runtime=movie_data.get('runtime'),
                vote_average=movie_data.get('vote_average', 0),
                vote_count=movie_data.get('vote_count', 0),
                popularity=movie_data.get('popularity', 0),
                director=directors.get(movie_data['director']),
            )

            # Add genres
            for genre_name in movie_data.get('genres', []):
                if genre_name in genres:
                    movie.genres.add(genres[genre_name])

            # Add cast (sample cast - you can expand this)
            cast_list = movie_data.get('cast', [])
            for i, actor_name in enumerate(cast_list[:5]):  # Limit to 5 actors
                if actor_name in actors:
                    MovieCast.objects.create(
                        movie=movie,
                        person=actors[actor_name],
                        character_name=f"Character {i+1}",  # Placeholder character names
                        order=i
                    )

            created_count += 1
            self.stdout.write(f'Created movie: {movie.title}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} movies')
        )
