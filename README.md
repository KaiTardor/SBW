# 🏛️ Tienda Prado - SBW

Aplicación web de e-commerce que replica la tienda online del Museo del Prado, desarrollada como proyecto de la asignatura SBW.

## Tecnologías

- **Backend:** Node.js + Express + TypeScript
- **Base de Datos:** PostgreSQL (Docker) + Prisma ORM
- **Vistas:** Nunjucks + Bootstrap 5
- **Autenticación:** JWT + bcrypt + cookies httpOnly
- **Logging:** Winston
- **Scraping:** Playwright

## Estructura MVC

```
├── prisma/                  Model (esquema + cliente Prisma)
├── routes/                  Controladores
│   ├── productos.ts         Catálogo, búsqueda, paginación, carrito
│   └── usuarios.ts          Login / Logout con JWT
├── views/                   Vistas (Nunjucks)
│   ├── base.njk             Layout maestro
│   ├── portada.njk          Catálogo con filtros y paginación
│   ├── detalle.njk          Ficha de producto
│   └── login.njk            Formulario de autenticación
├── imagenes/                Imágenes de productos (scrapeadas)
├── index.ts                 Servidor Express
├── logger.ts                Configuración Winston
├── seed.ts                  Poblado de la BD
├── registra_usuarios.ts     Usuarios de prueba
└── docker-compose.yml       PostgreSQL en contenedor
```

## Instalación

```bash
# Instalar dependencias
npm install

# Levantar PostgreSQL
docker compose up -d

# Migrar y generar cliente Prisma
npx prisma migrate dev
npx prisma generate

# Poblar la BD con productos y usuarios
npx tsx seed.ts
npx tsx registra_usuarios.ts

# Iniciar servidor de desarrollo
npm run dev
```

## Funcionalidades (Entrega 1)

- ✅ Web scraping de productos desde tiendaprado.com
- ✅ Base de datos PostgreSQL con Prisma ORM
- ✅ Catálogo con paginación, ordenación y vistas grid/lista
- ✅ Búsqueda por título y descripción
- ✅ Página de detalle de producto
- ✅ Carrito de compras con sesiones
- ✅ Autenticación con JWT y cookies seguras
- ✅ Sistema de logging con Winston

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@tiendaprado.com | admin123 | Admin |
| usuario@tiendaprado.com | usuario123 | Normal |
| maria@tiendaprado.com | maria123 | Normal |
