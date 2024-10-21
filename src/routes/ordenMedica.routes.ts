import { Router } from 'express';
import OrdenMedicaController from '../controllers/ordenMedica.controller';

const router = Router();

// Ruta para crear una nueva orden médica (POST)
router.post('/create', OrdenMedicaController.createOrdenMedica);

// Ruta para obtener una orden médica por ID (GET)
router.get('/get/:id', OrdenMedicaController.getOrdenMedica);

// Ruta para actualizar una orden médica por ID (PUT)
router.put('/update/:id', OrdenMedicaController.updateOrdenMedica);

export default router;
