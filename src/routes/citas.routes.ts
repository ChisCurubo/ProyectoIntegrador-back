import express, { Request, Response } from 'express';
import CitasController from '../controllers/citas.controller'; // Ajusta la ruta según la ubicación de tu archivo de controlador

const router = express.Router();
const citasController = new CitasController();

// Ruta POST para crear una nueva cita médica
router.post('/crearCita', citasController.createCita);

// Ruta GET para obtener todas las citas médicas
router.get('/citas', citasController.getCitas);

export default router;
