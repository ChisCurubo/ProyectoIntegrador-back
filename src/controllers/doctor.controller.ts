import { Request, Response } from 'express';
import DoctorService from '../services/doctor.service'; // Asegúrate de la ruta correcta
import {BadRequestError, NotFoundError, InternalServerError,DatabaseError} from '../middlewares/customErrors';

class DoctorController {

   // Encolar Paciente
   public static async encolarPaciente(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor, paciente, prioridad } = req.body;
      if (!paciente || prioridad === undefined) {
        throw new BadRequestError('Paciente y prioridad son requeridos.');
      }
      await DoctorService.encolarPaciente(idDoctor, paciente, prioridad);
      res.status(201).json({ mensaje: 'Paciente encolado con éxito' });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al encolar paciente');
      } else {
        console.error('Error al encolar paciente:', error);
        throw new InternalServerError('Error al encolar paciente');
      }
    }
  }

  // Obtener Siguiente Paciente
  public static async obtenerPacientePrioritario(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor } = req.params;
      const paciente = await DoctorService.obtenerPacientePrioritario(idDoctor);
      if (!paciente) {
        throw new NotFoundError('No hay pacientes en la cola');
      }
      res.status(200).json(paciente);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al obtener paciente prioritario');
      } else {
        console.error('Error al obtener paciente prioritario:', error);
        throw new InternalServerError('Error al obtener paciente prioritario');
      }
    }
  }
  
  // Crear Orden Médica
  public static async crearOrdenMedica(req: Request, res: Response): Promise<void> {
    try {
      const orden = req.body;
      if (!orden) {
        throw new BadRequestError('Los datos de la orden médica son obligatorios.');
      }
      await DoctorService.crearOrdenMedica(orden);
      res.status(201).json({ mensaje: 'Orden médica creada con éxito' });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al crear la orden médica en la base de datos');
      } else {
        console.error('Error al crear orden médica:', error);
        throw new InternalServerError('Error al crear orden médica');
      }
    }
  }

  // Actualizar una orden médica por ID
  public static async editarOrdenMedicaPorId(req: Request, res: Response): Promise<void> {
    try {
      const { idOrden_Medica } = req.params;
      const orden = req.body;
      if (!orden) {
        throw new BadRequestError('Los datos de la orden médica son obligatorios.');
      }
      await DoctorService.editarOrdenMedica(Number(idOrden_Medica), orden);
      res.status(200).json({ mensaje: 'Orden médica actualizada con éxito' });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al editar la orden médica en la base de datos');
      } else {
        console.error('Error al editar orden médica:', error);
        throw new InternalServerError('Error al editar orden médica');
      }
    }
  }

  // Ver Pacientes que Atenderá
  public static async verPacientesQueAtendera(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor } = req.params;
      const pacientes = await DoctorService.verPacientesQueAtendera(idDoctor);
      if (!pacientes) {
        throw new NotFoundError('No se encontraron pacientes para el doctor.');
      }
      res.status(200).json(pacientes);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al obtener los pacientes de la base de datos');
      } else {
        console.error('Error al obtener pacientes:', error);
        throw new InternalServerError('Error al obtener pacientes');
      }
    }
  }

  // Pacientes asignados al Doctor
  public static async pacientesAsignadosAlDoctor(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor } = req.params;
      const pacientes = await DoctorService.pacientesAsignadosAlDoctor(idDoctor);
      if (!pacientes) {
        throw new NotFoundError('No se encontraron pacientes asignados al doctor.');
      }
      res.status(200).json(pacientes);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al obtener los pacientes asignados desde la base de datos');
      } else {
        console.error('Error al obtener pacientes:', error);
        throw new InternalServerError('Error al obtener pacientes');
      }
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
        throw new NotFoundError('Orden médica no encontrada');
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al obtener la orden médica desde la base de datos');
      } else {
        console.error('Error al obtener orden médica por ID de cita:', error);
        throw new InternalServerError('Error al obtener orden médica');
      }
    }
  }
}

export default DoctorController;
