import { Request, Response } from 'express';
import HistoriaClinicaService from '../services/HistoriaClinica.service';

class HistoriaClinicaController {

  public async obtenerHistoriasClinicas(req: Request, res: Response) {
    try {
      const historias = await HistoriaClinicaService.obtenerHistoriasClinicas();
      res.status(200).json(historias);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener historias clínicas', error });
    }
  }

  public async obtenerHistoriaClinicaPorId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const historia = await HistoriaClinicaService.obtenerHistoriaClinicaPorId(Number(id));
      if (historia) {
        res.status(200).json(historia);
      } else {
        res.status(404).json({ mensaje: 'Historia clínica no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener la historia clínica', error });
    }
  }

  public async crearHistoriaClinica(req: Request, res: Response) {
    const historiaClinica = req.body;
    try {
      await HistoriaClinicaService.crearHistoriaClinica(historiaClinica);
      res.status(201).json({ mensaje: 'Historia clínica creada exitosamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear la historia clínica', error });
    }
  }

  public async actualizarHistoriaClinicaPorId(req: Request, res: Response) {
    const { id } = req.params;
    const historiaClinica = req.body;
    try {
      await HistoriaClinicaService.actualizarHistoriaClinicaPorId(Number(id), historiaClinica);
      res.status(200).json({ mensaje: 'Historia clínica actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar la historia clínica', error });
    }
  }

  public async eliminarHistoriaClinicaPorId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await HistoriaClinicaService.eliminarHistoriaClinicaPorId(Number(id));
      res.status(200).json({ mensaje: 'Historia clínica eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar la historia clínica', error });
    }
  }
}

export default new HistoriaClinicaController();
