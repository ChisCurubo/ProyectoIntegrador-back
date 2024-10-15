import express from 'express';
import MercadoPagoController from '../controllers/mercadopagofront.controller';

const router = express.Router();

// Definir rutas
router.get('/colillas/cc/:cc', MercadoPagoController.getColillaPorCC);
router.get('/colillas/id/:idColilla', MercadoPagoController.getColillaPorId);
// Ruta para actualizar el estado de una colilla de pago
router.put('/colilla-Estado/:idColilla', MercadoPagoController.updateColillaPagoEstado);
export default router;
