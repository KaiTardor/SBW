# ─── Imagen base ──────────────────────────────────────────────────────────────
FROM node:24-alpine AS base

WORKDIR /build

# Copiar los manifiestos de dependencias
# package-lock.json asegura instalación reproducible con npm ci
COPY package*.json ./

# Decirle a Prisma qué binario descargar ANTES del install:
# Alpine usa musl libc, no glibc → sin esto Prisma falla con ECONNRESET
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

# Configurar npm para redes inestables (WSL2/VPS) y luego instalar
# --omit=dev: excluye @types/*, playwright, chokidar (innecesarios en prod)
# prisma y tsx están en dependencies → se instalan aquí
RUN npm config set fetch-retries 10 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --omit=dev && \
    npm cache clean --force

# Copiar el código fuente completo
COPY . .

# Generar el cliente de Prisma con el binario musl correcto
RUN npx prisma generate

# Limpiar posibles CRLF de Windows y dar permisos al entrypoint
RUN sed -i 's/\r//' /build/docker-entrypoint.sh && chmod +x /build/docker-entrypoint.sh

# ─── Variables de entorno de producción ───────────────────────────────────────
ENV NODE_ENV=production
ENV LOG_LEVEL=production
ENV POSTGRES_PASSWORD=una_clave_muy_segura_123
ENV POSTGRES_USER=yo
ENV POSTGRES_DB=ssbw
ENV IN=production
ENV SECRET_KEY="clave_supersegura_12345"
ENV PORT=3000
ENV POSTGRES_HOST=db
ENV DATABASE_URL=postgresql://yo:una_clave_muy_segura_123@db:5432/ssbw?schema=public

# Documentar el puerto expuesto
EXPOSE 3000

# El entrypoint ejecuta las migraciones de Prisma automáticamente
# y luego arranca la aplicación con tsx
CMD ["/build/docker-entrypoint.sh"]
