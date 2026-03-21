import prisma from "./prisma/prisma.client.ts";
import fs from 'fs/promises';

type Producto = {
    título: string;
    descripción: string;
    texto_precio: string;
    imagen: string;
};

type Productos = Producto[];

async function main() {
    try {
        // Leer el archivo de forma nativa
        const data = await fs.readFile('./productos.json', 'utf-8');
        const productos: Productos = JSON.parse(data);

        await Guardar_en_DB(productos);

        // Hacer alguna consulta para comprobar como:
        // productos cuya descripción empiece por 'lámina' ordenados por precio
        console.log("-----------------------------------------");
        console.log("Consulta de prueba: Productos que contengan 'lámina' (o 'Lámina') en su descripción ordenados por precio:");

        const prueba = await prisma.producto.findMany({
            where: {
                descripcion: {
                    contains: 'lámina',
                    mode: 'insensitive' // Busca mayúsculas y minúsculas
                }
            },
            orderBy: {
                precio: 'asc'
            }
        });

        console.log(`Se encontraron ${prueba.length} productos con esa característica.`);
        console.log(prueba.slice(0, 3)); // Mostrar los 3 primeros

    } catch (error) {
        console.error("Error al ejecutar el script:", error);
    } finally {
        await prisma.$disconnect();
    }
}

async function Guardar_en_DB(productos: Productos): Promise<void> {
    console.log(`Iniciando el guardado de ${productos.length} productos en la Base de Datos...`);

    for (const producto of productos) {
        const titulo = producto.título;
        const descripcion = producto.descripción;
        const imagen = producto.imagen;
        // Extraemos solo el número: quitamos " €" y cambiamos la coma por punto
        // Usamos una expresión regular para limpiar cualquier caracter que no sea número, coma o punto
        const precioLimpio = producto.texto_precio.replace(/[^0-9,.]/g, '').replace(",", ".");
        const precioNumerico = Number(precioLimpio);

        // Validar si el precio es NaN
        if (isNaN(precioNumerico)) {
            console.log(`[Omitiendo] El producto "${titulo}" tiene un precio inválido: '${producto.texto_precio}' -> quedó como: '${precioLimpio}'`);
            continue;
        }

        try {
            const prod = await prisma.producto.create({
                data: {
                    titulo: titulo.substring(0, 127), // Evita fallos si supera el db.Char(127) de postgres
                    descripcion: descripcion,
                    imagen: imagen.substring(0, 127),
                    precio: precioNumerico
                }
            });
            console.log(`Creado (ID: ${prod.id}): ${prod.titulo}`);
        } catch (error: any) {
            console.error(`Error guardando "${titulo}": ${error.message}`);
        }
    } // end-for

    console.log("Guardado completado.");
} // end-function

main();
