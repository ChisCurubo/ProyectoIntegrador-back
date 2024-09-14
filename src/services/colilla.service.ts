import { buildPDF } from '../libs/Facturacion/colilla';

export async function generarColillaElectronica(
    empleadoData: any, // Cambié `pacienteData` a `empleadoData`
    services: string[],
    quantities: number[]
): Promise<Buffer> {
    try {
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];

            // Llamamos a `buildPDF` y manejamos el flujo de datos dentro de él
            buildPDF(
                (chunk) => chunks.push(chunk), // Se almacenan los datos del PDF en `chunks`
                () => resolve(Buffer.concat(chunks)), // Al finalizar, concatenamos y resolvemos la promesa
                empleadoData, services, quantities
            );

            // No necesitas el `.on('error')` ya que no hay un stream devuelto directamente.
        });
    } catch (error) {
        console.error('Error generando la colilla:', error);
        throw new Error('Error generando la colilla de pago');
    }
}
