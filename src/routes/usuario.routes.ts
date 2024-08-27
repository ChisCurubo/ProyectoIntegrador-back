import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller';

const router = Router();

// Obtener todos los usuarios
router.get('/obtenerusuarios', UsuarioController.obtenerUsuarios);

// Obtener un usuario por cédula (CC)
router.get('/obtenerporcedula/:CC', UsuarioController.obtenerUsuarioPorCedula);

// Crear un nuevo usuario
router.post('/crearusuario', UsuarioController.crearUsuario);

// Actualizar un usuario existente por cédula (CC)
router.put('/actualizarusuario/:CC', UsuarioController.actualizarUsuarioPorCedula);

// Eliminar un usuario por cédula (CC)
router.delete('/eliminarusuario/:CC', UsuarioController.eliminarUsuarioPorCedula);


// iniciar sesion por email y contraseña
router.post('/iniciarSesion', UsuarioController.iniciarSesion);

export default router;
