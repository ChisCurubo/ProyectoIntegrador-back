import { buildPDF } from '../libs/Facturacion/colilla';
import { InternalServerError, BadRequestError } from '../middlewares/customErrors';

export async function generateElectronicPayStub(
    empleadoData: any,
    services: string[],
    quantities: number[]
): Promise<Buffer> {
    try {
        if (!empleadoData || services.length === 0 || quantities.length === 0) {
            throw new BadRequestError('Datos insuficientes para generar la colilla');
        }

        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];

            buildPDF(
                (chunk) => chunks.push(chunk),
                () => resolve(Buffer.concat(chunks)),
                empleadoData, services, quantities
            );
        });
    } catch (error) {
        console.error('Error generando la colilla:', error);
        throw new InternalServerError('Error interno generando la colilla de pago');
    }
}
