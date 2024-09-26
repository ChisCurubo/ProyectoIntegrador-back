import { Request, Response } from 'express';
import DoctorService from '../services/doctor.service'; // Asegúrate de la ruta correcta

class DoctorController {
  // Crear Orden Médica
  public static async crearOrdenMedica(req: Request, res: Response): Promise<void> {
    try {
      const orden = req.body;
      await DoctorService.crearOrdenMedica(orden);
      res.status(201).json({ mensaje: 'Orden médica creada con éxito' });
    } catch (error) {
      console.error('Error al crear orden médica:', error);
      res.status(500).json({ mensaje: 'Error al crear orden médica' });
    }
  }

  // Actualizar una orden médica por ID
  public static async editarOrdenMedicaPorId(req: Request, res: Response): Promise<void> {
    try {
      const { idOrden_Medica } = req.params;
      const orden = req.body;
      await DoctorService.editarOrdenMedica(Number(idOrden_Medica), orden);
      res.status(200).json({ mensaje: 'Orden médica actualizada con éxito' });
    } catch (error) {
      console.error('Error al editar orden médica:', error);
      res.status(500).json({ mensaje: 'Error al editar orden médica' });
    }
  }

  
  // Ver Pacientes que Atenderá
  public static async verPacientesQueAtendera(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor } = req.params;
      const pacientes = await DoctorService.verPacientesQueAtendera(idDoctor);
      res.status(200).json(pacientes);
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      res.status(500).json({ mensaje: 'Error al obtener pacientes' });
    }
  }
      // Pacientes asignados al Doctor
  public static async pacientesAsignadosAlDoctor(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor } = req.params;
      const pacientes = await DoctorService.pacientesAsignadosAlDoctor(idDoctor);
      res.status(200).json(pacientes);
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      res.status(500).json({ mensaje: 'Error al obtener pacientes' });
    }
  }

  // Obtener una orden médica por ID de Cita
  public static async obtenerOrdenMedicaPorIdCita(req: Request, res: Response): Promise<void> {
    try {
      const { idCita } = req.params;
      const orden = await DoctorService.obtenerOrdenMedicaPorIdCita(Number(idCita));
      if (orden) {
        res.status(200).json(orden);
      } else {
        res.status(404).json({ mensaje: 'Orden médica no encontrada' });
      }
    } catch (error) {
      console.error('Error al obtener orden médica por ID de cita:', error);
      res.status(500).json({ mensaje: 'Error al obtener orden médica' });
    }
  }
}

export default DoctorController;
