// citas.routes.ts
import { Router } from 'express';
import { CitasController } from '../controllers/citas.controller';

const router = Router();
const citasController = new CitasController();

// Insertar una cita
router.post('/insertCita', citasController.createCita);

// Editar fecha y hora de una cita por id de cita
router.put('/updateCita-date', citasController.updateDateCita);

// Editar estado de una cita por id de cita
router.put('/updateCita-status/:idCita', citasController.updateStatusCita);

// Editar todos los campos de una cita por id de usuario y id de cita
router.put('/updateCita-all', citasController.updateCitasAll);

// Borrar una cita por id del usuario y id de cita
router.delete('/deleteCitaAll/:idCita/:idUsuario', citasController.deleteCitas);

// Borrar una cita por id de cita
router.delete('/deleteCitaId/:idCita', citasController.deleteCitasID);

// Borrar todas las citas de un usuario por id de usuario
router.delete('/deleteCitaUser/:idUsuario', citasController.deleteCitasUser);

// Seleccionar citas por idUsuario
router.get('/getCitaUser/:idUsuario', citasController.getCitasUser);

// Seleccionar citas solo por médico (idDoc)
router.get('/getCitaDoc/:idDoctor', citasController.getCitasDoc);

// Seleccionar cita por idCita
router.get('/getCitaId/:idCita', citasController.getCitasId);

// Obtener todas las citas con pacientes y doctores
router.get('/getCitasWithPatientsAndDoctors', citasController.getCitasWithPatientsAndDoctors);

// Método detallado para agendar citas
router.get('/metodoDetalladoParaAgendarCitas', citasController.metodoDetalladoParaAgendarCitas);

// Borrar una cita por idCita
router.delete('/citas/:idCita', CitasController.deleteCitaById);

// Obtener citas detalladas por id de usuario (idUsuarioCC)
router.get('/obtenercitas/:idUsuarioCC', CitasController.obtenerCitasDetalladasPorId);

export default router;
