import { Request, Response } from 'express';
import { HojaVidaEmpleadosService } from '../services/hojaVidaEmpleados.service';

export class HojaVidaPacientesController {
  private service = new HojaVidaEmpleadosService();

  // Usar una función de flecha para mantener el contexto de 'this'
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
}