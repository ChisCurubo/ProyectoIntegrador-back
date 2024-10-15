import { Router } from 'express';
import CrudMercadoPagoController from '../controllers/crudMercadoPago.Controller';

const router = Router();

// Ruta para crear un pago con la colilla
router.post('/pago', CrudMercadoPagoController.crearPago.bind(CrudMercadoPagoController));

// Puedes añadir otras rutas según sea necesario

export default router;
