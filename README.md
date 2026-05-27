# Tienda Prado - SBW

Aplicación web de e-commerce que replica la tienda online del Museo del Prado, desarrollada como proyecto de la asignatura SBW.

## Tecnologías

- **Backend:** Node.js + Express + TypeScript
- **Base de Datos:** PostgreSQL (Docker) + Prisma ORM
- **Vistas:** Nunjucks + Bootstrap 5
- **SPA React:** React + Vite + React Router + Embla Carousel + DaisyUI + Tailwind v4
- **SSG Astro:** Astro + React Islands + Tailwind v4 + DaisyUI v5
- **Autenticación:** JWT + bcrypt + cookies httpOnly
- **Logging:** Winston
- **Despliegue IaaS:** Docker Compose + Caddy (proxy inverso)

## Estructura del Proyecto

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
├── spa/                     Single Page Application (React + Vite) [T9 & T10]
│   ├── src/pages/           Portada, Carrusel, Tarea9 (Tienda Prado)
│   ├── src/components/      Cuadros, Inspiracion, etc.
│   ├── src/layouts/         MainLayout.tsx (navbar + React Router)
│   └── src/App.tsx          Definición de rutas
├── astro-tienda/            Sitio Estático con Astro SSG [T11 & T12]
│   ├── src/pages/           index.astro, carrousel.astro, ssg.astro, productos/[slug].astro
│   ├── src/components/      Welcome.astro, Carrousel.tsx, CarrouselSSG.tsx, CardProducto.astro
│   ├── src/layouts/         Layout.astro (navbar compartido)
│   ├── src/utils/           slugify.ts
│   └── data/productos.json  Datos estáticos exportados de la BD
├── imagenes/                Imágenes de productos (scrapeadas)
├── index.ts                 Servidor Express + Configuración CORS
├── logger.ts                Configuración Winston
├── seed.ts                  Poblado de la BD
├── registra_usuarios.ts     Usuarios de prueba
├── docker-compose.yml       PostgreSQL en contenedor (desarrollo)
├── docker-compose-prod.yml  Despliegue IaaS completo (BD + App + Caddy)
├── Dockerfile               Imagen Docker de la tienda (Node 24 Alpine)
└── Caddyfile                Configuración del proxy inverso Caddy
```

## Instalación y Ejecución

### Backend (Express) — Puerto 3000
```bash
npm install
docker compose up -d
npx prisma migrate dev
npx tsx seed.ts
npx tsx registra_usuarios.ts
npm run dev
```

### SPA React (Tareas 9 & 10) — Puerto 5173
```bash
cd spa
npm install
npm run dev
```

### Sitio Estático Astro (Tareas 11 & 12) — Puerto 4321
```bash
cd astro-tienda
pnpm install
pnpm dev        # Desarrollo
pnpm build      # Build estático → carpeta dist/
pnpm preview    # Previsualizar build (simula Netlify)
```

> El backend (puerto 3000) debe estar levantado para que las imágenes carguen en la SPA. El sitio Astro es completamente autónomo tras el build.

### Despliegue IaaS con Docker Compose (Tarea 13)

> Requiere tener Docker instalado y corriendo. La tienda se expone en `http://localhost` (puerto 80) a través de Caddy como proxy inverso.

#### Primera vez (instalación desde cero)

```bash
# 1. Construir la imagen y levantar los 3 servicios (BD + App + Caddy)
#    Las migraciones de Prisma se ejecutan automáticamente al arrancar.
docker compose -f docker-compose-prod.yml up -d --build

# 2. Poblar la base de datos con los 50 productos (solo la primera vez)
docker compose -f docker-compose-prod.yml exec tienda-prado npx tsx seed.ts

# 3. Crear los usuarios de prueba (solo la primera vez)
docker compose -f docker-compose-prod.yml exec tienda-prado npx tsx registra_usuarios.ts
```

La tienda estará disponible en **http://localhost**.

#### 🌐 Activar HTTPS en un VPS real

