import express from "express";
import prisma from "../prisma/prisma.client.ts";
import logger from "../logger.ts";
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    carrito: Array<{id: number, cantidad: number}>;
    total_carrito: number;
  }
}

const router = express.Router();

// Función auxiliar para construir query de productos con paginación, orden y búsqueda
async function obtenerProductos(opciones: {
    busqueda?: string,
    orden?: string,
    pagina?: number,
    porPagina?: number,
}) {
    const { busqueda, orden = '', pagina = 1, porPagina = 24 } = opciones;

    // Construir WHERE según búsqueda
    const where = busqueda ? {
        OR: [
            { titulo: { contains: busqueda, mode: 'insensitive' as const } },
            { descripcion: { contains: busqueda, mode: 'insensitive' as const } }
        ]
    } : {};

    // Construir ORDER BY según el filtro seleccionado
    let orderBy: any = {};
    switch (orden) {
        case 'nombre_asc':  orderBy = { titulo: 'asc' }; break;
        case 'nombre_desc': orderBy = { titulo: 'desc' }; break;
        case 'precio_asc':  orderBy = { precio: 'asc' }; break;
        case 'precio_desc': orderBy = { precio: 'desc' }; break;
        default:            orderBy = { id: 'asc' }; break;
    }

    // Contar el total de productos que coinciden con la búsqueda
    const totalProductos = await prisma.producto.count({ where });
    const totalPaginas = porPagina > 0 ? Math.ceil(totalProductos / porPagina) : 1;
    const skip = porPagina > 0 ? (pagina - 1) * porPagina : 0;

    // Consulta de datos
    const cards = await prisma.producto.findMany({
        where,
        orderBy,
        skip,
        take: porPagina > 0 ? porPagina : undefined, // si porPagina=0 => todos
    });

    return { cards, totalProductos, totalPaginas, pagina, porPagina };
}

// 1. PORTADA: Muestra productos con paginación, orden y filtro
router.get('/', async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina as string) || 1;
        const porPagina = req.query.porPagina !== undefined ? parseInt(req.query.porPagina as string) : 24;
        const orden = (req.query.orden as string) || '';
        const vista = (req.query.vista as string) || 'grid';

        const resultado = await obtenerProductos({ pagina, porPagina, orden });

        res.render('portada.njk', {
            ...resultado,
            orden,
            vista
        });

    } catch (error: any) {
        logger.error(`Error en portada: ${error.message}`);
        res.status(500).send(`Error: ${error.message}`);
    }
});

// 2. BÚSQUEDAS: /buscar?busqueda=...&pagina=1&porPagina=24&orden=...&vista=...
router.get('/buscar', async (req, res) => {
    try {
        const busqueda = req.query.busqueda as string;
        if (!busqueda) return res.redirect('/');

        const pagina = parseInt(req.query.pagina as string) || 1;
        const porPagina = req.query.porPagina !== undefined ? parseInt(req.query.porPagina as string) : 24;
        const orden = (req.query.orden as string) || '';
        const vista = (req.query.vista as string) || 'grid';

        const resultado = await obtenerProductos({ busqueda, pagina, porPagina, orden });

        res.render('portada.njk', {
            ...resultado,
            busqueda,
            orden,
            vista,
            tituloPagina: `Resultados para "${busqueda}"`
        });

    } catch (error: any) {
        logger.error(`Error en /buscar: ${error.message}`);
        res.status(500).send(`Error de búsqueda: ${error.message}`);
    }
});

// 3. DETALLE DEL PRODUCTO (/producto/:id)
router.get('/producto/:id', async (req, res) => {
    try {
        const productoId = parseInt(req.params.id);

        if (isNaN(productoId)) {
            return res.status(400).send("ID de producto inválido");
        }

        const producto = await prisma.producto.findUnique({
            where: { id: productoId }
        });

        if (!producto) {
            return res.status(404).render('base.njk', { ErrorMensaje: "Producto no encontrado en la tienda." });
        }

        res.render('detalle.njk', { producto });

    } catch (error: any) {
        logger.error(`Error en detalle de producto: ${error.message}`);
        res.status(500).send(`Error cargando producto: ${error.message}`);
    }
});

