import { Request, Response } from 'express';
import ColillaPagoService from '../services/colillaPago.service'; // Importamos el servicio

export class ColillaPagoController {
  
  // Crear una nueva colilla de pago
  public async crearColillaPago(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;  // Obtenemos los datos del cuerpo de la solicitud
      const id = await ColillaPagoService.crearColillaPago(data);  // Llamamos al servicio para crear una colilla
      res.status(201).json({ message: 'Colilla creada exitosamente', id });  // Respondemos con el ID generado
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la colilla', error });
    }
  }

  // Obtener una colilla de pago por su ID
  public async obtenerColillaPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);  // Obtenemos el ID de los parámetros de la ruta
      const colilla = await ColillaPagoService.obtenerColillaPorId(id);
      if (colilla) {
        res.status(200).json(colilla);  // Si se encuentra la colilla, la devolvemos
      } else {
        res.status(404).json({ message: 'Colilla no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la colilla', error });
    }
  }

  // Obtener todas las colillas de pago
  public async obtenerTodasLasColillas(req: Request, res: Response): Promise<void> {
    try {
      const colillas = await ColillaPagoService.obtenerTodasLasColillas();  // Llamamos al servicio para obtener todas las colillas
      res.status(200).json(colillas);  // Devolvemos todas las colillas
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las colillas', error });
    }
  }

  // Eliminar una colilla de pago por su ID
  public async eliminarColilla(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);  // Obtenemos el ID de los parámetros de la ruta
      await ColillaPagoService.eliminarColilla(id);  // Llamamos al servicio para eliminar la colilla
      res.status(200).json({ message: 'Colilla eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la colilla', error });
    }
  }

  // Actualizar una colilla de pago por su ID
  public async actualizarColilla(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);  // Obtenemos el ID de los parámetros de la ruta
      const data = req.body;  // Obtenemos los datos actualizados del cuerpo de la solicitud
      await ColillaPagoService.actualizarColillaPago(id, data);  // Llamamos al servicio para actualizar la colilla
      res.status(200).json({ message: 'Colilla actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la colilla', error });
    }
  }
}

export default new ColillaPagoController();
