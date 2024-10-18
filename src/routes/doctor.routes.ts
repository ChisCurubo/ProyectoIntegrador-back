import express from 'express';
import DoctorController from '../controllers/doctor.controller';

const router = express.Router();

// Crear Orden Médica
router.post('/orden-medica', DoctorController.crearOrdenMedica);
// Pacientes asignados al Doctor
router.get('/pacientesPrueba/:idDoctor', DoctorController.pacientesAsignadosAlDoctor);
// Actualizar una orden médica por ID
router.put('/orden-medica/:idOrden_Medica', DoctorController.editarOrdenMedicaPorId);

// Ver Pacientes que Atenderá
router.get('/pacientes/:idDoctor', DoctorController.verPacientesQueAtendera); 

// Obtener una historia clínica por ID
router.get('/historia-clinica/:idHistoria_Medica', DoctorController.obtenerOrdenMedicaPorIdCita);

// Obtener una orden médica por ID de Cita
router.get('/orden-medica/cita/:idCita', DoctorController.obtenerOrdenMedicaPorIdCita);



router.get('/ordenesimportantes/:cedula', DoctorController.obtenerOrdenesMedicasPorCedula);

router.get('/encolar/:idDoc', DoctorController.enqueueDoctor )
router.get('/pop', DoctorController.popDoctor )


export default router;
