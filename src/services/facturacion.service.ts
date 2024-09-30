// services/FacturacionService.ts
import { InternalServerError, BadRequestError } from '../middlewares/customErrors';
import { generarFacturaelectronica as generarPDF } from '../libs/Facturacion/factura';

export async function generarteElectronicBill(
    pacienteData: any,
    services: string[],
    quantities: number[]
) {
    try {
        // Validación de los parámetros de entrada
        if (!pacienteData || services.length === 0 || quantities.length === 0) {
            throw new BadRequestError('Datos insuficientes para generar la factura electrónica');
        }

        // Intentar generar el PDF
        const pdfBuffer = await generarPDF(pacienteData, services, quantities);
        return pdfBuffer;
    } catch (error) {
        console.error('Error generando la factura:', error);
        throw new InternalServerError('Error interno generando la factura electrónica');
    }
}
