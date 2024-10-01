import express from 'express';
import { generateBill } from '../controllers/facturacion.controller';

const router = express.Router();

router.post('/generateBill', generateBill);

export default router;
