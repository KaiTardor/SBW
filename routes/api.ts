import express from "express";
import prisma from "../prisma/prisma.client.ts";
import logger from "../logger.ts";

const router = express.Router();

// GET /api/productos/random — Un producto aleatorio (debe ir antes del /:id para no confundirse)
router.get('/api/productos/random', async (req, res) => {
    try {
        const count = await prisma.producto.count();
        if (count === 0) {
            return res.status(404).json({ error: "No hay productos disponibles" });
        }
        const skip = Math.floor(Math.random() * count);
        const producto = await prisma.producto.findFirst({ skip });

        // Si la url de la imagen no es absoluta, le añadimos la url del backend para el SPA
        if (producto && producto.imagen && !producto.imagen.startsWith('http')) {
            producto.imagen = `http://localhost:3000/public/imagenes/${producto.imagen.trim()}`;
        }

        logger.debug(`API: GET /api/productos/random -> ID ${producto?.id}`);
        res.json(producto);
    } catch (error: any) {
        logger.error(`API error GET /api/productos/random: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/productos — Todos los productos con paginación y ordenación
router.get('/api/productos', async (req, res) => {
    try {
        const desde = parseInt(req.query.desde as string) || 1;
        const hasta = parseInt(req.query.hasta as string) || 20;
        const ordenacion = (req.query.ordenacion as string) || 'ascendente';

        const take = hasta - desde + 1;
        const skip = desde - 1;

        const orderBy = ordenacion === 'descendente'
            ? { id: 'desc' as const }
            : { id: 'asc' as const };

        const productos = await prisma.producto.findMany({
            skip,
            take,
            orderBy
        });

        const total = await prisma.producto.count();

        logger.debug(`API: GET /api/productos desde=${desde} hasta=${hasta} ordenacion=${ordenacion}`);

        res.json({
            total,
            desde,
            hasta: Math.min(hasta, total),
            ordenacion,
            productos
        });

    } catch (error: any) {
        logger.error(`API error GET /api/productos: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/productos/:id — Un producto por ID
router.get('/api/productos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const producto = await prisma.producto.findUnique({ where: { id } });

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        logger.debug(`API: GET /api/productos/${id}`);
        res.json(producto);

    } catch (error: any) {
        logger.error(`API error GET /api/productos/${req.params.id}: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/productos — Añadir un producto nuevo
router.post('/api/productos', async (req, res) => {
    try {
        const { titulo, descripcion, precio, imagen } = req.body;

        if (!titulo || !descripcion || precio === undefined || !imagen) {
            return res.status(400).json({ error: "Faltan campos obligatorios: titulo, descripcion, precio, imagen" });
        }

        const producto = await prisma.producto.create({
            data: {
                titulo,
                descripcion,
                precio: parseFloat(precio),
                imagen
            }
        });

        logger.info(`API: POST /api/productos -> creado ID ${producto.id}`);
        res.status(201).json(producto);

    } catch (error: any) {
        logger.error(`API error POST /api/productos: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/productos/:id — Modificar un producto existente
router.put('/api/productos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const { titulo, descripcion, precio } = req.body;

        // Solo actualizamos los campos que vengan en el body
        const data: any = {};
        if (titulo !== undefined) data.titulo = titulo;
        if (descripcion !== undefined) data.descripcion = descripcion;
        if (precio !== undefined) data.precio = parseFloat(precio);

        const producto = await prisma.producto.update({
            where: { id },
            data
        });

        logger.info(`API: PUT /api/productos/${id}`);
        res.json(producto);

    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        logger.error(`API error PUT /api/productos/${req.params.id}: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/productos/:id — Eliminar un producto
router.delete('/api/productos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const producto = await prisma.producto.delete({ where: { id } });

        logger.info(`API: DELETE /api/productos/${id}`);
        res.json({ mensaje: "Producto eliminado", producto });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        logger.error(`API error DELETE /api/productos/${req.params.id}: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

export default router;
