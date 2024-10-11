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
router.delete('/deleteCitaAll/:idCita/:idUsuario', citasController.deleteCitas);
router.delete('/deleteCitaId/:idCita', citasController.deleteCitasID);
router.delete('/deleteCitaUser/:idUsuario', citasController.deleteCitasUser);

// Seleccionar citas por idUsuario (con POST)
router.get('/getCitaUser', citasController.getCitasUser);

// Seleccionar citas solo por médico (con POST)
router.get('/getCitaDoc', citasController.getCitasDoc);

router.get('/getCItaId', citasController.getCitasId);

router.get('/getCitasWithPatientsAndDoctors', citasController.getCitasWithPatientsAndDoctors);

router.get('/metodoDetalladoParaAgendarCitas', citasController.metodoDetalladoParaAgendarCitas);

// Ruta para obtener citas con pacientes y doctores
router.get('pacientesdoctores/:cedula', CitasController.getCitasWithPatientsAndDoctorsByCC);
router.get('/pacientes-y-doctores/:cedula', CitasController.getCitasWithPatientsAndDoctorsByCC);
// Ruta para obtener citas detalladas para agendar por cédula
router.get('/Reagendar/:cedula', CitasController.getCitasDetalladasParaAgendarByCC);
router.delete('/citas/:idCita', CitasController.deleteCitaById); 
router.get('/obtenercitas/:idUsuarioCC', CitasController.obtenerCitasDetalladasPorId);
router.post('/horario', citasController.viewSchedule)

router.post('/horario', citasController.viewSchedule)

export default router;
