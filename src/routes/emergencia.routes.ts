// routes/emergencia.routes.ts

import { Router } from 'express';
import EmergenciaController from '../controllers/EmergenciaController';

const router = Router();
// Crear una nueva emergencia
router.post('/emergencias', EmergenciaController.createEmergencia);

// Obtener una emergencia por ID
router.get('/emergencias/:id', EmergenciaController.getEmergencia);

// Actualizar una emergencia por ID
router.put('/emergencias/:id', EmergenciaController.updateEmergencia);

// Actualizar solo el estado de una emergencia
router.patch('/emergencias/:id/estado', EmergenciaController.updateEstadoEmergencia);

// Obtener las emergencias ordenadas por prioridad
router.get('/emergencias-prioridad', EmergenciaController.getEmergenciasPrioridad);


router.post('/createEmegenciaCita', EmergenciaController.createEmergenciaCita);
router.get('/getAllEmergenciaCita', EmergenciaController.findAllEmergenciaCita);
router.get('/getByIdEmergenciaCita/:id', EmergenciaController.findOneEmergenciaCita);
router.put('/:id', EmergenciaController.updateEmergenciaCita);
router.delete('/:id', EmergenciaController.deleteEmergenciaCita);

export default router;
