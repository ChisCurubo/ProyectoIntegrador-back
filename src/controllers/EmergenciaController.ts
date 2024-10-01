import { Request, Response, NextFunction } from 'express';
import EmergenciaService from '../services/emergencia.service';
import { BadRequestError, NotFoundError, InternalServerError } from '../middlewares/customErrors';
import { EmergenciaCita } from '../Interfaces/EmergenciaCita';

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
    public async updateEstadoEmergencia(req: Request, res: Response, next: NextFunction): Promise<void> {
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
    public async getEmergenciasPrioridad(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const emergencias = await EmergenciaService.getEmergenciasPorPrioridad();
            res.status(200).json(emergencias);
        } catch (error) {
            next(new InternalServerError('Error al obtener emergencias por prioridad'));
        }
    };


    // Crear una nueva emergencia cita
    public async createEmergenciaCita(req: Request, res: Response, next: NextFunction) {
        try {
            // Asignar el cuerpo de la solicitud a una variable
            const emergenciaCitaData: EmergenciaCita = req.body;

            // Llamar al servicio con los datos del cuerpo
            const result = await EmergenciaService.createEmergenciaCita(emergenciaCitaData);
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof BadRequestError) {
                return next(new BadRequestError("Invalid data provided for creating emergencia cita"));
            }
            return next(new InternalServerError("Error creating emergencia cita"));
        }
    }

    // Obtener todas las emergencias citas
    public async findAllEmergenciaCita(req: Request, res: Response, next: NextFunction) {
        try {
            // Llamar al servicio para obtener todas las emergencias citas
            const result = await EmergenciaService.getAllEmergenciasCitas();
            res.json(result);
        } catch (error) {
            return next(new InternalServerError("Error fetching emergencias citas"));
        }
    }

    // Obtener una emergencia cita por ID
    public async findOneEmergenciaCita(req: Request, res: Response, next: NextFunction) {
        try {
            // Extraer el parámetro `id` y convertirlo a número
            const idEmergenciaCita: number = Number(req.params.id);

            // Llamar al servicio para obtener la emergencia cita por ID
            const result = await EmergenciaService.getEmergenciaCitaById(idEmergenciaCita);
            if (!result) {
                throw new NotFoundError("Emergencia cita not found");
            }
            res.json(result);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return next(error);
            }
            return next(new InternalServerError("Error fetching emergencia cita"));
        }
    }

    // Actualizar una emergencia cita por ID
    public async updateEmergenciaCita(req: Request, res: Response, next: NextFunction) {
        try {
            // Extraer el parámetro `id` y convertirlo a número
            const idEmergenciaCita: number = Number(req.params.id);

            // Asignar el cuerpo de la solicitud a una variable
            const emergenciaCitaData: EmergenciaCita = req.body;

            // Llamar al servicio para actualizar la emergencia cita
            const result = await EmergenciaService.updateEmergenciaCita(idEmergenciaCita, emergenciaCitaData);
            if (!result) {
                throw new NotFoundError("Emergencia cita not found");
            }
            res.json(result);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return next(error);
            }
            return next(new InternalServerError("Error updating emergencia cita"));
        }
    }

    // Eliminar una emergencia cita por ID
    public async deleteEmergenciaCita(req: Request, res: Response, next: NextFunction) {
        try {
            // Extraer el parámetro `id` y convertirlo a número
            const idEmergenciaCita: number = Number(req.params.id);

            // Llamar al servicio para eliminar la emergencia cita
            const result = await EmergenciaService.deleteEmergenciaCita(idEmergenciaCita);
            if (!result) {
                throw new NotFoundError("Emergencia cita not found");
            }
            res.status(204).send();
        } catch (error) {
            if (error instanceof NotFoundError) {
                return next(error);
            }
            return next(new InternalServerError("Error deleting emergencia cita"));
        }
    }
}



export default new EmergenciaController();
