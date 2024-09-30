import { Request, Response } from 'express';
import { testConnection } from '../services/hojaVida.service';
import { InternalServerError } from '../middlewares/customErrors';

export const hojaDeVida = async (req: Request, res: Response) => {
    try {
        const citas = await testConnection();
        console.log('post /hojaVida/test - Response:');
        res.status(200).json(citas);
    } catch (error) {
        console.error('Error en post /hojaVida/citas:', error);
        // Lanzar un error personalizado
        throw new InternalServerError('Error en el servidor al obtener las citas.');
    }
};

export const hojaDeVidaPDF = async (req: Request, res: Response) => {
    try {
        const { nameService } = req.body;
        
        if (!nameService) {
            return res.status(400).json({ message: 'El nombre del servicio es obligatorio.' });
        }

        const serviceData = { nameService };

        // Aquí podrías agregar la lógica para generar un PDF con los datos del servicio.
        // Ejemplo: const pdfBuffer = await generatePDF(serviceData);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'attachment; filename=hoja_de_vida.pdf');
        // res.send(pdfBuffer);

        // Respuesta temporal para mostrar que se ha recibido la solicitud.
        res.status(200).json({ message: 'PDF generado exitosamente', data: serviceData });
    } catch (error) {
        console.error('Error generando PDF de hoja de vida:', error);
        // Lanzar un error personalizado
        throw new InternalServerError('Error en el servidor al generar el PDF.');
    }
};
