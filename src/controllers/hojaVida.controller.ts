import { Request, Response } from 'express';
import HojaVidaService from '../services/hojaVida.service';

export class HojaVidaContoller {


  // Usar una función de flecha para mantener el contexto de 'this'
  public async handleActionEmpleado (req: Request, res: Response){
    const action = req.body.action;
    console.log(action)
    const id = req.body.id ? parseInt(req.body.id, 10) : null;
    console.log(id)

    try {
      switch (action) {
        case 'getAll':
          const allRecords = await HojaVidaService.getAllEmployer();
          res.json(allRecords);
          break;

        case 'getById':
          if (id === null) {
            return res.status(400).json({ error: 'ID is required for getById.' });
          }
          const record = await HojaVidaService.getByIdEmployer(id);
          if (record) {
            res.json(record);
          } else {
            res.status(404).json({ error: 'Record not found.' });
          }
          break;

        case 'create':
          const newRecord = await HojaVidaService.createEmployer(req.body);
          res.status(201).json({ id: newRecord.insertId });
          break;

        case 'update':
          if (id === null) {
            return res.status(400).json({ error: 'ID is required for update.' });
          }
          await HojaVidaService.updateEmployer(id, req.body);
          res.status(204).send();
          break;

        case 'delete':
          if (id === null) {
            return res.status(400).json({ error: 'ID is required for delete.' });
          }
          await HojaVidaService.deleteEmployer(id);
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

  public async handleActionPaciente (req: Request, res: Response) {
    const action = req.body.action;
    console.log(action)
    const id = req.body.id ? parseInt(req.body.id, 10) : null;
    console.log(id)


    try {
      switch (action) {
        case 'getAll':
          const allRecords = await HojaVidaService.getAllPatient();
          res.json(allRecords);
          break;

        case 'getById':
        
          if (id === null) {
            return res.status(400).json({ error: 'ID is required for getById.' });
          }
          const record = await HojaVidaService.getByIdPatient(id);
          if (record) {
            res.json(record);
          } else {
            res.status(404).json({ error: 'Record not found.' });
          }
          break;

        case 'create':
          const newRecord = await HojaVidaService.createPatient(req.body);
          res.status(201).json({ id: newRecord.insertId });
          break;

        case 'update':
          if (id === null) {
            return res.status(400).json({ error: 'ID is required for update.' });
          }
          await HojaVidaService.updatePatient(id, req.body);
          res.status(204).send();
          break;

        case 'delete':
          if (id === null) {
            return res.status(400).json({ error: 'ID is required for delete.' });
          }
          await HojaVidaService.deletePatient(id);
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
export default new HojaVidaContoller();