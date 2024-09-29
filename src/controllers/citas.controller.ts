import { Request, Response, NextFunction } from 'express';
import CitasService from '../services/citas.service';
import HistorialClinicoService from '../services/HistoriaClinica.service';
import { BadRequestError, NotFoundError, InternalServerError } from '../middlewares/customErrors';

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

  public async deleteCitas(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { idCita, idUsuario } = req.params;
    try {
      const success = await CitasService.deleteCitas(Number(idCita), Number(idUsuario));
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
}

export default new CitasController();
