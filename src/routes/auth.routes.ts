import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

// Ruta para iniciar sesión y obtener un token
router.post('/in', AuthController.inSedes);
router.post('/login', AuthController.iniciarSesion);
export default router;