// API ad hoc del carrito: obtener items con datos del producto
router.get('/api/carrito', async (req, res) => {
    const carrito = req.session.carrito || [];
    let total_precio = 0;

    // Enriquecer cada item con los datos del producto
    const items = await Promise.all(
        carrito.map(async (item: { id: number; cantidad: number }, index: number) => {
            const producto = await prisma.producto.findUnique({ where: { id: item.id } });
            const precio = producto?.precio ? Number(producto.precio) : 0;
            const subtotal = precio * item.cantidad;
            total_precio += subtotal;

            return {
                index,
                id: item.id,
                cantidad: item.cantidad,
                titulo: producto?.titulo || 'Producto no encontrado',
                precio: precio,
                subtotal: subtotal,
                imagen: producto?.imagen || ''
            };
        })
    );

    const total_carrito = req.session.total_carrito || 0;
    res.json({ items, total_carrito, total_precio });
});

// API ad hoc: eliminar un item del carrito por index
router.delete('/api/carrito/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const carrito = req.session.carrito || [];

    if (index < 0 || index >= carrito.length) {
        return res.status(400).json({ error: 'Índice inválido' });
    }

    carrito.splice(index, 1);
    req.session.carrito = carrito;

    const total_carrito = carrito.reduce((s: number, i: { id: number; cantidad: number }) => s + i.cantidad, 0);
    req.session.total_carrito = total_carrito;

    logger.debug(`Carrito: eliminado item index=${index}, total=${total_carrito}`);
    res.json({ mensaje: 'Eliminado', total_carrito });
});

// API ad hoc: actualizar cantidad de un item del carrito
router.put('/api/carrito/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const delta = parseInt(req.body.delta) || 0;
    const carrito = req.session.carrito || [];

    if (index < 0 || index >= carrito.length) {
        return res.status(400).json({ error: 'Índice inválido' });
    }

    carrito[index].cantidad += delta;

    // Si la cantidad llega a 0, lo eliminamos
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    req.session.carrito = carrito;

    const total_carrito = carrito.reduce((s: number, i: { id: number; cantidad: number }) => s + i.cantidad, 0);
    req.session.total_carrito = total_carrito;

    res.json({ mensaje: 'Cantidad actualizada', total_carrito });
});

// API ad hoc: tramitar pedido (vaciar carrito)
router.post('/api/carrito/checkout', (req, res) => {
    req.session.carrito = [];
    req.session.total_carrito = 0;
    res.locals.total_carrito = 0;
    logger.debug('Pedido tramitado, carrito vaciado');
    res.json({ mensaje: 'Pedido tramitado con éxito' });
});

// Carrito POST (desde el formulario de detalle)
router.post('/al-carrito/:id', async (req, res) => {
    const id = Number(req.params.id);
    const cantidad = Number(req.body.cantidad);
    logger.debug(`Al carrito de ${id} ${cantidad} unidad(es)`);

    if (cantidad > 0) {
        if (req.session.carrito) {
            // Buscar si ya existe el producto en el carrito
            const existente = req.session.carrito.find(item => item.id === id);
            if (existente) {
                existente.cantidad += cantidad; // Agrupar
            } else {
                req.session.carrito.push({ id, cantidad });
            }
        } else {
            req.session.carrito = [{ id, cantidad }];
        }

        const total_carrito = req.session.carrito.reduce((suma: number, item: { id: number; cantidad: number }) => suma + item.cantidad, 0);
        res.locals.total_carrito = total_carrito;
        req.session.total_carrito = total_carrito;
        logger.debug(`Total carrito actualizado: ${res.locals.total_carrito}`);
    }

    res.redirect(`/producto/${id}`);
});

export default router;
