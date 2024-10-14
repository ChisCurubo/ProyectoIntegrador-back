import { Request, Response } from 'express';
import MercadoPagoServices from '../services/CrudFrontMercadopago.service';
import { MercadopagoFront } from '../interface/colillaPago';

class MercadopagoFrontController {
    // Obtener colillas de pago por cédula de paciente
public async getColillaPorCC(req: Request, res: Response): Promise<void> {
    const cc = req.params.cc; // Asumimos que la cédula se pasa como parámetro en la URL
    try {
        const colillas: MercadopagoFront[] = await MercadoPagoServices.getColillaPorCC(cc);
        res.status(200).json(colillas);
    } catch (error: unknown) {
        console.error('Error en getColillaPorCC:', error);
        // Aquí asumimos que error puede ser un objeto que contiene la propiedad message
        const message = (error instanceof Error) ? error.message : 'Error desconocido';
        res.status(500).json({ message });
    }
}

// Obtener colillas de pago por ID de colilla
public async getColillaPorId(req: Request, res: Response): Promise<void> {
    const idColilla = parseInt(req.params.idColilla); // Asumimos que el ID se pasa como parámetro en la URL
    try {
        const colillas: MercadopagoFront[] = await MercadoPagoServices.getColillaPorId(idColilla);
        if (colillas.length > 0) {
            res.status(200).json(colillas);
        } else {
            res.status(404).json({ message: 'Colilla no encontrada' });
        }
    } catch (error: unknown) {
        console.error('Error en getColillaPorId:', error);
        const message = (error instanceof Error) ? error.message : 'Error desconocido';
        res.status(500).json({ message });
    }
}


public async updateColillaPagoEstado(req: Request, res: Response): Promise<void> {
    const { idColilla } = req.params; // Obtener el ID de colilla de los parámetros de la solicitud

    try {
        await MercadoPagoServices.updateColillaPagoEstado(Number(idColilla)); // Llamar al servicio para actualizar el estado
        res.status(200).json({ message: 'Estado de la colilla de pago actualizado exitosamente.' });
    } catch (error) {
        // Afirmación de tipo para manejar el error
        const errorMessage = (error as Error).message || 'Error desconocido al actualizar el estado de la colilla de pago';
        console.error('Error al actualizar el estado de la colilla de pago:', errorMessage);
        res.status(500).json({ error: errorMessage });
    }
}


}

// Exportar una instancia de la clase MercadopagoFrontController
export default new MercadopagoFrontController();
