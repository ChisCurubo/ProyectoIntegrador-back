import { Router } from 'express';
import OrdenMedicaController from '../controllers/ordenMedica.controller';

const router = Router();
const ordenMedicaController = new OrdenMedicaController();

// Ruta para crear una nueva orden médica (POST)
router.post('/', ordenMedicaController.createOrdenMedica);

// Ruta para obtener una orden médica por ID (GET)
router.get('/:id', ordenMedicaController.getOrdenMedica);

// Ruta para actualizar una orden médica por ID (PUT)
router.put('/:id', ordenMedicaController.updateOrdenMedica);

export default router;
