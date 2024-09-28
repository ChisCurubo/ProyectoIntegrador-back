import { Router } from 'express';
import ColillaPagoController from '../controllers/colillaPago.controller';  // Importamos el controlador

const router = Router();
router.post('/generatePayStub', ColillaPagoController.generatePayStub);
// Ruta para crear una nueva colilla de pago
router.post('/colillas', ColillaPagoController.crearColillaPago);

// Ruta para obtener una colilla de pago por su ID
router.get('/colillas/:id', ColillaPagoController.obtenerColillaPorId);

// Ruta para obtener todas las colillas de pago
router.get('/colillas', ColillaPagoController.obtenerTodasLasColillas);

// Ruta para eliminar una colilla de pago por su ID
router.delete('/colillas/:id', ColillaPagoController.eliminarColilla);

// Ruta para actualizar una colilla de pago por su ID
router.put('/colillas/:id', ColillaPagoController.actualizarColilla);

export default router;
