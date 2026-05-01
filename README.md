# Tienda Prado - SBW

Aplicación web de e-commerce que replica la tienda online del Museo del Prado, desarrollada como proyecto de la asignatura SBW.

## Tecnologías

- **Backend:** Node.js + Express + TypeScript
- **Base de Datos:** PostgreSQL (Docker) + Prisma ORM
- **Vistas:** Nunjucks + Bootstrap 5 + React (SPA)
- **Styling:** CSS + Bootstrap + Tailwind CSS
- **Autenticación:** JWT + bcrypt + cookies httpOnly
- **Logging:** Winston
- **Herramientas:** Vite (SPA), Playwright (Scraping)

## Estructura MVC

```
├── prisma/                  Model (esquema + cliente Prisma)
├── routes/                  Controladores
│   ├── api.ts               API RESTful de productos
│   ├── productos.ts         Catálogo, carrito dinámico, checkout
│   └── usuarios.ts          Login, registro y JWT
├── views/                   Vistas (Nunjucks)
│   ├── base.njk             Layout maestro + lógica Carrito DOM
│   ├── portada.njk          Catálogo
│   ├── detalle.njk          Ficha de producto
│   └── login.njk            Login con UX mejorada
├── spa/                     Single Page Application (React + Vite)
│   ├── src/components/      Componentes (Cuadros, Inspiracion)
│   └── src/App.tsx          Layout Maestro-Detalle SPA
├── imagenes/                Imágenes de productos (scrapeadas)
├── index.ts                 Servidor Express + Configuración CORS
├── logger.ts                Configuración Winston
├── seed.ts                  Poblado de la BD
├── registra_usuarios.ts     Usuarios de prueba
└── docker-compose.yml       PostgreSQL en contenedor
```

## Instalación y Ejecución

### Backend (Express)
```bash
# Instalar dependencias
npm install
# Levantar PostgreSQL
docker compose up -d
# Migrar BD y poblar
npx prisma migrate dev
npx tsx seed.ts
npx tsx registra_usuarios.ts
# Iniciar servidor
npm run dev
```

### Frontend SPA (React)
```bash
cd spa
npm install
npm run dev
```

## Funcionalidades (Entrega 2)

### Backend & API
- ✅ **API RESTful:** Endpoints para gestión de productos y servicios para la SPA.
- ✅ **CORS:** Configuración de seguridad para permitir comunicación entre dominios.
- ✅ **Registro:** Sistema de alta de nuevos usuarios con autologin.
- ✅ **Checkout:** API para finalización de pedido y gestión de estado del carrito.

### UX & Carrito DOM
- ✅ **Mejoras UX:** Validación de campos *on-blur*, teclados especializados y visibilidad de contraseña.
- ✅ **Carrito Dinámico:** Implementación de Offcanvas usando `<template>` y manipulación de DOM.
- ✅ **Gestión de Cantidades:** Botones +/- para actualizar el carrito en tiempo real sin recargar.

### SPA (React + Tailwind)
- ✅ **Arquitectura SPA:** Proyecto independiente con Vite y React.
- ✅ **Galería Inmersiva:** Auto-rotación de obras (10s) con barra de progreso visual.
- ✅ **Inspiración Artística:** Consumo de API externa con navegación por historial (flechas).
- ✅ **Diseño Premium:** Estética "Prado" con Tailwind CSS, fuentes serif y layout responsivo.

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
