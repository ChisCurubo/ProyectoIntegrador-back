// controllers/OrdenMedicaController.ts

import { Request, Response } from 'express';
import OrdenMedicaService from '../services/ordenMedica.service';

class OrdenMedicaController {
    private ordenMedicaService: OrdenMedicaService;

    constructor() {
        this.ordenMedicaService = new OrdenMedicaService();
    }

    // Crear una Orden Médica
    public createOrdenMedica = async (req: Request, res: Response): Promise<void> => {
        try {
            const nuevaOrden = await this.ordenMedicaService.createOrdenMedica(req.body);
            res.status(201).json(nuevaOrden);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    };

    // Obtener una Orden Médica por ID
    public getOrdenMedica = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const ordenMedica = await this.ordenMedicaService.getOrdenMedica(id);
            if (ordenMedica) {
                res.status(200).json(ordenMedica);
            } else {
                res.status(404).json({ message: 'Orden Médica no encontrada' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    };

    // Actualizar una Orden Médica por ID
    public updateOrdenMedica = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const ordenActualizada = await this.ordenMedicaService.updateOrdenMedica(id, req.body);
            if (ordenActualizada) {
                res.status(200).json(ordenActualizada);
            } else {
                res.status(404).json({ message: 'Orden Médica no encontrada' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    };
}

export default OrdenMedicaController;
