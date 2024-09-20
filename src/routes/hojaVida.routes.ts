import express from 'express';
import { hojaDeVida, hojaDeVidaPDF } from '../controllers/hojaVida.controller';

const router = express.Router();

// Ruta 
router.post('/crearHistorial', hojaDeVida);

// Ruta 
router.get('/historial/:id', hojaDeVidaPDF);

export default router;