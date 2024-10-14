
// src/routes/hojaVidaPacientes.routes.ts
import express from 'express';
import { HojaVidaPacientesController } from '../controllers/hojaVidaPacientes.controller';

const router = express.Router();
const controller = new HojaVidaPacientesController();

// Ruta para manejar acciones CRUD 
router.post('/', controller.handleAction);

// Ruta para generar y descargar el PDF de la Hoja de Vida del Paciente 
router.get('/:id/pdf', controller.generateHojaVidaPDF);

// Ruta de prueba
router.get('/test', (req: express.Request, res: express.Response) => {
    res.send('Ruta de prueba funcionando correctamente.');
});

export default router;
