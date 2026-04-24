# 🏛️ Tienda Prado - SBW

Aplicación web de e-commerce que replica la tienda online del Museo del Prado, desarrollada como proyecto de la asignatura SBW.

## Tecnologías

- **Backend:** Node.js + Express + TypeScript
- **Base de Datos:** PostgreSQL (Docker) + Prisma ORM
- **Vistas SSR:** Nunjucks + Bootstrap 5
- **Frontend SPA:** React + Vite + Tailwind CSS v4
- **Autenticación:** JWT + bcrypt + cookies httpOnly
- **Logging:** Winston
- **Scraping:** Playwright

## Estructura del Proyecto

```text
├── prisma/                  Model (esquema + cliente Prisma)
├── routes/                  Controladores (incluye api.ts con endpoints RESTful)
├── views/                   Vistas SSR (Nunjucks)
├── spa/                     Frontend Independiente (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/      Cuadros.tsx (Galería), Inspiracion.tsx (Citas)
│   │   └── App.tsx          Layout Maestro-Detalle tipo Museo
├── imagenes/                Imágenes locales
├── index.ts                 Servidor Express (Configurado con CORS)
└── ...
```

## Instalación y Ejecución

Para iniciar el **Backend y la Tienda principal**:
```bash
# Instalar dependencias
npm install

# Levantar PostgreSQL, migrar y generar Prisma
docker compose up -d
npx prisma migrate dev
npx prisma generate

# Poblar la BD
npx tsx seed.ts
npx tsx registra_usuarios.ts

# Iniciar servidor Express (Puerto 3000)
npm run dev
```

Para iniciar la **SPA (Galería de React)**:
Abre una segunda terminal y ejecuta:
```bash
cd spa
npm install
npm run dev
```
La tienda funcionará en `http://localhost:3000` y la Galería SPA en `http://localhost:5173`.

## Funcionalidades (Entrega 1)

- ✅ Web scraping de productos desde tiendaprado.com
- ✅ Base de datos PostgreSQL con Prisma ORM
- ✅ Catálogo con paginación, ordenación y vistas grid/lista
- ✅ Búsqueda por título y descripción
- ✅ Página de detalle de producto
- ✅ Autenticación básica con JWT
- ✅ Sistema de logging con Winston

## Funcionalidades (Entrega 2)

- ✅ **API RESTful:** Rutas de datos CRUD (`GET`, `POST`, `PUT`, `DELETE`) en `/api/productos`.
- ✅ **CORS Habilitado:** Comunicación segura entre puertos distintos (Express <-> Vite).
- ✅ **Experiencia de Usuario (UX) Mejorada:** Registro y Login rediseñados con validaciones instantáneas (*on-blur*), teclado dinámico, alternancia de visibilidad de contraseña y auto-focus.
- ✅ **Carrito Dinámico con DOM:** Carrito lateral tipo *offcanvas* que evita recargas de página. Usa clones de etiquetas `<template>`, agrupación automática de items con controles `+` y `-`, cálculo en tiempo real de subtotales y proceso de Checkout vía API ad-hoc.
- ✅ **SPA con React + Tailwind:** Interfaz inmersiva ("Maestro-Detalle") que combina una galería de arte con auto-rotación cada 10s (consumiendo el API interno mediante `SWR`) y un lector interactivo de citas célebres (consumiendo un API externo).

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@tiendaprado.com | admin123 | Admin |
| usuario@tiendaprado.com | usuario123 | Normal |
| maria@tiendaprado.com | maria123 | Normal |
