import { Router } from 'express';
import HistoriaClinicaController from '../controllers/historialClinico.controller';

const router = Router();

// Obtener todas las historias clínicas
router.get('/', HistoriaClinicaController.obtenerHistoriasClinicas);

// Obtener una historia clínica por id
router.get('/:id', HistoriaClinicaController.obtenerHistoriaClinicaPorId);

// Crear una nueva historia clínica
router.post('/', HistoriaClinicaController.crearHistoriaClinica);

// Actualizar una historia clínica por id
router.put('/:id', HistoriaClinicaController.actualizarHistoriaClinicaPorId);

// Eliminar una historia clínica por id
router.delete('/:id', HistoriaClinicaController.eliminarHistoriaClinicaPorId);

export default router;
