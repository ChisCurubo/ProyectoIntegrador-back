import { Request, Response } from 'express';
import EmergenciaService from '../services/emergencia.service';

class EmergenciaController {
    private emergenciaService: EmergenciaService;

    constructor() {
        this.emergenciaService = new EmergenciaService();
    }

    // Crear una nueva emergencia
    public createEmergencia = async (req: Request, res: Response): Promise<void> => {
        try {
            const nuevaEmergencia = await this.emergenciaService.createEmergencia(req.body);
            res.status(201).json(nuevaEmergencia);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    };

    // Obtener una emergencia por ID
    public getEmergencia = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const emergencia = await this.emergenciaService.getEmergenciaById(Number(id));
            if (emergencia) {
                res.status(200).json(emergencia);
            } else {
                res.status(404).json({ message: 'Emergencia no encontrada' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    };

    // Actualizar una emergencia por ID
    public updateEmergencia = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updated = await this.emergenciaService.updateEmergencia(Number(id), req.body);
            if (updated) {
                res.status(200).json({ message: 'Emergencia actualizada' });
            } else {
                res.status(404).json({ message: 'Emergencia no encontrada' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    };

    // Actualizar el estado de una emergencia
    public updateEstadoEmergencia = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { estadoEmergencia } = req.body;
            const updated = await this.emergenciaService.updateEstadoEmergencia(Number(id), estadoEmergencia);
            if (updated) {
                res.status(200).json({ message: 'Estado de la emergencia actualizado' });
            } else {
                res.status(404).json({ message: 'Emergencia no encontrada' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    };

    // Obtener emergencias por prioridad
    public getEmergenciasPrioridad = async (req: Request, res: Response): Promise<void> => {
        try {
            const emergencias = await this.emergenciaService.getEmergenciasPorPrioridad();
            res.status(200).json(emergencias);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    };
}

export default EmergenciaController;
