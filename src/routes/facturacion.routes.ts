import express from 'express';
import { checkBill, generateBill, updateBill } from '../controllers/facturacion.controller';

const router = express.Router();

// Ruta para verificar si ya existe una factura
router.post('/checkBill', checkBill);

// Ruta para generar una nueva factura
router.post('/generateBill', generateBill);

// Ruta para actualizar una factura existente
router.put('/updateBill', updateBill);

export default router;