#!/bin/sh
set -e

cd /var/www/html

# Install composer dependencies if vendor/ is missing
if [ ! -d "vendor" ]; then
    echo ">>> [entrypoint] Installing Composer dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Generate app key if missing
if grep -q "APP_KEY=$" .env 2>/dev/null || grep -q "^APP_KEY=$" .env 2>/dev/null; then
    echo ">>> [entrypoint] Generating application key..."
    php artisan key:generate --force
fi

# Wait for PostgreSQL to be ready
echo ">>> [entrypoint] Waiting for PostgreSQL..."
until php -r "new PDO('pgsql:host=${DB_HOST:-postgres};port=${DB_PORT:-5432};dbname=${DB_DATABASE:-ephesus}', '${DB_USERNAME:-ephesus}', '${DB_PASSWORD:-secret}');" 2>/dev/null; do
    echo "  PostgreSQL not ready yet — retrying in 2s..."
    sleep 2
done
echo ">>> [entrypoint] PostgreSQL is ready."

# Wait for Redis
echo ">>> [entrypoint] Waiting for Redis..."
until php -r "
\$r = new Redis();
\$r->connect('${REDIS_HOST:-redis}', ${REDIS_PORT:-6379});
if ('${REDIS_PASSWORD}') \$r->auth('${REDIS_PASSWORD}');
echo \$r->ping();
" 2>/dev/null | grep -q "+PONG\|1"; do
    echo "  Redis not ready — retrying in 2s..."
    sleep 2
done
echo ">>> [entrypoint] Redis is ready."

# Run migrations
echo ">>> [entrypoint] Running migrations..."
php artisan migrate --force

# Seed on fresh install (only if users table is empty)
SEEDED=$(php artisan tinker --execute="echo \App\Domain\User\Models\User::count();" 2>/dev/null | tail -1)
if [ "$SEEDED" = "0" ]; then
    echo ">>> [entrypoint] Seeding database..."
    php artisan db:seed --force
fi

# Clear stale caches (dev mode — no route:cache so missing controllers don't block boot)
php artisan config:clear || true
php artisan route:clear || true

echo ">>> [entrypoint] Setup complete. Starting php-fpm..."
exec php-fpm
