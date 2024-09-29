// citas.routes.ts
import { Router } from 'express';
import { CitasController } from '../controllers/citas.controller';

const router = Router();
const citasController = new CitasController();

// Insertar una cita
router.post('/insertCita', citasController.createCita);

// Editar fecha y día de una cita por id de cita (con POST)
router.put('/updateCita-date', citasController.updateDateCita);

// Editar estado de la cita (con POST)
router.put('/updateCita-status/:idCita', citasController.updateStatusCita);

// Editar todos los campos de una cita por id de usuario o id de cita (con POST)
router.put('/updateCita-all', citasController.updateCitasAll);

// Borrar una cita por id del usuario y id de cita (con POST)
router.delete('/deleteCita/:idCita/:idUsuario', citasController.deleteCitas);

// Seleccionar citas por idUsuario (con POST)
router.get('/getCitaUser', citasController.getCitasUser);

// Seleccionar citas solo por médico (con POST)
router.get('/getCitaDoc', citasController.getCitasDoc);

router.get('/getCItaId', citasController.getCitasId);

export default router;
