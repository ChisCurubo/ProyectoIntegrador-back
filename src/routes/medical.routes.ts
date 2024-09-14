import express from 'express';
import MedicalController from '../controllers/medical.controller';

const router = express.Router();

// Mostrar el Historial Clínico en HTML
router.get('/historial-clinico', MedicalController.renderHistorialClinicoPage);

// Mostrar la Orden Médica en HTML
router.get('/orden-medica', MedicalController.renderOrdenMedicaPage);

export default router;
