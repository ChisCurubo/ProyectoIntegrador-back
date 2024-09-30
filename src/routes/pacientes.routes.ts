import express from 'express';
import PacientesController from '../controllers/pacientes.controller';

const router = express.Router();

// Ruta para obtener pacientes que atenderá el doctor
router.get('/pacientes/:idDoctor', PacientesController.pacientesQueAtendera);

export default router;
