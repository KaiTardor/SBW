import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

// Función para recrear el nombre de la imagen desde el título
const nombre_archivo_desde = (titulo) => titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';

// Función auxiliar para crear pausas que simulan el comportamiento humano
const esperar = (mili_segundos) => new Promise(resolve => setTimeout(resolve, mili_segundos));

async function main() {
    // headless: true => no abre el navegador visiblemente, es más rápido.
    const browser = await chromium.launch({ headless: true });

    // Simular un navegador de escritorio (contexto)
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    try {
        console.log('Cargando la página de la tienda...');
        await page.goto('https://tiendaprado.com/es/385-impresiones?resultsPerPage=999', { timeout: 60000 });
    } catch (error) {
        console.error("Error al cargar la página:", error);
        process.exit(1);
    }

    console.log('Página cargada. Esperando 3 segundos...');
    await page.waitForTimeout(3000);

    // Aquí usamos los locators
    const locators_paginas = page.locator('.thumbnail-container > a');
    const lista_paginas = [];

    for (const loc of await locators_paginas.all()) {
        const pagina = await loc.getAttribute('href');
        if (pagina) lista_paginas.push(pagina);
    }

    console.log(`Se han encontrado ${lista_paginas.length} productos. Comenzando el scraping en breve...`);

    // Crear la carpeta "imagenes" si no existe
    await fs.mkdir('imagenes', { recursive: true });

    const productos = [];

    // Recorrer cada página obtenida
    for (let i = 0; i < lista_paginas.length; i++) {
        const url = lista_paginas[i];
        console.log(`[${i + 1}/${lista_paginas.length}] Extrayendo: ${url}`);

        const productPage = await context.newPage();
        try {
            await productPage.goto(url, { timeout: 60000 });
            await productPage.waitForTimeout(1500); // Pausa para que el DOM se asiente en la página del producto

            // 1. Título
            const tituloLocator = productPage.locator('h1');
            const titulo = await tituloLocator.first().innerText();

            // 2. Descripción (generalmente .product-description, #description o similar en Prestashop)
            const descLocator = productPage.locator('.product-description, #description, [itemprop="description"]');
            let descripcion = '';
            if (await descLocator.count() > 0) {
                descripcion = await descLocator.first().innerText();
            }

            // 3. Precio (.current-price o .product-price)
            const priceLocator = productPage.locator('.current-price span, [itemprop="price"]');
            let precio = '';
            if (await priceLocator.count() > 0) {
                precio = await priceLocator.first().innerText();
            }

            // 4. Imagen principal 
            // Las tiendas creadas con Prestashop como del Prado suelen usar una de estas clases:
            const imgLocator = productPage.locator('.js-qv-product-cover, #bigpic, .product-cover img');
            let imgUrl = null;
            if (await imgLocator.count() > 0) {
                imgUrl = await imgLocator.first().getAttribute('src');
            } else {
                imgUrl = await productPage.locator('img').first().getAttribute('src').catch(() => null);
            }

            const imagen_nombre = nombre_archivo_desde(titulo);

            // 5. Descargar la imagen
            if (imgUrl) {
                // Manejar tanto URLs absolutas como relativas por seguridad
                const absoluteImgUrl = imgUrl.startsWith('http') ? imgUrl : `https://tiendaprado.com${imgUrl}`;
                const res = await productPage.request.get(absoluteImgUrl);
                const buffer = await res.body();
                await fs.writeFile(path.join('imagenes', imagen_nombre), buffer);
            }

            // Guardar en nuestro arreglo de datos
            productos.push({
                "título": titulo,
                "descripción": descripcion.trim(),
                "texto_precio": precio.trim(),
                "imagen": imagen_nombre
            });

        } catch (err) {
            console.error(`Error al extraer datos de ${url}:`, err.message);
        } finally {
            await productPage.close();
            // Pausa simulando tiempo humano antes de ir a por la siguiente
            await esperar(1000);
        }
    }

    // Guardar los resultados en productos.json
    await fs.writeFile('productos.json', JSON.stringify(productos, null, 2), 'utf-8');
    console.log('¡Proceso de Web Scraping completado con éxito! Se han guardado todas las imágenes y el archivo productos.json.');

    await browser.close();
}

main();
