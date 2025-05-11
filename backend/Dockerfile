# etap build
FROM python:3.13-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libpq       # runtime’owa libpq
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt
COPY . .

# etap runtime
FROM python:3.13-alpine
WORKDIR /app
RUN apk add --no-cache libpq
COPY --from=builder /usr/local /usr/local
COPY . .
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
CMD ["gunicorn", "filmvault.wsgi:application", "--bind", "0.0.0.0:8000"]
