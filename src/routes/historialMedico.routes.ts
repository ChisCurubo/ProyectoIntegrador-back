import express from 'express';
import HistorialClinicoController from '../controllers/historialMedico.controller';

const router = express.Router();
const historialClinicoController = new HistorialClinicoController();

// Ruta para crear un nuevo historial clínico
router.post('/crearHistorial', historialClinicoController.createHistorialClinico);

// Ruta para obtener un historial clínico por ID
router.get('/historial/:id', historialClinicoController.getHistorialClinico);

export default router;
