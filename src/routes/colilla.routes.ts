import express from 'express';
import { generarColilla } from '../controllers/colilla.controller';

const router = express.Router();

router.post('/generarColilla', generarColilla);

export default router;