// citas.routes.ts
import { Router } from 'express';
import { CitasController } from '../controllers/citas.controller';

const router = Router();
const citasController = new CitasController();

// Insertar una cita
router.post('/insertCita', citasController.createCita);

// Editar fecha y día de una cita por id de cita (con POST)
router.post('/updateCita-date', citasController.updateDateCita);

// Editar estado de la cita (con POST)
router.post('/updateCita-status', citasController.updateStatusCita);

// Editar todos los campos de una cita por id de usuario o id de cita (con POST)
router.post('/updateCita-all', citasController.updateCitasAll);

// Borrar una cita por id del usuario y id de cita (con POST)
router.post('/deleteCita', citasController.deleteCitas);

// Seleccionar citas por idUsuario (con POST)
router.post('/getCitaUser', citasController.getCitasUser);

// Seleccionar citas solo por médico (con POST)
router.post('/getCitaDoc', citasController.getCitasDoc);

router.post('/getCItaId', citasController.getCitasId);

export default router;
