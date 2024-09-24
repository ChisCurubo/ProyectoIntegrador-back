import { Request, Response } from 'express';
import PacientesService from '../services/pacientes.service';

class PacientesController {
  // Obtener Pacientes que Atenderá el Doctor
  public static async pacientesQueAtendera(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor } = req.params;
      const pacientes = await PacientesService.pacientesQueAtendera(idDoctor);
      res.status(200).json(pacientes);
    } catch (error) {
      console.error('Error al obtener pacientes que atenderá el doctor:', error);
      res.status(500).json({ mensaje: 'Error al obtener pacientes que atenderá el doctor' });
    }
  }
}

export default PacientesController;
