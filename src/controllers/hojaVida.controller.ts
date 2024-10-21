import { Request, Response } from 'express';
import { HojaVidaService } from '../services/hojaVida.service';

export class HojaVidaController {
    private service = new HojaVidaService();

    // Obtener hoja de vida por ID
    getHojaVidaById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const hojaVida = await this.service.getHojaVidaById(parseInt(id));
            if (!hojaVida) {
                return res.status(404).json({ message: 'Hoja de vida no encontrada.' });
            }
            res.json(hojaVida);
        } catch (error) {
            console.error("Error al obtener la hoja de vida por ID:", error);
            res.status(500).json({ message: 'Error al obtener la hoja de vida.' });
        }
    };

    // Obtener hoja de vida por CC
    getHojaVidaByCC = async (req: Request, res: Response) => {
        const { cc } = req.params;
        try {
            const hojaVida = await this.service.getHojaVidaByCC(cc);
            if (!hojaVida) {
                return res.status(404).json({ message: 'Hoja de vida no encontrada.' });
            }
            res.json(hojaVida);
        } catch (error) {
            console.error("Error al obtener la hoja de vida por CC:", error);
            res.status(500).json({ message: 'Error al obtener la hoja de vida.' });
        }
    };

    // Actualizar hoja de vida
    updateHojaVida = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const result = await this.service.updateHojaVida(parseInt(id), req.body);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Hoja de vida no encontrada.' });
            }
            res.json({ message: 'Hoja de vida actualizada.' });
        } catch (error) {
            console.error("Error al actualizar la hoja de vida:", error);
            res.status(500).json({ message: 'Error al actualizar la hoja de vida.' });
        }
    };

    // Generar PDF de la hoja de vida por ID o CC
    generateHojaVidaPDF = async (req: Request, res: Response) => {
      const { id, cc } = req.params;
      try {
          let hojaVida;
          if (id) {
              hojaVida = await this.service.getHojaVidaById(parseInt(id)); // Cambiado a buscar por idHojaVida
          } else if (cc) {
              hojaVida = await this.service.getHojaVidaByCC(cc);
          }
  
          if (!hojaVida) {
              return res.status(404).json({ message: 'Hoja de vida no encontrada.' });
          }
  
          const pdfBuffer = await this.service.generatePDF(hojaVida);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename="hoja-vida.pdf"');
          res.send(pdfBuffer);
      } catch (error) {
          res.status(500).json({ message: 'Error al generar el PDF.' });
      }
  };  
}

export default new HojaVidaController();