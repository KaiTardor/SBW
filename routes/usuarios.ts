import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma.client.ts";
import logger from "../logger.ts";

const router = express.Router();

// Formulario de login (GET)
router.get('/login', (req, res) => {
  res.render('login.njk', { error: false });
});

// Procesar login (POST)
router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const usuario = await prisma.usuario.autentifica(email, contraseña);

    // Crear token JWT con los datos del usuario
    const token = jwt.sign(
      { usuario: usuario.nombre, admin: usuario.admin },
      process.env.SECRET_KEY as string
    );

    // Guardar token en cookie httpOnly y redirigir a portada
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }).redirect('/');

  } catch (error: any) {
    logger.error(error.message);
    res.render('login.njk', { error: true });
  }
});

// Logout: borrar la cookie y redirigir
router.get('/logout', (req, res) => {
  res.clearCookie("access_token").redirect('/');
});

// Formulario de registro (GET)
router.get('/registro', (req, res) => {
  res.render('registro.njk', { error: null });
});

// Procesar registro (POST)
router.post('/registro', async (req, res) => {
  const { email, nombre, contraseña } = req.body;

  try {
    // La función registra ya aplica el hash a la contraseña con bcrypt
    const usuario = await prisma.usuario.registra(email, nombre, contraseña, false);

    // Auto-login automático tras el registro
    const token = jwt.sign(
      { usuario: usuario.nombre, admin: usuario.admin },
      process.env.SECRET_KEY as string
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }).redirect('/');

  } catch (error: any) {
    logger.error(`Error en registro: ${error.message}`);
    res.render('registro.njk', { error: "El correo ya está registrado o los datos son inválidos." });
  }
});

export default router;
