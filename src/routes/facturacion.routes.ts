import express from 'express';
import { generarFactura } from '../controllers/facturacion.controller';

const router = express.Router();

router.post('/generarFactura', generarFactura);

export default router;
