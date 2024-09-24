import { Router } from 'express';
import { HojaVidaPacientesController } from '../controllers/hojaVidaPacientes.controller';

const router = Router();
const controller = new HojaVidaPacientesController();

// Usar la función de acción del controlador para manejar las solicitudes POST
router.post('/', controller.handleAction);

export default router;