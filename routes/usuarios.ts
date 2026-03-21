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

export default router;
