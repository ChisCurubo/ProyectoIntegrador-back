import { Request, Response } from 'express';
import PacientesService from '../services/pacientes.service';
import { NotFoundError, InternalServerError } from '../middlewares/customErrors';

class PacientesController {
  // Obtener Pacientes que Atenderá el Doctor
  public static async pacientesQueAtendera(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor } = req.params;
      const pacientes = await PacientesService.pacientesQueAtendera(idDoctor);

      if (!pacientes || pacientes.length === 0) {
        throw new NotFoundError('No se encontraron pacientes para el doctor indicado.');
      }

      res.status(200).json(pacientes);
    } catch (error) {
      console.error('Error al obtener pacientes que atenderá el doctor:', error);

      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ mensaje: error.message });
      } else {
        res.status(500).json({ mensaje: 'Error al obtener pacientes que atenderá el doctor' });
      }
    }
  }
}

export default PacientesController;
