import { Router } from 'express';
import OrdenMedicaController from '../controllers/ordenMedica.controller';

const router = Router();

// Ruta para crear una nueva orden médica (POST)
router.post('/', OrdenMedicaController.createOrdenMedica);

// Ruta para obtener una orden médica por ID (GET)
router.get('/:id', OrdenMedicaController.getOrdenMedica);

// Ruta para actualizar una orden médica por ID (PUT)
router.put('/:id', OrdenMedicaController.updateOrdenMedica);

export default router;
