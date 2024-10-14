import { Request, Response, NextFunction } from 'express';
import * as htmlPdf from 'html-pdf';
import OrdenMedicaService from '../services/ordenMedica.service';
import { ordenMedica } from '../interface/ordenMedica';
import { BadRequestError, NotFoundError, InternalServerError } from '../middlewares/customErrors';

class OrdenMedicaController {
    
    public createOrdenMedica = async (req: Request, res: Response, next: NextFunction) => {
        const nuevaOrdenMedica: ordenMedica = req.body;
    
        // Validar que se reciban los datos necesarios
        if (!nuevaOrdenMedica || Object.keys(nuevaOrdenMedica).length === 0) {
          return next(new BadRequestError('Los datos de la orden médica son obligatorios'));
        }
    
        try {
          // Crear la orden médica en la base de datos
          const ordenGuardada = await OrdenMedicaService.createOrdenMedica(nuevaOrdenMedica);
    
          // Generar el PDF con los datos de la orden médica
          const pdfBuffer = await OrdenMedicaController.generarPDF(ordenGuardada);
    
          // Configurar la respuesta para enviar el PDF
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="orden_medica.pdf"',
            'Content-Length': pdfBuffer.length,
          });
    
          res.send(pdfBuffer); // Envía el buffer del PDF
        } catch (error) {
          next(new InternalServerError('Error al crear la orden médica'));
        }
      };
    
      // Método para generar el PDF usando html-pdf
      private static generarPDF(ordenMedica: ordenMedica): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
          const fechaActual = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
    
          // HTML de la orden médica con un diseño elegante y la fecha incluida
          const html = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Orden Médica</title>
              <style>
                  body { 
                      font-family: 'Arial', sans-serif; 
                      margin: 0; 
                      padding: 0; 
                      background-color: #f4f7fc;
                  }
                  .container { 
                      width: 100%; 
                      max-width: 800px; 
                      margin: 30px auto; 
                      background-color: white; 
                      padding: 30px; 
                      border-radius: 10px; 
                      box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1); 
                      font-size: 14px;
                      color: #333;
                  }
                  h1 { 
                      text-align: center; 
                      font-size: 30px; 
                      color: #2a7de1; 
                      margin-bottom: 20px; 
                  }
                  .section { 
                      margin-bottom: 30px; 
                  }
                  .section h2 { 
                      font-size: 20px; 
                      color: #2a7de1; 
                      border-bottom: 2px solid #2a7de1; 
                      padding-bottom: 5px; 
                      margin-bottom: 15px; 
                  }
                  table { 
                      width: 100%; 
                      border-collapse: collapse; 
                      margin-bottom: 20px; 
                      background-color: #fff; 
                      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
                  }
                  th, td { 
                      padding: 15px; 
                      border: 1px solid #ddd; 
                      text-align: left; 
                  }
                  th { 
                      background-color: #2a7de1; 
                      color: white; 
                      font-weight: bold; 
                  }
                  td { 
                      background-color: #f9f9f9; 
                  }
                  .signature-section { 
                      margin-top: 50px; 
                      text-align: right; 
                      font-size: 16px; 
                  }
                  .signature-section span { 
                      display: inline-block; 
                      margin-top: 20px; 
                      border-top: 2px solid #333; 
                      width: 200px; 
                  }
                  .footer { 
                      margin-top: 30px; 
                      text-align: center; 
                      font-size: 12px; 
                      color: #666; 
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Orden Médica</h1>
    
                  <div class="section">
                      <h2>Datos Generales</h2>
                      <table>
                          <tr>
                              <th>ID de la Cita</th>
                              <td>${ordenMedica.idCita || 'N/A'}</td>
                              <th>Estado de la Orden Médica</th>
                              <td>${ordenMedica.estadoOM === 1 ? 'Activa' : 'Inactiva'}</td>
                          </tr>
                          <tr>
                              <th>Fecha de Emisión</th>
                              <td colspan="3">${fechaActual}</td>
                          </tr>
                      </table>
                  </div>
    
                  <div class="section">
                      <h2>Diagnóstico y Ordenes</h2>
                      <table>
                          <tr>
                              <th>Diagnóstico</th>
                              <td>${ordenMedica.diagnostico || 'N/A'}</td>
                          </tr>
                          <tr>
                              <th>Órdenes</th>
                              <td>${ordenMedica.ordenes || 'N/A'}</td>
                          </tr>
                          <tr>
                              <th>Recomendaciones</th>
                              <td>${ordenMedica.recomendaciones || 'N/A'}</td>
                          </tr>
                      </table>
                  </div>
    
                  <div class="signature-section">
                      <p>Firma del Médico</p>
                      <span></span>
                  </div>
              </div>
          </body>
          </html>`;
    
          // Opciones para la creación del PDF
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
              return reject(err);
            }
            resolve(buffer);
          });
        });
    }

    public async getOrdenMedica(req: Request, res: Response, next: NextFunction) {
      try {
        const { id } = req.params;
        const ordenMedica = await OrdenMedicaService.getOrdenMedica(id);
        
        if (!ordenMedica) {
          throw new NotFoundError('Orden Médica no encontrada');
        }
    
        const pdfBuffer = await OrdenMedicaController.generarPDF(ordenMedica);
    
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="orden_medica_${id}.pdf"`,
          'Content-Length': pdfBuffer.length,
        });
    
        res.send(pdfBuffer);
      } catch (error) {
        console.error('Error al obtener la orden médica:', error);
        next(error);
      }
    }
          
    public async updateOrdenMedica(req: Request, res: Response, next: NextFunction) {
      try {
        const { id } = req.params;
        const ordenActualizada = await OrdenMedicaService.updateOrdenMedica(id, req.body);
        if (ordenActualizada) {
          res.status(200).json(ordenActualizada);
        } else {
          throw new NotFoundError('Orden Médica no encontrada');
        }
      } catch (error) {
        console.error('Error al actualizar la orden médica:', error);
        next(error);
      }
    }
  }
  
export default new OrdenMedicaController();
