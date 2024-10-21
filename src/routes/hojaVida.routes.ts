
import { Router } from 'express';
import HojaVidaController from '../controllers/hojaVida.controller';

const router = Router();

router.get('/id/:id', HojaVidaController.getHojaVidaById);  // Obtener por ID
router.get('/cc/:cc', HojaVidaController.getHojaVidaByCC);  // Obtener por CC
router.put('/id/:id', HojaVidaController.updateHojaVida);   // Actualizar por ID
router.get('/id/:id/pdf', HojaVidaController.generateHojaVidaPDF); // Generar PDF por ID
router.get('/cc/:cc/pdf', HojaVidaController.generateHojaVidaPDF); // Generar PDF por CC

export default router;
