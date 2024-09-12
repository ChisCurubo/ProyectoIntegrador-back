// citas.routes.ts
import { Router } from 'express';
import { CitasController } from '../controllers/citas.controller';

const router = Router();
const citasController = new CitasController();

// Insertar una cita
router.post('/insertar', citasController.insertarCita);

// Editar fecha y día de una cita por id de cita (con POST)
router.post('/editar-fecha', citasController.editarFechaHoraCita);

// Editar estado de la cita (con POST)
router.post('/editar-estado', citasController.editarEstadoCita);

// Editar todos los campos de una cita por id de usuario o id de cita (con POST)
router.post('/editar-todos', citasController.editarCitaCompleta);

// Borrar una cita por id del usuario y id de cita (con POST)
router.post('/borrar', citasController.borrarCita);

// Seleccionar citas por idUsuario (con POST)
router.post('/consultar', citasController.obtenerCitasPorUsuario);

// Seleccionar citas solo por médico (con POST)
router.post('/consultar-medico', citasController.obtenerCitasPorMedico);

export default router;
