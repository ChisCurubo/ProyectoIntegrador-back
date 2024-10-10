import { InternalServerError, BadRequestError } from '../middlewares/customErrors';
import { generarFacturaelectronica as generarPDF } from '../libs/Facturacion/factura';
import pool from '../providers/database';  

// Exportación de la interfaz Service
export interface Service {
    precioServicio: number;  // Precio del servicio
    nombreServicio: string;   // Nombre del servicio
}

// Función para generar la factura electrónica en PDF
export async function generarteElectronicBill(
    pacienteData: any,
    services: Service[], // Tipo Service
    quantities: number[]
): Promise<Buffer> {
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

export const saveBillToDB = async (
    idCita: number,
    direccionUsuario: string,
    telefonoUsuario: string,
    formaPago: string,
    item: string,
    descripcion: string,
    cantidad: number,
    valor: number,
    valorTotal: number,
    valorLetras: string,
    estadoFE: number
) => {
    try {
        const query = `
            INSERT INTO FACTURA_ELECTRONICA (
                idCita,
                estadoFE,
                direccion,
                telefono,
                formaPago,
                direccionUsuario,
                telefonoUsuario,
                item,
                descripccion,
                cantidad,
                valor,
                valorTotal,
                valorLetras
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Aquí se colocan valores de ejemplo para dirección y teléfono si es necesario
        const direccionPorDefecto = 'D'; // Cambia esto si tienes una dirección predeterminada
        const telefonoPorDefecto = 'T'; // Cambia esto si tienes un teléfono predeterminado

        await pool.query(query, [
            idCita,
            estadoFE,
            direccionPorDefecto, // Usa dirección predeterminada o una que tú tengas
            telefonoPorDefecto, // Usa teléfono predeterminado o uno que tú tengas
            formaPago,
            direccionUsuario,
            telefonoUsuario,
            item,
            descripcion,
            cantidad,
            valor,
            valorTotal,
            valorLetras
        ]);
    } catch (error) {
        console.error('Error guardando la factura en la base de datos:', error);
        throw new InternalServerError('Error al guardar la factura en la base de datos.');
    }
};