import express from 'express';
import { hojaDeVida, hojaDeVidaPDF } from '../controllers/hojaVida.controller';

const router = express.Router();

// Ruta 
router.post('/createHojaVida', hojaDeVida);

// Ruta 
router.get('/hojaVida/:id', hojaDeVidaPDF);

export default router;