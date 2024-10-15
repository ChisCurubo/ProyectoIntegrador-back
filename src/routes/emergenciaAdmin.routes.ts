import express from 'express';
import AdminController from '../controllers/emergenciaAdmin.contollerr';

const router = express.Router();

// Emergencia routes
router.get('/emergencias', AdminController.getAllEmergencias);
router.get('/emergencias/:id', AdminController.getEmergencia1ById);
router.post('/emergencias', AdminController.createEmergencia);
router.delete('/emergencias/:id', AdminController.deleteEmergenciaById);


router.get('/Gtemergencias/:idEmergencia', AdminController.getEmergenciaById); // Obtener emergencia por ID
router.put('/Upemergencias/:idEmergencia', AdminController.updateEmergencia); // Actualizar emergencia por ID
router.patch('/Paemergencias/:idEmergencia/estado', AdminController.updateEstadoEmergencia); // Actualizar estado de emergencia
router.get('/emergencias-prioridad', AdminController.getEmergenciasPorPrioridad); // Obtener emergencias por prioridad

// Rutas para las emergencias-citas
router.post('/Psemergencias-citas', AdminController.createEmergenciaCita); // Crear una nueva emergencia-cita
router.get('/Gtemergencias-citas/:idEmergenciaCita', AdminController.getEmergenciaCitaById); // Obtener emergencia-cita por ID
router.get('/Gtemergencias-citas', AdminController.getAllEmergenciasCitas); // Obtener todas las emergencias-citas
router.put('/Ptemergencias-citas/:idEmergenciaCita', AdminController.updateEmergenciaCita); // Actualizar emergencia-cita por ID
router.delete('/Demergencias-citas/:idEmergenciaCita', AdminController.deleteEmergenciaCita); // Eliminar emergencia-cita por ID




// Citas routes
router.post('/citas', AdminController.createCita);
router.post('/citas/historial', AdminController.createCitaHistorial);
router.put('/citas/:idCita/fecha', AdminController.updateDateCita);
router.put('/citas/:idCita/estado', AdminController.updateStatusCita);
router.put('/citas/:idCita', AdminController.updateCitasAll);
router.delete('/citas/:idCita/:idUsuario', AdminController.deleteCitas);
router.get('/citas/usuario/:idUsuario', AdminController.getCitasUser);
router.get('/citas/doctor/:idDocCC', AdminController.getCitasDoc);
router.get('/citas/:idCita', AdminController.getCitasId);

//Citas routes
router.post('/citas', AdminController.createCita);
router.put('/citas/:idCita/date', AdminController.updateDateCita);
router.put('/citas/:idCita/status', AdminController.updateStatusCita);
router.put('/citas/:idCita', AdminController.updateCitasAll);
router.delete('/citas/:idCita/:idUsuario', AdminController.deleteCitas);
router.get('/citas/user/:idUsuario', AdminController.getCitasUser);
router.get('/citas/doctor/:idDoc', AdminController.getCitasDoc);
router.get('/citas/:idCita', AdminController.getCitasId);


// Auditoría routes
router.get('/auditorias/colilla-pago', AdminController.getAllAudColillaPago);
router.get('/auditorias/factura-electronica', AdminController.getAllAudFacturaElectronica);
router.get('/auditorias/historia-medica', AdminController.getAllAudHistoriaMedica);
router.get('/auditorias/hojas-vida', AdminController.getAllAudHojasVida);
router.get('/auditorias/usuarios', AdminController.getAllAudUsuarios);
router.get('/auditorias/sedes', AdminController.getAllAudSedes);

// Autorizaciones médicas route
router.get('/autorizaciones-medicas', AdminController.getAllAutorizacionesMedicas);

// Usuario routes
router.get('/usuarios', AdminController.obtenerUsuarios);
router.get('/usuarios/:CC', AdminController.obtenerUsuarioPorCedula);
router.post('/usuarios', AdminController.crearUsuario);
router.put('/usuarios/:CC', AdminController.actualizarUsuarioPorCedula);
router.delete('/usuarios/:CC', AdminController.eliminarUsuarioPorCedula);

// Inicio de sesión route
router.post('/login', AdminController.iniciarSesion);

export default router;