import { Request, Response } from 'express';
import ColillaPagoService from '../services/colillaPago.service'; // Importamos el servicio
import {BadRequestError, NotFoundError, InternalServerError,DatabaseError} from '../middlewares/customErrors';

export class ColillaPagoController {
  
  // Crear una nueva colilla de pago
  public async crearColillaPago(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;  // Obtenemos los datos del cuerpo de la solicitud
      if (!data) {
        throw new BadRequestError('Los datos de la colilla son obligatorios.');
      }
      const id = await ColillaPagoService.crearColillaPago(data);  // Llamamos al servicio para crear una colilla
      res.status(201).json({ message: 'Colilla creada exitosamente', id });  // Respondemos con el ID generado
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al crear la colilla en la base de datos');
      } else {
        console.error('Error al crear la colilla:', error);
        throw new InternalServerError('Error al crear la colilla');
      }
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
        throw new NotFoundError('Colilla no encontrada');
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al obtener la colilla desde la base de datos');
      } else {
        console.error(`Error al obtener la colilla con ID ${req.params.id}:`, error);
        throw new InternalServerError('Error al obtener la colilla');
      }
    }
  }

  // Obtener todas las colillas de pago
  public async obtenerTodasLasColillas(req: Request, res: Response): Promise<void> {
    try {
      const colillas = await ColillaPagoService.obtenerTodasLasColillas();  // Llamamos al servicio para obtener todas las colillas
      res.status(200).json(colillas);  // Devolvemos todas las colillas
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al obtener las colillas desde la base de datos');
      } else {
        console.error('Error al obtener las colillas:', error);
        throw new InternalServerError('Error al obtener las colillas');
      }
    }
  }

  // Eliminar una colilla de pago por su ID
  public async eliminarColilla(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);  // Obtenemos el ID de los parámetros de la ruta
      await ColillaPagoService.eliminarColilla(id);  // Llamamos al servicio para eliminar la colilla
      res.status(200).json({ message: 'Colilla eliminada exitosamente' });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al eliminar la colilla desde la base de datos');
      } else {
        console.error(`Error al eliminar la colilla con ID ${req.params.id}:`, error);
        throw new InternalServerError('Error al eliminar la colilla');
      }
    }
  }

  // Actualizar una colilla de pago por su ID
  public async actualizarColilla(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);  // Obtenemos el ID de los parámetros de la ruta
      const data = req.body;  // Obtenemos los datos actualizados del cuerpo de la solicitud
      if (!data) {
        throw new BadRequestError('Los datos actualizados son obligatorios.');
      }
      await ColillaPagoService.actualizarColillaPago(id, data);  // Llamamos al servicio para actualizar la colilla
      res.status(200).json({ message: 'Colilla actualizada exitosamente' });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError('Error al actualizar la colilla en la base de datos');
      } else {
        console.error(`Error al actualizar la colilla con ID ${req.params.id}:`, error);
        throw new InternalServerError('Error al actualizar la colilla');
      }
    }
  }
}

export default new ColillaPagoController();
