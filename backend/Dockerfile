# --- etap budowania ---
    FROM python:3.13-alpine as builder
    WORKDIR /app
    
    # Zależności systemowe potrzebne do psycopg2
    RUN apk add --no-cache postgresql-dev gcc musl-dev
    
    COPY requirements.txt .
    RUN pip install --upgrade pip \
        && pip install --no-cache-dir -r requirements.txt
    
    # --- etap uruchomieniowy ---
    FROM python:3.13-alpine
    WORKDIR /app
    
    # Runtime dependencies dla PostgreSQL
    RUN apk add --no-cache libpq
    
    # Skopiuj z buildera zainstalowane pakiety i skrypty (django-admin, gunicorn itd.)
    COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
    COPY --from=builder /usr/local/bin /usr/local/bin
    
    # Skopiuj kod aplikacji
    COPY . .
    
    ENV PYTHONDONTWRITEBYTECODE=1
    ENV PYTHONUNBUFFERED=1
    
    # Uruchom Gunicorna jako WSGI server
    CMD ["gunicorn", "filmvault.wsgi:application", "--bind", "0.0.0.0:8000"]