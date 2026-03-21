import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

// 1. Setup the adapter con la librería pg
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Initialize Prisma with the adapter
const basePrisma = new PrismaClient({ adapter });

// 3. Extender Prisma con métodos de hashing para Usuario
const prisma = basePrisma.$extends({
  model: {
    usuario: {
      // Registrar un usuario con contraseña hasheada
      async registra(email: string, nombre: string, contraseña: string, admin: boolean = false) {
        const hash = await bcrypt.hash(contraseña, 10);
        return basePrisma.usuario.create({
          data: {
            email,
            nombre,
            contraseña: hash,
            admin
          }
        });
      },

      // Autentificar: comprueba email + contraseña, devuelve el usuario o lanza error
      async autentifica(email: string, contraseña: string) {
        const usuario = await basePrisma.usuario.findUnique({
          where: { email }
        });

        if (!usuario) {
          throw new Error(`Usuario con email '${email}' no encontrado`);
        }

        const coincide = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!coincide) {
          throw new Error('Contraseña incorrecta');
        }

        return usuario;
      }
    }
  }
});

// 4. export global prisma api
export default prisma;
