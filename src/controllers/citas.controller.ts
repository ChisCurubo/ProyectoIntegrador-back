import { Request, Response, NextFunction } from 'express';
import CitasService from '../services/citas.service';
import HistorialClinicoService from '../services/HistoriaClinica.service';
import { BadRequestError, NotFoundError, InternalServerError } from '../middlewares/customErrors';
import { Cita, CitaDetalladaParaAgendar, ReagendarCitadetallada, CitaConPacientesYDoctores } from '../interface/Citas';

export class CitasController {

  // Crear una nueva cita
  public async createCita(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora, medico, idUsuario, historialMedico } = req.body;
    try {
      const result = await CitasService.createCita(fecha, hora, medico, idUsuario, historialMedico);
      res.status(201).json({ message: 'Cita insertada exitosamente', idCita: result.insertId });
    } catch (error) {
      next(new InternalServerError('Error al insertar la cita'));
    }
  }

  // Crear cita con historial médico duplicado
  public async createcCitaHistorial(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora, medico, idUsuario } = req.body;
    try {
      const historialPasado = await HistorialClinicoService.duplicateHistorial(idUsuario);
      if (historialPasado === 0) {
        throw new BadRequestError('No se pudo duplicar el historial médico');
      }
      const result = await CitasService.createCitaWithHistorial(fecha, hora, medico, idUsuario, historialPasado);
      res.status(201).json({ message: 'Cita insertada exitosamente', idCita: result.insertId });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar fecha y hora de la cita
  public async updateDateCita(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora } = req.body;
    const { idCita } = req.params;
    const id = Number(idCita.trim()); // Convertir a número
    try {
      const success = await CitasService.updateDateCita(fecha, hora, id);
      if (success) {
        res.status(200).json({ message: 'Cita actualizada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  // Actualizar estado de la cita
  public async updateStatusCita(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { estado } = req.body;
    const { idCita } = req.params;
    const id = Number(idCita.trim()); // Convertir a número
    try {
      const success = await CitasService.updateStatusCita(estado, id);
      if (success) {
        res.status(200).json({ message: 'Estado de la cita actualizado' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  // Actualizar todos los campos de una cita
  public async updateCitasAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora, medico, estado, idUsuario } = req.body;
    const { idCita } = req.params;
    const id = Number(idCita.trim()); // Convertir a número
    try {
      const success = await CitasService.updateCitasAll(fecha, hora, medico, estado, id, idUsuario);
      if (success) {
        res.status(200).json({ message: 'Cita actualizada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  // Eliminar una cita por ID de cita
  public async deleteCitasID(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idCita } = req.params;
    try {
      const success = await CitasService.deleteCitasId(Number(idCita.trim()));
      if (success) {
        res.status(200).json({ message: 'Cita eliminada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  // Eliminar una cita por ID de usuario
  public async deleteCitasUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idUsuario } = req.params;
    try {
      const success = await CitasService.deleteCitasId(Number(idUsuario.trim()));
      if (success) {
        res.status(200).json({ message: 'Cita eliminada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  // Eliminar una cita por ID de cita y usuario
  public async deleteCitas(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idCita, idUsuario } = req.params;
    try {
      const success = await CitasService.deleteCitasAll(Number(idCita.trim()), Number(idUsuario.trim()));
      if (success) {
        res.status(200).json({ message: 'Cita eliminada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  // Obtener citas por ID de usuario
  public async getCitasUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const idUsuario = req.params.idUsuario;
    const id = Number(idUsuario.trim()); // Convertir a número
    try {
      const citas = await CitasService.getCitasByUser(id);
      if (citas.length > 0) {
        res.status(200).json(citas);
      } else {
        throw new NotFoundError('No se encontraron citas');
      }
    } catch (error) {
      next(error);
    }
  }

  // Obtener citas por ID de doctor
  public async getCitasDoc(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idDoc } = req.params;
    const id = Number(idDoc.trim()); // Convertir a número
    try {
      const citas = await CitasService.getCitasByDoctor(id);
      if (citas.length > 0) {
        res.status(200).json(citas);
      } else {
        throw new NotFoundError('No se encontraron citas');
      }
    } catch (error) {
      next(error);
    }
  }

  // Obtener citas por ID de cita
  public async getCitasId(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idCita } = req.params;
    const id = Number(idCita.trim()); // Conversión segura a número
    if (isNaN(id)) {
      next(new BadRequestError('El ID de la cita no es válido'));
      return;
    }
  
    try {
      const citas = await CitasService.getCitaById(id);
      if (citas) {
        res.status(200).json(citas);
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  // Obtener citas con pacientes y doctores
  public async getCitasWithPatientsAndDoctors(req: Request, res: Response): Promise<void> {
    try {
      const citas = await CitasService.getCitasWithPatientsAndDoctors();
      res.status(200).json(citas);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  }

  // Método detallado para agendar citas
  public async metodoDetalladoParaAgendarCitas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const citas = await CitasService.metodoDetalladoParaAgendarCitas();
      res.status(200).json(citas);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  }

  // Obtener citas detalladas por ID de usuario
  public static async obtenerCitasDetalladasPorId(req: Request, res: Response): Promise<Response> {
    const { idUsuarioCC } = req.params;
    try {
      const citas = await CitasService.getCitasDetalladasPorId(idUsuarioCC);
      return res.status(200).json(citas);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  // Eliminar cita por ID de cita
  public static async deleteCitaById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idCita } = req.params;
    try {
      await CitasService.deleteCitasId(Number(idCita.trim()));
      res.status(200).json({ message: 'Cita eliminada correctamente' });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }
}

export default new CitasController();
