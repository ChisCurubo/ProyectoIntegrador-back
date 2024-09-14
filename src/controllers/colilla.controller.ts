import { Request, Response } from 'express';
import { generarColillaElectronica } from '../services/colilla.service';

export const generarColilla = async (req: Request, res: Response) => {
    try {
        const { paciente, cc, telefono, cargo, salario, services, quantities } = req.body;

        const empleadoData = { paciente, cc, telefono, cargo, salario };
        
        const pdfBuffer = await generarColillaElectronica(empleadoData, services, quantities);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=colilla_pago.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generando la colilla de pago:', error);
        res.status(500).json({ success: false, message: 'Error generando la colilla de pago' });
    }
};
