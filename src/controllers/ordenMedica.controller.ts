import { Request, Response, NextFunction } from 'express';
import OrdenMedicaService from '../services/ordenMedica.service';
import { BadRequestError, NotFoundError, InternalServerError } from '../middlewares/customErrors';

class OrdenMedicaController {
    // Crear una Orden Médica
    public createOrdenMedica = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const nuevaOrden = await OrdenMedicaService.createOrdenMedica(req.body);
            res.status(201).json(nuevaOrden);
        } catch (error) {
            next(new InternalServerError('Error al crear la orden médica'));
        }
    };

    // Obtener una Orden Médica por ID
    public getOrdenMedica = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const ordenMedica = await OrdenMedicaService.getOrdenMedica(id);
            if (ordenMedica) {
                res.status(200).json(ordenMedica);
            } else {
                throw new NotFoundError('Orden Médica no encontrada');
            }
        } catch (error) {
            next(error);
        }
    };

    // Actualizar una Orden Médica por ID
    public updateOrdenMedica = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const ordenActualizada = await OrdenMedicaService.updateOrdenMedica(id, req.body);
            if (ordenActualizada) {
                res.status(200).json(ordenActualizada);
            } else {
                throw new NotFoundError('Orden Médica no encontrada');
            }
        } catch (error) {
            next(error);
        }
    };
}

export default new OrdenMedicaController();
