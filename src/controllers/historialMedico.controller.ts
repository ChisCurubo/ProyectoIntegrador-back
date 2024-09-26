import { Request, Response } from 'express';
import HistorialClinicoService from '../services/historialMedico.service';
import { BadRequestError, NotFoundError, InternalServerError } from '../middlewares/customErrors';

class HistorialClinicoController {

    // Método para manejar la creación de un historial clínico.
    public createHistorialClinico = async (req: Request, res: Response): Promise<void> => {
        try {
            // Verificar que se proporcionen datos necesarios
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Los datos del historial clínico son obligatorios.');
            }

            // Llama al servicio para crear el historial clínico con los datos del cuerpo de la solicitud.
            const historialClinico = await HistorialClinicoService.createHistorialClinico(req.body);
            // Responde con el estado 201 (Creado) y el historial clínico creado en formato JSON.
            res.status(201).json(historialClinico);
        } catch (error) {
            // Manejo de errores.
            if (error instanceof BadRequestError) {
                res.status(400).json({ message: error.message });
            } else if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    }

    // Método para manejar la obtención de un historial clínico por ID.
    public getHistorialClinico = async (req: Request, res: Response): Promise<void> => {
        try {
            // Obtiene el ID del historial clínico de los parámetros de la solicitud.
            const { id } = req.params;
            // Llama al servicio para obtener el historial clínico correspondiente al ID.
            const historialClinico = await HistorialClinicoService.getHistorialClinico(id);
            if (historialClinico) {
                // Responde con el estado 200 (OK) y el historial clínico en formato JSON.
                res.status(200).json(historialClinico);
            } else {
                // Responde con el estado 404 (No Encontrado) si no se encuentra el historial clínico.
                throw new NotFoundError('Historial clínico no encontrado');
            }
        } catch (error) {
            // Manejo de errores.
            if (error instanceof NotFoundError) {
                res.status(404).json({ message: error.message });
            } else if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    }
}

export default HistorialClinicoController;
