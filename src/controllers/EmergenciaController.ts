import { Request, Response, NextFunction } from 'express';
import EmergenciaService from '../services/emergencia.service';
import { BadRequestError, NotFoundError, InternalServerError } from '../middlewares/customErrors';

class EmergenciaController {
    // Crear una nueva emergencia
    public createEmergencia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const nuevaEmergencia = await EmergenciaService.createEmergencia(req.body);
            res.status(201).json(nuevaEmergencia);
        } catch (error) {
            next(new InternalServerError('Error al crear la emergencia'));
        }
    };

    // Obtener una emergencia por ID
    public getEmergencia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const emergencia = await EmergenciaService.getEmergenciaById(Number(id));
            if (emergencia) {
                res.status(200).json(emergencia);
            } else {
                throw new NotFoundError('Emergencia no encontrada');
            }
        } catch (error) {
            next(error);
        }
    };

    // Actualizar una emergencia por ID
    public updateEmergencia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const updated = await EmergenciaService.updateEmergencia(Number(id), req.body);
            if (updated) {
                res.status(200).json({ message: 'Emergencia actualizada' });
            } else {
                throw new NotFoundError('Emergencia no encontrada');
            }
        } catch (error) {
            next(error);
        }
    };

    // Actualizar el estado de una emergencia
    public updateEstadoEmergencia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { estadoEmergencia } = req.body;
            const updated = await EmergenciaService.updateEstadoEmergencia(Number(id), estadoEmergencia);
            if (updated) {
                res.status(200).json({ message: 'Estado de la emergencia actualizado' });
            } else {
                throw new NotFoundError('Emergencia no encontrada');
            }
        } catch (error) {
            next(error);
        }
    };

    // Obtener emergencias por prioridad
    public getEmergenciasPrioridad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const emergencias = await EmergenciaService.getEmergenciasPorPrioridad();
            res.status(200).json(emergencias);
        } catch (error) {
            next(new InternalServerError('Error al obtener emergencias por prioridad'));
        }
    };
}

export default new EmergenciaController();
