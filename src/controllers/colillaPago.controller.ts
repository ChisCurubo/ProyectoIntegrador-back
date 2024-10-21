import { Request, Response } from 'express';
import ColillaPagoService from '../services/colillaPago.service'; // Importamos el servicio
import { BadRequestError, NotFoundError, InternalServerError, DatabaseError } from '../middlewares/customErrors';

export class ColillaPagoController {

  public async obtenerColillaPDF(req: Request, res: Response): Promise<void> {
    try {
      const idColilla = req.params.id;
      const pdfBuffer = await ColillaPagoService.generarColillaPDF(idColilla);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=colilla_${idColilla}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error al generar el PDF de la colilla:', error);
      res.status(500).json({ error: 'Error al generar el PDF de la colilla' });
    }
  }

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

  public async obtenerColillaPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);  // Obtenemos el ID de los parámetros de la ruta
      const colilla = await ColillaPagoService.obtenerColillaPorId(id);
      
      if (colilla) {
        res.status(200).json(colilla);  // Si se encuentra la colilla, la devolvemos
      } else {
        res.status(404).json({ error: 'Colilla no encontrada' });  // Respuesta 404 si no se encuentra
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        console.error(`Error al obtener la colilla desde la base de datos:`, error);
        res.status(500).json({ error: 'Error al obtener la colilla desde la base de datos' });
      } else {
        console.error(`Error al obtener la colilla con ID ${req.params.id}:`, error);
        res.status(500).json({ error: 'Error al obtener la colilla' });
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

  public async generatePayStub(req: Request, res: Response) {
    try {
      const { paciente, cc, telefono, cargo, salario, services, quantities } = req.body;

      // Verificación de los datos requeridos
      if (!paciente || !cc || !telefono || !cargo || !salario || !services || !quantities) {
        throw new BadRequestError('Faltan datos obligatorios para generar la colilla de pago');
      }

      const empleadoData = { paciente, cc, telefono, cargo, salario };

      const pdfBuffer = await ColillaPagoService.generateElectronicPayStub(empleadoData, services, quantities);

      // Configurar los encabezados de la respuesta para la descarga del PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=colilla_pago.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generando la colilla de pago:', error);
      throw new InternalServerError('Error al obtener el usuario');
    };
  }
}

export default new ColillaPagoController();
