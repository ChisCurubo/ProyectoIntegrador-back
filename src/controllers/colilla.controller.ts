import { Request, Response } from 'express';
import { generateElectronicPayStub } from '../services/colilla.service';
import { BadRequestError, InternalServerError } from '../middlewares/customErrors';

export const generatePayStub = async (req: Request, res: Response) => {
    try {
        const { paciente, cc, telefono, cargo, salario, services, quantities } = req.body;

        // Verificación de los datos requeridos
        if (!paciente || !cc || !telefono || !cargo || !salario || !services || !quantities) {
            throw new BadRequestError('Faltan datos obligatorios para generar la colilla de pago');
        }

        const empleadoData = { paciente, cc, telefono, cargo, salario };
        
        const pdfBuffer = await generateElectronicPayStub(empleadoData, services, quantities);

        // Configurar los encabezados de la respuesta para la descarga del PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=colilla_pago.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generando la colilla de pago:', error);

        if (error instanceof BadRequestError) {
            return res.status(400).json({ success: false, message: error.message });
        } else {
            return res.status(500).json({ success: false, message: 'Error generando la colilla de pago' });
        }
    }
};
