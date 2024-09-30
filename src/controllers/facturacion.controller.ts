import { Request, Response } from 'express';
import { generarteElectronicBill } from '../services/facturacion.service';
import { BadRequestError, InternalServerError } from '../middlewares/customErrors';

export const generateBill = async (req: Request, res: Response) => {
    try {
        const { paciente, cc, telefono, ciudad, direccion, services, quantities } = req.body;

        // Verificación de los datos requeridos
        if (!paciente || !cc || !telefono || !ciudad || !direccion || !services || !quantities) {
            throw new BadRequestError('Faltan datos obligatorios para generar la factura');
        }

        const pacienteData = { paciente, cc, telefono, ciudad, direccion };
        const pdfBuffer = await generarteElectronicBill(pacienteData, services, quantities);

        // Configurar los encabezados de la respuesta para la descarga del PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generando la factura:', error);

        if (error instanceof BadRequestError) {
            return res.status(400).json({ success: false, message: error.message });
        } else {
            return res.status(500).json({ success: false, message: 'Error generando la factura' });
        }
    }
};
