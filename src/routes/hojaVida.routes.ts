import { Router } from 'express';
import  HojaVidaContoller  from '../controllers/hojaVida.controller';

const router = Router();


// Usar la función de acción del controlador para manejar las solicitudes POST
router.post('/hvEmpleado', HojaVidaContoller.handleActionEmpleado);


// Usar la función de acción del controlador para manejar las solicitudes POST
router.post('/hvPaciente', HojaVidaContoller.handleActionPaciente);

export default router;