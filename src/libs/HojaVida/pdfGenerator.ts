// src/utils/pdfGenerator.ts
import puppeteer, { PDFOptions } from 'puppeteer';
import Handlebars from 'handlebars';

/**
 * Genera un PDF a partir de una plantilla HTML y datos.
 * @param template HTML como string con placeholders de Handlebars.
 * @param data Datos para reemplazar los placeholders.
 * @param options Opciones adicionales para Puppeteer.
 * @returns Buffer del PDF generado.
 */
export const generatePDF = async (
    template: string,
    data: any,
    options: PDFOptions = {}
): Promise<Buffer> => {
    try {
        // Compilar la plantilla con Handlebars
        const compiledTemplate = Handlebars.compile(template);
        const html = compiledTemplate(data);

        // Inicializar Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        // Establecer el contenido HTML
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generar el PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            ...options,
        });

        await browser.close();

        return Buffer.from(pdfBuffer);
    } catch (error) {
        console.error('Error en generatePDF:', error);
        throw error;
    }
};
