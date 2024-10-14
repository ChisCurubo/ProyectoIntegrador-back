// src/controllers/hojaVidaPacientes.controller.ts
import { Request, Response } from 'express';
import { HojaVidaPacientesService } from '../services/hojaVidaPacientes.service';
import { BadRequestError, InternalServerError } from '../middlewares/customErrors';

export class HojaVidaPacientesController {
    private service = new HojaVidaPacientesService();

    // Método para manejar acciones CRUD
    handleAction = async (req: Request, res: Response) => {
        const action = req.body.action;
        const id = req.body.id ? parseInt(req.body.id, 10) : null;

        try {
            switch (action) {
                case 'getAll':
                    const allRecords = await this.service.getAll();
                    res.json(allRecords);
                    break;

                case 'getById':
                    if (id === null) {
                        return res.status(400).json({ error: 'ID is required for getById.' });
                    }
                    const record = await this.service.getById(id);
                    if (record) {
                        res.json(record);
                    } else {
                        res.status(404).json({ error: 'Record not found.' });
                    }
                    break;

                case 'create':
                    const newRecord = await this.service.create(req.body);
                    res.status(201).json({ id: newRecord.insertId });
                    break;

                case 'update':
                    if (id === null) {
                        return res.status(400).json({ error: 'ID is required for update.' });
                    }
                    await this.service.update(id, req.body);
                    res.status(204).send();
                    break;

                case 'delete':
                    if (id === null) {
                        return res.status(400).json({ error: 'ID is required for delete.' });
                    }
                    await this.service.delete(id);
                    res.status(204).send();
                    break;

                default:
                    res.status(400).json({ error: 'Invalid action.' });
            }
        } catch (error) {
            console.error('Error in handleAction:', error);
            const errorMessage = (error as Error).message || 'An error occurred.';
            res.status(500).json({ error: errorMessage });
        }
    }

    /**
     * Genera y envía el PDF de la Hoja de Vida del Paciente.
     */
    generateHojaVidaPDF = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);
        console.log(`Generando PDF para Hoja de Vida con ID: ${id}`);

        if (isNaN(id)) {
            console.log('ID inválido proporcionado.');
            return res.status(400).json({ error: 'ID inválido.' });
        }

        try {
            const pdfBuffer = await this.service.generarHojaVidaPDF(id);
            console.log('PDF generado exitosamente.');

            // Configurar los encabezados de la respuesta para la descarga del PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=HojaVida_Paciente_${id}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error generando la Hoja de Vida:', error);

            if (error instanceof BadRequestError) {
                return res.status(400).json({ success: false, message: error.message });
            } else if (error instanceof InternalServerError) {
                return res.status(500).json({ success: false, message: error.message });
            } else {
                return res.status(500).json({ success: false, message: 'Error generando la Hoja de Vida.' });
            }
        }
    };
}
