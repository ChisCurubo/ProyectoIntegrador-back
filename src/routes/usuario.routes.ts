import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller';

const router = Router();



// Obtener todos los usuarios
router.get('/obtenerusuarios', UsuarioController.getUsersController);

// Obtener un usuario por cédula (CC)
router.get('/obtenerporcedula/:CC', UsuarioController.getUsersByCCcontroler);

// Crear un nuevo usuario
router.post('/crearusuario', UsuarioController.createUserController);

// Actualizar un usuario existente por cédula (CC)
router.put('/actualizarusuario/:CC', UsuarioController.updateUserCCcontroler);

// Eliminar un usuario por cédula (CC)
router.delete('/eliminarusuario/:CC', UsuarioController.deleteUserCCcontroller);


// iniciar sesion por email y contraseña
//router.post('/iniciarSesion', UsuarioController.iniciarSesion);

export default router;
