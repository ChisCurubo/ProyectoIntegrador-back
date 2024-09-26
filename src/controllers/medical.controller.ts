import { Request, Response } from 'express';
import { join } from 'path';
import puppeteer from 'puppeteer';
import { InternalServerError } from '../middlewares/customErrors';

class MedicalController {
    // Mostrar el HTML del Historial Clínico
    public renderHistorialClinicoPage = (req: Request, res: Response) => {
        try {
            const htmlPath = join(__dirname, '../views/HistorialClinico/historiaClinica.html');
            res.sendFile(htmlPath);
        } catch (error) {
            console.error('Error al mostrar la página de Historial Clínico:', error);
            throw new InternalServerError('Error al cargar la página de Historial Clínico.');
        }
    }

    // Mostrar el HTML de la Orden Médica
    public renderOrdenMedicaPage = (req: Request, res: Response) => {
        try {
            const htmlPath = join(__dirname, '../views/OrdenMedica/ordenMedica.html');
            res.sendFile(htmlPath);
        } catch (error) {
            console.error('Error al mostrar la página de Orden Médica:', error);
            throw new InternalServerError('Error al cargar la página de Orden Médica.');
        }
    } 
}

export default new MedicalController();
