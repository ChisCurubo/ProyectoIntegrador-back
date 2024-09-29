import express from 'express';
import ApiSedes from '../controllers/api.sedes.controller';
import {validateSedes} from'../services/auth.service';

const router = express.Router();


/**
 * Rutas del Usuario 
 * para las conexiones de otras sedes
 */
router.get('/getUserCC/:CC', ApiSedes.getUserCCApiSede );
// Obtiene la información del usuario a través de su número de cédula (CC).

router.post('/insertUser', ApiSedes.insertUserApiSede );
// Inserta un nuevo usuario en la base de datos.

/**
 * Rutas para las citas 
 * para conexiones de otras sedes
 */
router.post('/insertCita', ApiSedes.insertCitaApiSede );
// Crea una nueva cita en el sistema.

router.get('/getCitaCCUser/:idUsuario', ApiSedes.getCitaCCUserApiSede );
// Obtiene citas asociadas a un usuario mediante su número de cédula (CC).

router.get('/getCitaCCDoc/:idDoc', ApiSedes.getCitaCCDocApiSede );
// Obtiene citas asociadas a un doctor mediante su número de cédula (CC).

router.get('/getCitaId/:idCita', ApiSedes.getCitaIdApiSede );
// Obtiene información de una cita específica mediante su ID.

/**
 * Rutas para las hojas de vida
 * para conexiones de otras sedes
 */
router.post('/insertHojaVida', ApiSedes.insertHojaVidaApiSede );
// Inserta una nueva hoja de vida en el sistema.

router.get('/getHojaVida/:idHoja', ApiSedes.getHojaVidaApiSede );
// Obtiene la hoja de vida de un usuario.

/**
 * Rutas para la historia Medica
 * para conexiones de otras sedes
 */
router.post('/insertHistoriaMedica', ApiSedes.insertHistoriaMedicaApiSede );
// Inserta una nueva historia médica en el sistema.

router.get('/getHistoriaMedica/:idHistoria', ApiSedes.getHistoriaMedicaApiSede );
// Obtiene la historia médica de un paciente.

/**
 * Rutas para la Orden Medica
 * para conexiones de otras sedes
 */
router.post('/insertOrdenMedica', ApiSedes.insertOrdenMedicaApiSede );
// Inserta una nueva orden médica en el sistema.

router.get('/getOrdenMedica/:idOrden', ApiSedes.getOrdenMedicaApiSede );
// Obtiene una orden médica específica.

/**
 * Rutas para las autorizaciones médicas
 * para conexiones de otras sedes
 */
router.post('/insertAutorizacionMedica', ApiSedes.insertAutorizacionMedicaApiSede );
// Inserta una nueva autorización médica en el sistema.

router.get('/getAutorizacionMedica/:idAutorizacion', ApiSedes.getAutorizacionMedicaApiSede );
// Obtiene una autorización médica específica.

export default router;
