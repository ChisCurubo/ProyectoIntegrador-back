import { Request, Response, NextFunction } from 'express';
import HistoriaClinicaService from '../services/historiaClinica.service';
import { join } from 'path';
import { BadRequestError, NotFoundError, InternalServerError, DatabaseError } from '../middlewares/customErrors';

class HistoriaClinicaController {
  public async getHistoriasClinicas(req: Request, res: Response, next: NextFunction) {
    try {
      const historias = await HistoriaClinicaService.getHistoriasClinicas();
      res.status(200).json(historias);
    } catch (error) {
      next(new InternalServerError('Error al obtener historias clínicas'));
    }
  }

  public async getHistoriaClinicaById(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new BadRequestError('ID inválido'));
    }

    try {
      const historia = await HistoriaClinicaService.getHistoriaClinicaById(id);
      if (!historia) {
        return next(new NotFoundError('Historia clínica no encontrada'));
      }
      res.status(200).json(historia);
    } catch (error) {
      if (error instanceof DatabaseError) {
        next(new DatabaseError('Error al obtener la historia clínica desde la base de datos'));
      } else {
        next(new InternalServerError('Error al obtener la historia clínica'));
      }
    }
  }

  public async createHistoriaClinica(req: Request, res: Response, next: NextFunction) {
    const historiaClinica = req.body;
    if (!historiaClinica || Object.keys(historiaClinica).length === 0) {
      return next(new BadRequestError('Los datos de la historia clínica son obligatorios'));
    }

    try {
      const nuevaHistoria = await HistoriaClinicaService.createHistorialClinico(historiaClinica);
      res.status(201).json({ mensaje: 'Historia clínica creada exitosamente', historia: nuevaHistoria });
    } catch (error) {
      if (error instanceof DatabaseError) {
        next(new DatabaseError('Error al crear la historia clínica en la base de datos'));
      } else {
        next(new InternalServerError('Error al crear la historia clínica'));
      }
    }
  }

  public async updateHistoriaClinicaById(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new BadRequestError('ID inválido'));
    }

    const historiaClinica = req.body;
    if (!historiaClinica || Object.keys(historiaClinica).length === 0) {
      return next(new BadRequestError('Los datos de la historia clínica son obligatorios'));
    }

    try {
      const historiaActualizada = await HistoriaClinicaService.updateHistoriaClinicaById(id, historiaClinica);
      if (historiaActualizada) {
        return next(new NotFoundError('Historia clínica no encontrada'));
      }
      res.status(200).json({ mensaje: 'Historia clínica actualizada exitosamente', historia: historiaActualizada });
    } catch (error) {
      if (error instanceof DatabaseError) {
        next(new DatabaseError('Error al actualizar la historia clínica en la base de datos'));
      } else {
        next(new InternalServerError('Error al actualizar la historia clínica'));
      }
    }
  }

  public async deleteHistoriaClinicaById(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new BadRequestError('ID inválido'));
    }

    try {
      const eliminado = await HistoriaClinicaService.deleteHistoriaClinicaById(id);
      if (!eliminado) {
        return next(new NotFoundError('Historia clínica no encontrada'));
      }
      res.status(200).json({ mensaje: 'Historia clínica eliminada exitosamente' });
    } catch (error) {
      if (error instanceof DatabaseError) {
        next(new DatabaseError('Error al eliminar la historia clínica desde la base de datos'));
      } else {
        next(new InternalServerError('Error al eliminar la historia clínica'));
      }
    }
  }

  // Mostrar el HTML del Historial Clínico
  public renderHistorialClinicoPage = (req: Request, res: Response) => {
    try {
      const htmlPath = join(__dirname, '../views/HistorialClinico/historiaClinica.html');
      res.sendFile(htmlPath);
    } catch (error) {
      console.error('Error al mostrar la página de Historial Clínico:', error);
      throw new InternalServerError('Error al cargar la página de Historial Clínico.');
    }
  }

  // Mostrar el HTML de la Orden Médica
  public renderOrdenMedicaPage = (req: Request, res: Response) => {
    try {
      const htmlPath = join(__dirname, '../views/OrdenMedica/ordenMedica.html');
      res.sendFile(htmlPath);
    } catch (error) {
      console.error('Error al mostrar la página de Orden Médica:', error);
      throw new InternalServerError('Error al cargar la página de Orden Médica.');
    }
  }
}

export default new HistoriaClinicaController();