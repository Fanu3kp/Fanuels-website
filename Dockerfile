FROM php:8.2-cli

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev unzip git \
    && docker-php-ext-install pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY backend/ .

RUN composer install --no-dev --optimize-autoloader --no-interaction

# Render injects PORT; the built-in Laravel server routes correctly to public/index.php.
# Migrations run first (idempotent); the server still starts if the DB is briefly
# unavailable during a spin-up so the service never enters a crash loop.
CMD ["sh", "-c", "php artisan migrate --force 2>&1 || true; php artisan serve --host=0.0.0.0 --port=${PORT:-8080} --env=production"]
