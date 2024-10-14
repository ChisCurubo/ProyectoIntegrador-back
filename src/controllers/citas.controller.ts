import { Request, Response, NextFunction } from 'express';
import CitasService from '../services/citas.service';
import HistorialClinicoService from '../services/HistoriaClinica.service';
import { BadRequestError, NotFoundError, InternalServerError } from '../middlewares/customErrors';
import {Cita, CitaDetalladaParaAgendar, ReagendarCitadetallada, CitaConPacientesYDoctores } from '../interface/Citas'

export class CitasController {

  public async createCita(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora, medico, idUsuario, historialMedico } = req.body;
    try {
      const result = await CitasService.createCita(fecha, hora, medico, idUsuario, historialMedico);
      res.status(201).json({ message: 'Cita insertada exitosamente', idCita: result.insertId });
    } catch (error) {
      next(new InternalServerError('Error al insertar la cita'));
    }
  }

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

  public async updateDateCita(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora } = req.body;
    const idCita = req.params;
    const id = Number(idCita)
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

  public async updateStatusCita(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { estado } = req.body;
    const idCita = req.params;
    const id = Number(idCita)
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

  public async updateCitasAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora, medico, estado, idUsuario } = req.body;
    const idCita = req.params;
    const id = Number(idCita)
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

  public async deleteCitasID(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idCita } = req.params;
    try {
      const success = await CitasService.deleteCitasId(Number(idCita));
      if (success) {
        res.status(200).json({ message: 'Cita eliminada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }
  public async deleteCitasUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idUsuario } = req.params;
    try {
      const success = await CitasService.deleteCitasId(Number(idUsuario));
      if (success) {
        res.status(200).json({ message: 'Cita eliminada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }
  public async deleteCitas(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idCita, idUsuario } = req.params;
    try {
      const success = await CitasService.deleteCitasAll(Number(idCita), Number(idUsuario));
      if (success) {
        res.status(200).json({ message: 'Cita eliminada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  public async getCitasUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const idUsuario = req.params;
    const id = Number(idUsuario)
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

  public async getCitasDoc(req: Request, res: Response, next: NextFunction): Promise<void> {
    const idDoc = req.params;
    const id = Number(idDoc)
    try {
      const citas = await CitasService.getCitasByDoctor(id);
      if (citas.length > 0) {
        res.status(200).json(citas);
      } else {
        throw new NotFoundError('No se encontraron médicos');
      }
    } catch (error) {
      next(error);
    }
  }

  public async getCitasId(req: Request, res: Response, next: NextFunction): Promise<void> {
    const idCita = req.params;
    const id = Number(idCita)
    try {
      const citas = await CitasService.getCitaById(id);
      if (citas.length > 0) {
        res.status(200).json(citas);
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }



  public async getCitasWithPatientsAndDoctors(req: Request, res: Response): Promise<void> {
    try {
      const citas = await CitasService.getCitasWithPatientsAndDoctors();
      res.status(200).json(citas); // Responder con el estado 200 y las citas
    } catch (error: any) {
      console.error('Error in getCitasWithPatientsAndDoctors:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message }); // Responder con 404 si no se encuentran citas
      } else {
        res.status(500).json({ message: 'Error interno del servidor' }); // Responder con 500 en caso de error inesperado
      }
    }
  }


  public async metodoDetalladoParaAgendarCitas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const citas = await CitasService.metodoDetalladoParaAgendarCitas();
      res.status(200).json(citas); // Responder con el estado 200 y las citas
    } catch (error: any) {
      console.error('Error en metodoDetalladoParaAgendarCitas:', error);
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message }); // Responder con 404 si no se encuentran citas
      } else {
        res.status(500).json({ message: 'Error interno del servidor' }); // Responder con 500 en caso de error inesperado
      }
    }
  }


  public static async getCitasWithPatientsAndDoctorsByCC(req: Request, res: Response): Promise<Response> {
    const { cedula } = req.params; // Asumiendo que la cédula se pasa como parámetro en la ruta

    try {
      const citas: CitaConPacientesYDoctores[] = await CitasService.getCitasWithPatientsAndDoctorsByCC(cedula);
      return res.status(200).json(citas);
    } catch (error) {
      console.error('Error en getCitasWithPatientsAndDoctorsByCC:', error);
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error al obtener citas con pacientes y doctores.' });
    }
  }

  public static async getCitasDetalladasParaAgendarByCC(req: Request, res: Response): Promise<Response> {
    const { cedula } = req.params; // Asumiendo que la cédula se pasa como parámetro en la ruta

    try {
      const citas: CitaDetalladaParaAgendar[] = await CitasService.getCitasDetalladasParaAgendarByCC(cedula);
      return res.status(200).json(citas);
    } catch (error) {
      console.error('Error en getCitasDetalladasParaAgendarByCC:', error);
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error al obtener citas detalladas para agendar.' });
    }
  }

  public static async obtenerCitasDetalladasPorId(req: Request, res: Response): Promise<Response> {
    const idUsuarioCC = req.params.idUsuarioCC; // Obtener el ID del usuario desde los parámetros de la solicitud

    try {
      const citas: ReagendarCitadetallada[] = await CitasService.getCitasDetalladasPorId(idUsuarioCC);
      return res.status(200).json(citas); // Enviar la respuesta con las citas en formato JSON
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message }); // Manejar error de no encontrado
      }
      console.error('Error al obtener citas:', error);
      return res.status(500).json({ message: 'Error interno del servidor' }); // Manejar otros errores
    }
  }





  public static async deleteCitaById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idCita } = req.params;
    try {
      await CitasService.deleteCitaById(Number(idCita));
      res.status(200).json({ message: 'Cita eliminada correctamente' });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });

      } else {
        next(error);
      }
    }
  }

  public async viewSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ccDoc, dia } = req.body;

      if (!ccDoc || !dia) {
        throw new BadRequestError('Faltan parámetros ccDoc o dia en la solicitud.');
      }

      const availableHours = await CitasService.viewSchedule(ccDoc, new Date(dia));

      // Verificar si hay horas disponibles
      if (availableHours.length === 0) {
        throw new NotFoundError('No se encontraron horas disponibles para el día seleccionado');
      }

      // Responder con el array de horas disponibles
      res.status(200).json({ availableHours });

    } catch (error: any) {
      // Pasar el error a middleware de manejo de errores (opcional)
      next(error);
    }
  }



}

export default new CitasController();
