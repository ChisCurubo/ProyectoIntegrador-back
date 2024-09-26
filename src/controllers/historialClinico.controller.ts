import { Request, Response } from 'express';
import HistoriaClinicaService from '../services/HistoriaClinica.service';
import { BadRequestError, NotFoundError, InternalServerError, DatabaseError } from '../middlewares/customErrors';

class HistoriaClinicaController {

  public async obtenerHistoriasClinicas(req: Request, res: Response) {
    try {
      const historias = await HistoriaClinicaService.obtenerHistoriasClinicas();
      res.status(200).json(historias);
    } catch (error) {
      console.error('Error al obtener historias clínicas:', error);
      throw new InternalServerError('Error al obtener historias clínicas');
    }
  }

  public async obtenerHistoriaClinicaPorId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const historia = await HistoriaClinicaService.obtenerHistoriaClinicaPorId(Number(id));
      if (historia) {
        res.status(200).json(historia);
      } else {
        throw new NotFoundError('Historia clínica no encontrada');
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al obtener la historia clínica desde la base de datos');
      } else {
        console.error('Error al obtener la historia clínica:', error);
        throw new InternalServerError('Error al obtener la historia clínica');
      }
    }
  }

  public async crearHistoriaClinica(req: Request, res: Response) {
    const historiaClinica = req.body;
    try {
      if (!historiaClinica) {
        throw new BadRequestError('Los datos de la historia clínica son obligatorios.');
      }
      await HistoriaClinicaService.crearHistoriaClinica(historiaClinica);
      res.status(201).json({ mensaje: 'Historia clínica creada exitosamente' });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al crear la historia clínica en la base de datos');
      } else {
        console.error('Error al crear la historia clínica:', error);
        throw new InternalServerError('Error al crear la historia clínica');
      }
    }
  }

  public async actualizarHistoriaClinicaPorId(req: Request, res: Response) {
    const { id } = req.params;
    const historiaClinica = req.body;
    try {
      if (!historiaClinica) {
        throw new BadRequestError('Los datos de la historia clínica son obligatorios.');
      }
      await HistoriaClinicaService.actualizarHistoriaClinicaPorId(Number(id), historiaClinica);
      res.status(200).json({ mensaje: 'Historia clínica actualizada exitosamente' });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al actualizar la historia clínica en la base de datos');
      } else {
        console.error('Error al actualizar la historia clínica:', error);
        throw new InternalServerError('Error al actualizar la historia clínica');
      }
    }
  }

  public async eliminarHistoriaClinicaPorId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await HistoriaClinicaService.eliminarHistoriaClinicaPorId(Number(id));
      res.status(200).json({ mensaje: 'Historia clínica eliminada exitosamente' });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al eliminar la historia clínica desde la base de datos');
      } else {
        console.error('Error al eliminar la historia clínica:', error);
        throw new InternalServerError('Error al eliminar la historia clínica');
      }
    }
  }
}

export default new HistoriaClinicaController();
