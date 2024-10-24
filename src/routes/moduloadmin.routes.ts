import { Router } from 'express';
import ModuloAdminController from '../controllers/moduloAdmin.controller';
import {sendEmail} from "../mailer/nodeMailer";

const router = Router();

router.get('/doctor/:cedula', ModuloAdminController.obtenerDoctorPorCedula);
router.get('/ordenes-medicas/:cedula', ModuloAdminController.buscarOrdenesMedicasInformacionPorCedula);
router.get('/hoja-vida/:cedula', ModuloAdminController.obtenerHojaVidaPorCedula);
router.get('/colillas/:cedula', ModuloAdminController.obtenerColillasPorCedula);
router.get('/facturas/:cedula', ModuloAdminController.obtenerFacturasPorCedula);
router.get('/emergenciasdetalles', ModuloAdminController.obtenerTodasLasEmergencias);
router.get('/citas/:cedula', ModuloAdminController.obtenerCitasPorCedula);
router.get('/citas/completas/:cedula', ModuloAdminController.obtenerCitasCompletasPorCedula);
router.post('/crearHojaVida', ModuloAdminController.crearHojaVida);
router.get('/resumen-financiero', ModuloAdminController.obtenerResumenFinanciero);
router.get('/especialidades', ModuloAdminController.getSpecialties);
router.get('/services', ModuloAdminController.getServices);

router.get('/resumen-crm', ModuloAdminController.obtenerResumenCRM);
router.get('/citas-por-especialidad', ModuloAdminController.obtenerCitasPorEspecialidad);

router.post('/send-email', sendEmail);



export default router;
