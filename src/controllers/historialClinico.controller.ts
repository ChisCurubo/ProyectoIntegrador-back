import { Request, Response, NextFunction } from 'express';
import HistoriaClinicaService from '../services/HistoriaClinica.service';
import * as htmlPdf from 'html-pdf';
import { join } from 'path';
import { BadRequestError, NotFoundError, InternalServerError, DatabaseError } from '../middlewares/customErrors';
import { HistoriaClinica } from '../interface/historiaClinica';

class HistoriaClinicaController {
  // Obtener todas las historias clínicas
  public async getHistoriasClinicas(req: Request, res: Response, next: NextFunction) {
    try {
      const historias = await HistoriaClinicaService.getHistoriasClinicas();
      res.status(200).json(historias);
    } catch (error) {
      next(new InternalServerError('Error al obtener historias clínicas'));
    }
  }

  // Obtener una historia clínica por ID y generar PDF
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
      
      try {
        const pdfBuffer = await HistoriaClinicaController.generarPDF(historia);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="historia_clinica.pdf"',
          'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);
      } catch (pdfError) {
        console.error('Error al generar PDF:', pdfError);
        next(new InternalServerError('Error al generar el PDF de la historia clínica'));
      }
    } catch (error) {
      console.error('Error al obtener la historia clínica:', error);
      next(new InternalServerError('Error al obtener la historia clínica desde la base de datos'));
    }
  }

  // Crear una nueva historia clínica y generar PDF
  public createHistorialClinico = async (req: Request, res: Response, next: NextFunction) => {
    const historiaClinica: HistoriaClinica = req.body;

    // Validar que se reciban los datos necesarios
    if (!historiaClinica || Object.keys(historiaClinica).length === 0) {
      return next(new BadRequestError('Los datos de la historia clínica son obligatorios'));
    }

    try {
      // Crear la historia clínica en la base de datos
      const nuevaHistoria = await HistoriaClinicaService.createHistorialClinico(historiaClinica);

      // Generar PDF con los datos de la historia clínica
      const pdfBuffer = await HistoriaClinicaController.generarPDF(nuevaHistoria);

      // Devolver el PDF generado como respuesta
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="historia_clinica.pdf"',
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer); // Envía el buffer del PDF
    } catch (error) {
      next(new InternalServerError('Error al crear la historia clínica'));
    }
  }

  // Método estático para generar el PDF
  private static generarPDF(historiaClinica: HistoriaClinica): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      // Contenido HTML del PDF con los nuevos datos
      const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Historia Clínica</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f0f4ff;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 30px auto;
              background-color: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              text-align: center;
              font-size: 28px;
              color: #003366;
              margin-bottom: 20px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section h2 {
              font-size: 22px;
              color: #003366;
              border-bottom: 2px solid #003366;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              padding: 12px;
              border: 1px solid #d1d1d1;
              font-size: 14px;
              word-wrap: break-word;
              overflow-wrap: break-word;
              max-width: 250px;
            }
            th {
              background-color: #003366;
              color: white;
              font-weight: bold;
            }
            .signature-section {
              margin-top: 40px;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Historia Clínica</h1>
            <div class="section">
              <h2>Datos Personales</h2>
              <table>
                <tr>
                  <td>Tipo de Sangre</td>
                  <td>${historiaClinica.tipoSangre || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Género</td>
                  <td>${historiaClinica.genero || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Fecha de Nacimiento</td>
                  <td>${historiaClinica.fecha_Nac || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Discapacidad</td>
                  <td>${historiaClinica.discapacidad || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Fecha de Revisión</td>
                  <td>${historiaClinica.fecha_Rev || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Hora de Revisión</td>
                  <td>${historiaClinica.hora_Rev || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Motivo</td>
                  <td>${historiaClinica.motivo || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Descripción del Motivo</td>
                  <td>${historiaClinica.descripcion_Motivo || 'N/A'}</td>
                </tr>
              </table>
            </div>
            <div class="section">
              <h2>Datos Médicos</h2>
              <table>
                <tr>
                  <td>Diagnóstico</td>
                  <td>${historiaClinica.diagnostico || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Tratamiento</td>
                  <td>${historiaClinica.tratamiento || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Conclusión</td>
                  <td>${historiaClinica.conclusion || 'N/A'}</td>
                </tr>
              </table>
            </div>
            <div class="section">
              <h2>Signos Vitales</h2>
              <table>
                <tr>
                  <td>Presión Arterial</td>
                  <td>${historiaClinica.presion_Sangre || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Presión Arterial Promedio</td>
                  <td>${historiaClinica.presion_Sangre_Prom || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Pulso</td>
                  <td>${historiaClinica.pulso || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Saturación</td>
                  <td>${historiaClinica.saturacion || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Altura</td>
                  <td>${historiaClinica.altura || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Peso</td>
                  <td>${historiaClinica.peso || 'N/A'}</td>
                </tr>
              </table>
            </div>
            <div class="section">
              <h2>Antecedentes Médicos</h2>
              <table>
                <tr>
                  <td>Perinatales</td>
                  <td>${historiaClinica.perinatales || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Patológicos</td>
                  <td>${historiaClinica.patologicos || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Quirúrgicos</td>
                  <td>${historiaClinica.quirurgicos || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Vacunas</td>
                  <td>${historiaClinica.vacunas || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Antecedentes Familiares</td>
                  <td>${historiaClinica.familiares || 'N/A'}</td>
                </tr>
              </table>
            </div>
            <div class="signature-section">
              <h2>Firma del Médico</h2>
              <span style="border-top: 2px solid #333; display: inline-block; width: 200px;"></span><br>
              ${historiaClinica.firma_digital_doctor || 'N/A'}
            </div>
          </div>
        </body>
        </html>`;

      // Configuración del PDF
      const options = {
        format: 'A4',
        orientation: 'portrait',
        border: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
      };

      // Generar el PDF
      htmlPdf.create(html, options).toBuffer((err: Error | null, buffer: Buffer) => {
        if (err) {
          return reject(err); // Manejar el error al generar el PDF
        }
        resolve(buffer);
      });
    });
  }  

  // Actualizar una historia clínica por ID
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
      if (!historiaActualizada) {
        return next(new NotFoundError('Historia clínica no encontrada'));
      }
      res.status(200).json({ mensaje: 'Historia clínica actualizada exitosamente', historia: historiaActualizada });
    } catch (error) {
      next(new InternalServerError('Error al actualizar la historia clínica'));
    }
  }

  public async getHistoriaClinicaByUsuarioCC(req: Request, res: Response, next: NextFunction) {
    const idUsuarioCC = req.params.idUsuarioCC;
  
    try {
      const historia = await HistoriaClinicaService.getHistoriaClinicaByUsuarioCC(idUsuarioCC);
      if (!historia) {
        return next(new NotFoundError('Historia clínica no encontrada para este paciente'));
      }
      res.status(200).json(historia);
    } catch (error) {
      next(new InternalServerError('Error al obtener la historia clínica'));
    }
  }

  public async getHistoriaClinicaByUsuarioCCC(req: Request, res: Response, next: NextFunction) {
    const { idUsuarioCC } = req.params;  // Obtenemos el parámetro CC
  
    try {
      // Obtenemos la historia clínica por el número de CC del usuario
      const historia = await HistoriaClinicaService.getHistoriaClinicaByUsuarioCC(idUsuarioCC);
  
      if (!historia) {
        // Si no se encuentra la historia clínica, lanzamos un error 404
        throw new NotFoundError('Historia clínica no encontrada para este paciente');
      }
  
      // Generamos el PDF de la historia clínica
      const pdfBuffer = await HistoriaClinicaController.generarPDF(historia);
  
      // Configuramos los encabezados de la respuesta
      res.set({
        'Content-Type': 'application/pdf',  // Tipo de contenido como PDF
        'Content-Disposition': `attachment; filename="historia_clinica_${idUsuarioCC}.pdf"`,  // Nombre del archivo
        'Content-Length': pdfBuffer.length,  // Longitud del archivo PDF
      });
  
      // Enviamos el buffer PDF como respuesta
      res.send(pdfBuffer);
    } catch (error) {
      // Capturamos cualquier error y lo manejamos con el middleware de errores
      console.error('Error al obtener la historia clínica por CC:', error);
      next(error);  // Pasamos el error al middleware de manejo de errores
    }
  }
  

  // Eliminar una historia clínica por ID
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
      next(new InternalServerError('Error al eliminar la historia clínica'));
    }
  }
  
}

export default new HistoriaClinicaController();
