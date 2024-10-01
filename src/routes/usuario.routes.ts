import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller';

const router = Router();

// Obtener todos los usuarios
router.get('/getUsers', UsuarioController.getUsersController);

// Obtener un usuario por cédula (CC)
router.get('/getByCCUsers/:CC', UsuarioController.getUsersByCCcontroler);

// Crear un nuevo usuario
router.post('/createUser', UsuarioController.createUserController);

// Actualizar un usuario existente por cédula (CC)
router.put('/UpdateUser/:CC', UsuarioController.updateUserCCcontroler);

// Eliminar un usuario por cédula (CC)
router.delete('/deleteUser/:CC', UsuarioController.deleteUserCCcontroller);


// iniciar sesion por email y contraseña
//router.post('/iniciarSesion', UsuarioController.iniciarSesion);

export default router;
