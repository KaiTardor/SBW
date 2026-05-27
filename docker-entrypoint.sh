#!/bin/sh
# docker-entrypoint.sh — Se ejecuta al arrancar el contenedor de tienda-prado
#
# 1. Espera a que PostgreSQL acepte conexiones (por si el healthcheck tarda)
# 2. Ejecuta las migraciones de Prisma (crea/actualiza tablas)
# 3. Arranca la aplicación Express

set -e

echo "⏳  Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

echo "✅  Migraciones completadas. Arrancando la aplicación..."
exec npx tsx index.ts
