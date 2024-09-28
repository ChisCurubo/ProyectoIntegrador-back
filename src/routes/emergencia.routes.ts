// routes/emergencia.routes.ts

import { Router } from 'express';
import EmergenciaController from '../controllers/EmergenciaController';

const router = Router();
const emergenciaController = new EmergenciaController();

// Crear una nueva emergencia
router.post('/emergencias', emergenciaController.createEmergencia);

// Obtener una emergencia por ID
router.get('/emergencias/:id', emergenciaController.getEmergencia);

// Actualizar una emergencia por ID
router.put('/emergencias/:id', emergenciaController.updateEmergencia);

// Actualizar solo el estado de una emergencia
router.patch('/emergencias/:id/estado', emergenciaController.updateEstadoEmergencia);

// Obtener las emergencias ordenadas por prioridad
router.get('/emergencias-prioridad', emergenciaController.getEmergenciasPrioridad);

export default router;
