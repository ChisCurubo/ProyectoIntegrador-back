import { Router } from 'express';
import HistoriaClinicaController from '../controllers/historialClinico.controller';

const router = Router();

// Obtener todas las historias clínicas
router.get('/getHistorias-clinicas', HistoriaClinicaController.getHistoriasClinicas);

// Obtener una historia clínica por ID
router.get('/getHistorias-clinicas/:id', HistoriaClinicaController.getHistoriaClinicaById);

// Crear una nueva historia clínica
router.post('/createHistorias-clinicas', HistoriaClinicaController.createHistoriaClinica);

// Actualizar una historia clínica por ID
router.put('/updateHistorias-clinicas/:id', HistoriaClinicaController.updateHistoriaClinicaById);

// Eliminar una historia clínica por ID
router.delete('/deleteHistorias-clinicas/:id', HistoriaClinicaController.deleteHistoriaClinicaById);

export default router;
