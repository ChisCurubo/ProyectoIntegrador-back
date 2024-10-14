import { Request, Response } from 'express';
import DoctorService from '../services/doctor.service'; // Asegúrate de la ruta correcta
import {BadRequestError, NotFoundError, InternalServerError,DatabaseError} from '../middlewares/customErrors';

class DoctorController {
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

  
public static async obtenerOrdenesMedicasPorCedula(req: Request, res: Response): Promise<void> {
  const { cedula } = req.params; // Obtener la cédula de los parámetros de la solicitud

  try {
    const ordenesMedicas = await DoctorService.buscarOrdenesMedicasInformacionPorCedula(cedula);

    if (ordenesMedicas.length === 0) {
      throw new NotFoundError('No se encontraron órdenes médicas para esta cédula.');
    }

    res.status(200).json(ordenesMedicas); // Devolver las órdenes médicas encontradas
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message }); // Manejo de error si no se encontraron órdenes
    } else {
      console.error('Error al obtener órdenes médicas por cédula:', error);
      res.status(500).json({ message: 'Error en el servidor al obtener las órdenes médicas.' });
    }
  }
}

}

export default DoctorController;
