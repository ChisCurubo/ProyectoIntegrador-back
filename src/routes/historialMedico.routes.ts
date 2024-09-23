import express from 'express';
import HistorialClinicoController from '../controllers/historialMedico.controller';

const router = express.Router();
const historialClinicoController = new HistorialClinicoController();

// Ruta para crear un nuevo historial clínico
router.post('/crrateHistorial', historialClinicoController.createHistorialClinico);

router.post('/getPDFHC');

// Ruta para obtener un historial clínico por ID
router.get('/historialMedico/:id', historialClinicoController.getHistorialClinico);

export default router;
