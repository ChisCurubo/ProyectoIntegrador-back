import { Request, Response } from 'express';
import CitaService from '../services/citas.service'; // Ajusta la ruta de acuerdo a tu estructura

export class CitasController {
    private citaService: CitaService;

    constructor() {
        this.citaService = new CitaService();
    }

    public getCitas = async (req: Request, res: Response): Promise<void> => {
        try {
            //const citas = await this.citaService.getAllCitas();
            //console.log('GET /HistoriaClinicaMedico/citas - Response:', citas);
            //res.status(200).json(citas);
        } catch (error) {
            console.error('Error en GET /HistoriaClinicaMedico/citas:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
    public testBD = async (req: Request, res: Response): Promise<void> => {
        try {
            const citas = await this.citaService.testConnection();
            console.log('post /HistoriaClinicaMedico/test - Response:', citas);
            res.status(200).json(citas);
        } catch (error) {
            console.error('Error en post /HistoriaClinicaMedico/citas:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    public createCita = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('POST /HistoriaClinicaMedico/crearCita - Request Body:', req.body);
            //const cita = await this.citaService.createCita(req.body);
            //console.log('POST /HistoriaClinicaMedico/crearCita - Response:', cita);
            //res.status(201).json(cita);
        } catch (error) {
            console.error('Error en POST /HistoriaClinicaMedico/crearCita:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
}

export default CitasController;