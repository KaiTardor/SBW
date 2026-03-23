import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    carrito: Array<{ id: number, cantidad: number }>;
    total_carrito: number;
  }
}
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import logger from './logger.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configurar Nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== 'production'
});

app.set('view engine', 'njk');

// Middleware para decodificar datos del body (formularios POST y JSON para API)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para leer cookies
app.use(cookieParser());

// Middleware para las sesiones (carrito)
app.use(session({
  secret: 'tienda-prado-secret-key-super-segura',
  resave: false,
  saveUninitialized: false
}));

// Middleware global para inyectar info del carrito a las plantillas
app.use((req, res, next) => {
  res.locals.total_carrito = req.session.total_carrito || 0;
  next();
});

// Middleware de autentificación JWT (antes de los routes)
app.use((req: any, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    try {
      const data = jwt.verify(token, process.env.SECRET_KEY as string) as any;
      req.usuario = data.usuario;
      req.admin = data.admin;
      app.locals.usuario = data.usuario;
      app.locals.admin = data.admin;
      logger.debug(`Autentificado ${data.usuario} admin:${data.admin}`);
    } catch (err) {
      // Token inválido o expirado, limpiar
      app.locals.usuario = undefined;
      app.locals.admin = undefined;
    }
  } else {
    app.locals.usuario = undefined;
    app.locals.admin = undefined;
  }
  next();
});

// Middleware para servir las imágenes
app.use('/public/imagenes', express.static('imagenes'));

// Rutas
import ProductosRouter from "./routes/productos.ts";
import UsuariosRouter from "./routes/usuarios.ts";
import ApiRouter from "./routes/api.ts";
app.use('/', ProductosRouter);
app.use('/', UsuariosRouter);
app.use('/', ApiRouter);

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
