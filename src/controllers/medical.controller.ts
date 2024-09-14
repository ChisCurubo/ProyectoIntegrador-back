import { Request, Response } from 'express';
import { join } from 'path';
import puppeteer from 'puppeteer';

class MedicalController {
    // Mostrar el HTML del Historial Clínico
    public renderHistorialClinicoPage(req: Request, res: Response) {
        const htmlPath = join(__dirname, '../views/HistorialClinico/historiaClinica.html');
        res.sendFile(htmlPath);
    }

    // Mostrar el HTML de la Orden Médica
    public renderOrdenMedicaPage(req: Request, res: Response) {
        const htmlPath = join(__dirname, '../views/OrdenMedica/ordenMedica.html');
        res.sendFile(htmlPath);
    }
}

export default new MedicalController();
