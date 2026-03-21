import prisma from "./prisma/prisma.client.ts";
import logger from "./logger.ts";

async function main() {
  // Registrar usuarios de prueba
  const usuarios = [
    { email: "admin@tiendaprado.com", nombre: "Administrador", contraseña: "admin123", admin: true },
    { email: "usuario@tiendaprado.com", nombre: "Usuario Normal", contraseña: "usuario123", admin: false },
    { email: "maria@tiendaprado.com", nombre: "María García", contraseña: "maria123", admin: false },
  ];

  console.log("=== Registrando usuarios de prueba ===\n");

  for (const u of usuarios) {
    try {
      const creado = await prisma.usuario.registra(u.email, u.nombre, u.contraseña, u.admin);
      console.log(`✅ Registrado: ${creado.nombre} (${creado.email}) admin=${creado.admin}`);
    } catch (error: any) {
      // Si ya existe, lo indicamos
      console.log(`⚠️  Ya existe o error: ${u.email} -> ${error.message}`);
    }
  }

  // Comprobar autentificación
  console.log("\n=== Comprobación de autentificación ===\n");

  // 1. Login correcto
  try {
    const user = await prisma.usuario.autentifica("admin@tiendaprado.com", "admin123");
    console.log(`✅ Login correcto: ${user.nombre} (admin=${user.admin})`);
  } catch (e: any) {
    console.log(`❌ Login falló: ${e.message}`);
  }

  // 2. Contraseña incorrecta
  try {
    const user = await prisma.usuario.autentifica("usuario@tiendaprado.com", "clave_mala");
    console.log(`✅ Login correcto: ${user.nombre}`);
  } catch (e: any) {
    console.log(`❌ Login falló (esperado): ${e.message}`);
  }

  // 3. Usuario inexistente
  try {
    const user = await prisma.usuario.autentifica("noexiste@x.com", "1234");
    console.log(`✅ Login correcto: ${user.nombre}`);
  } catch (e: any) {
    console.log(`❌ Login falló (esperado): ${e.message}`);
  }

  await prisma.$disconnect();
}

main();