Sustituye `:80` en [`Caddyfile`](./Caddyfile) por tu dominio:
```
tiendaprado.ejemplo.com {
  handle_path /* {
    reverse_proxy tienda-prado:3000
  }
  log { output stdout }
}
```
Caddy gestionará los certificados TLS (Let's Encrypt) automáticamente, sin configuración adicional.


## Funcionalidades por Entrega

### Entrega 3 — Astro Framework + SSG + React Router + IaaS (Tareas 9–13)

#### Tarea 13 — Despliegue IaaS en VPS con Docker Compose

| Fichero | Descripción |
|---|---|
| `Dockerfile` | Imagen Node 24 Alpine con `tsx` para ejecutar TypeScript directamente |
| `docker-compose-prod.yml` | Orquesta DB + App + Proxy inverso en un solo `docker compose up` |
| `Caddyfile` | Proxy inverso: reenvío HTTP→App, logs a stdout, HTTPS automático si hay dominio |

- ✅ **Tres servicios:** PostgreSQL 16, Express/Prisma, Caddy — todo en red interna Docker.
- ✅ **Health-check en la BD:** la app espera a que PostgreSQL esté listo antes de arrancar.
- ✅ **Sin puertos expuestos en la app:** el tráfico sólo entra por Caddy (seguridad).
- ✅ **Volúmenes persistentes:** los datos de PostgreSQL y los certificados TLS sobreviven a reinicios.
- ✅ **HTTPS listo:** cambia `:80` por un dominio en `Caddyfile` → Caddy gestiona TLS automáticamente.

### Entrega 3 — Astro Framework + SSG + React Router (Tareas 9–12)

#### Tareas 11 & 12 — Astro SSG + React Islands

> 🌐 **Deploy en Netlify:** [frolicking-chebakia-cdd96b.netlify.app](https://frolicking-chebakia-cdd96b.netlify.app)

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Astro estático | Portada con Hero y Tabs DaisyUI (sin JS) |
| `/carrousel` | React Island | Galería Embla Carousel (`client:load`) |
| `/ssg` | Astro SSG | Carrusel React con props + 12 destacados |
| `/productos/[slug]` | SSG × 50 | Detalle de producto con `getStaticPaths()` |

- ✅ **Astro Islands:** React hidratado de forma aislada; resto es HTML estático puro.
- ✅ **`CarrouselSSG`:** Imágenes pasadas como props desde JSON — sin fetch en tiempo real.
- ✅ **`getStaticPaths()`:** 50 páginas de detalle pre-generadas en build (53 páginas totales).
- ✅ **Deploy Netlify:** 167 archivos, build completamente estático listo para producción.

#### Tarea 10 — React Router + Embla + DaisyUI

- ✅ **3 rutas SPA:** Portada, Colección de Obras (Embla), Tienda Prado.
- ✅ **DaisyUI Tabs:** Escultura, Pintura, Mitología con contenido dinámico.
- ✅ **Temporizador inteligente:** Se resetea al navegar manualmente el carrusel.
- ✅ **Diseño responsivo:** Estética minimalista "Museo Prado" con Tailwind v4.

#### Tarea 9 — React SPA

- ✅ **Layout Maestro-Detalle:** Galería de obras + citas artísticas.
- ✅ **Auto-rotación 10s:** Barra de progreso dorada + cambio manual con reset.
- ✅ **API de citas:** Historial con flechas (dummyjson.com).
- ✅ **Responsivo:** Imagen siempre visible en la parte superior en móvil.

### Entrega 2 — Backend & UX

- ✅ **API RESTful:** CRUD de productos + endpoint random para la SPA.
- ✅ **CORS:** Configurado para comunicación SPA ↔ Backend.
- ✅ **Carrito Dinámico:** Offcanvas con `<template>` DOM, botones +/-.
- ✅ **Checkout:** Finalización de pedido con feedback visual.
- ✅ **UX:** Validación on-blur, visibilidad de contraseña, registro con autologin.

### Entrega 1 — Fundamentos

- ✅ Web scraping de tiendaprado.com con Playwright
- ✅ PostgreSQL + Prisma ORM
- ✅ Catálogo con paginación, ordenación y vistas grid/lista
- ✅ Búsqueda por título y descripción
- ✅ Carrito de compras con sesiones
- ✅ Autenticación JWT + cookies httpOnly
- ✅ Logging con Winston

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@tiendaprado.com | admin123 | Admin |
| usuario@tiendaprado.com | usuario123 | Normal |
| maria@tiendaprado.com | maria123 | Normal |
