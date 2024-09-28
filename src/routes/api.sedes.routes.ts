import express from 'express';
import ApiSedes from '../controllers/api.sedes.controller';

const router = express.Router();

/**
 * Rutas del Usuario 
 * para las conexiones de otras sedes
 */
router.post('/getUserCC', ApiSedes.getUserCCApiSede );
// Obtiene la información del usuario a través de su número de cédula (CC).

router.post('/insertUser', ApiSedes.insertUserApiSede );
// Inserta un nuevo usuario en la base de datos.

/**
 * Rutas para las citas 
 * para conexiones de otras sedes
 */
router.post('/insertCita', ApiSedes.insertCitaApiSede );
// Crea una nueva cita en el sistema.

router.post('/getCitaCCUser', ApiSedes.getCitaCCUserApiSede );
// Obtiene citas asociadas a un usuario mediante su número de cédula (CC).

router.post('/getCitaCCDoc', ApiSedes.getCitaCCDocApiSede );
// Obtiene citas asociadas a un doctor mediante su número de cédula (CC).

router.post('/getCitaId', ApiSedes.getCitaIdApiSede );
// Obtiene información de una cita específica mediante su ID.

/**
 * Rutas para las hojas de vida
 * para conexiones de otras sedes
 */
router.post('/insertHojaVida', ApiSedes.insertHojaVidaApiSede );
// Inserta una nueva hoja de vida en el sistema.

router.post('/getHojaVida', ApiSedes.getHojaVidaApiSede );
// Obtiene la hoja de vida de un usuario.

/**
 * Rutas para la historia Medica
 * para conexiones de otras sedes
 */
router.post('/insertHistoriaMedica', ApiSedes.insertHistoriaMedicaApiSede );
// Inserta una nueva historia médica en el sistema.

router.post('/getHistoriaMedica', ApiSedes.getHistoriaMedicaApiSede );
// Obtiene la historia médica de un paciente.

/**
 * Rutas para la Orden Medica
 * para conexiones de otras sedes
 */
router.post('/insertOrdenMedica', ApiSedes.insertOrdenMedicaApiSede );
// Inserta una nueva orden médica en el sistema.

router.post('/getOrdenMedica', ApiSedes.getOrdenMedicaApiSede );
// Obtiene una orden médica específica.

/**
 * Rutas para las autorizaciones medicas
 * para conexiones de otras sedes
 */
router.post('/insertAutorizacionMedica', ApiSedes.insertAutorizacionMedicaApiSede );
// Inserta una nueva autorización médica en el sistema.

router.post('/getAutorizacionMedica', ApiSedes.getAutorizacionMedicaApiSede );
// Obtiene una autorización médica específica.

export default router;
