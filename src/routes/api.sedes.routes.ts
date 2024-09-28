import express from 'express';
import ApiSedes from '../controllers/api.sedes.controller';

const router = express.Router();

/**
 * Rutas del Usuario 
 * para las conexiones de otras sedes
 */
router.post('/getUserCC', ApiSedes.getUserCCApiSede );
router.post('/insertUser', ApiSedes.insertUserApiSede );

/**
 * Rutas para las citas 
 * para conexiones de otras sedes
 */
router.post('/insertCita', ApiSedes.insertCitaApiSede );
router.post('/getCitaCCUser', ApiSedes.getCitaCCUserApiSede );
router.post('/getCitaCCDoc', ApiSedes.getCitaCCDocApiSede );
router.post('/getCitaId', ApiSedes.getCitaIdApiSede );

/**
 * Rutas para las hojas de vida
 * para conexiones de otras sedes
 */
router.post('/insertHojaVida', ApiSedes.insertHojaVidaApiSede );
router.post('/getHojaVida', ApiSedes.getHojaVidaApiSede );

/**
 * Rutas para la historia Medica
 * para conexiones de otras sedes
 */
router.post('/insertHistoriaMedica', ApiSedes.insertHistoriaMedicaApiSede );
router.post('/getHistoriaMedica', ApiSedes.getHistoriaMedicaApiSede );

/**
 * Rutas para la Orden Medica
 * para conexiones de otras sedes
 */
router.post('/insertOrdenMedica', ApiSedes.insertOrdenMedicaApiSede );
router.post('/getOrdenMedica', ApiSedes.getOrdenMedicaApiSede );

/**
 * Rutas para las autorizaciones medicas
 * para conexiones de otras sedes
 */
router.post('/insertAutorizacionMedica', ApiSedes.insertAutorizacionMedicaApiSede );
router.post('/getAutorizacionMedica', ApiSedes.getAutorizacionMedicaApiSede );

export default router;
