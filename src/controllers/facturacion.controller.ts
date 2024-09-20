import { Request, Response } from 'express';
import {generarFacturaelectronica} from '../services/facturacion.service';

export const generarFactura = async (req: Request, res: Response) => {
    try {
        const { paciente, cc, telefono, ciudad, direccion, services, quantities } = req.body;

        const pacienteData = { paciente, cc, telefono, ciudad, direccion };
        const pdfBuffer = await generarFacturaelectronica(pacienteData, services, quantities);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generando la factura:', error);
        res.status(500).json({ success: false, message: 'Error generando la factura' });
    }
};

