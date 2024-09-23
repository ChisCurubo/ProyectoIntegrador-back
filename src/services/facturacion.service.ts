// services/FacturacionService.ts

import { generarFacturaelectronica as generarPDF } from '../libs/Facturacion/factura';

export async function generarteElectronicBill(
    pacienteData: any, // Cambié String a tipo `any` o tipos específicos si es necesario
    services: string[], // Cambié String a tipo `string[]` si es un array de servicios
    quantities: number[] // Cambié Number a tipo `number[]` si es un array de cantidades
) {
    try {
        const pdfBuffer = await generarPDF(pacienteData, services, quantities);
        return pdfBuffer;
    } catch (error) {
        console.error('Error generando la factura:', error);
        throw new Error('Error generando la factura');
    }
}
