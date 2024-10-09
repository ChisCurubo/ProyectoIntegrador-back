// citas.routes.ts
import { Router } from 'express';
import { CitasController } from '../controllers/citas.controller';

const router = Router();
const citasController = new CitasController();

// Insertar una cita
router.post('/insertCita', citasController.createCita);

// Editar fecha y día de una cita por id de cita (con POST)
router.put('/updateCita-date/:idCita', citasController.updateDateCita);

// Editar estado de la cita (con POST)
router.put('/updateCita-status/:idCita', citasController.updateStatusCita);

// Editar todos los campos de una cita por id de usuario o id de cita (con POST)
router.put('/updateCita-all', citasController.updateCitasAll);

// Borrar una cita por id del usuario y id de cita (con POST)
router.delete('/deleteCitaAll/:idCita/:idUsuario', citasController.deleteCitas);
router.delete('/deleteCitaId/:idCita', citasController.deleteCitasID);
router.delete('/deleteCitaUser/:idUsuario', citasController.deleteCitasUser);

// Seleccionar citas por idUsuario (con POST)
router.get('/getCitaUser', citasController.getCitasUser);

// Seleccionar citas solo por médico (con POST)
router.get('/getCitaDoc/:idDoc', citasController.getCitasDoc);

router.get('/getCItaId/:idCita', citasController.getCitasId);

router.post('/horario', citasController.viewSchedule)

export default router;
