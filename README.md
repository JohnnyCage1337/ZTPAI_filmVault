# FilmVault - Movie Database & Rating Platform

FilmVault to zaawansowana platforma do zarządzania bazą danych filmów, oceniania i tworzenia list obserwowanych.


##  Opis projektu

FilmVault to kompleksowa platforma filmowa umożliwiająca użytkownikom:

- Przeglądanie obszernej bazy danych filmów (143 filmy)
- Ocenianie filmów w skali 1-10
- Tworzenie personalnych list obserwowanych
- Wyszukiwanie filmów według tytułu, gatunku, roku
- Przeglądanie trendujących, najpopularniejszych i najlepiej ocenianych filmów

##  Architektura systemu

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│    Frontend     │◄──►│     Backend      │◄──►│    Database     │
│   (React SPA)   │    │ (Django REST API)│    │  (PostgreSQL)   │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │ Vite    │             │                       │ Volume  │
    │ Dev     │             │ WSGI    │             │ Storage │
    │ Server  │             │ Server  │             │         │
    └─────────┘             └─────────┘             └─────────┘
```

##  Technologie

### Backend Technologies

- **Django 5.0** - Python web framework
- **Django REST Framework 3.14** - API framework
- **PostgreSQL 15** - Relacyjna baza danych
- **drf-spectacular 0.27** - OpenAPI documentation
- **Pillow 10.0** - Image processing
- **python-decouple** - Configuration management
- **psycopg2-binary** - PostgreSQL adapter

### Frontend Technologies

- **React 18.2.0** - JavaScript UI library
- **Vite 5.4.1** - Build tool and dev server
- **React Router DOM 6.21.0** - Client-side routing
- **Bootstrap 5.3.0** - CSS framework
- **Axios** - HTTP client (via services)

### DevOps & Tools

- **Docker & Docker Compose** - Containerization
- **Git** - Version control
- **ESLint** - JavaScript linting
- **Jest** - Testing framework (planned)

##  Instalacja i uruchomienie

### Wymagania wstępne

- Docker 20.0+
- Docker Compose 2.0+
- Git

### Szybkie uruchomienie (Docker)

1. **Klonowanie repozytorium**

```bash
git clone https://github.com/JohnnyCage1337/ZTPAI_filmVault.git
cd ZTPAI_filmVault
```

2. **Konfiguracja środowiska**

```bash
cd backend
```

3. **Uruchomienie wszystkich serwisów**

```bash

docker-compose up --build
```

4. **Dostęp do aplikacji**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Dokumentacja API: http://localhost:8000/api/docs/
- Admin Panel: http://localhost:8000/admin/
- API Documentation: (http://localhost:8000/api/docs/)
