import { Router } from 'express';
import { HojaVidaEmpleadosController } from '../controllers/hojaVidaEmpleados.controller';

const router = Router();
const controller = new HojaVidaEmpleadosController();

// Usar la función de acción del controlador para manejar las solicitudes POST
router.post('/', controller.handleAction);

export default router;