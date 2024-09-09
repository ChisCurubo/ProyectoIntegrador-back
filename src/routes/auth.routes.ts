import express from 'express';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

// Ruta para iniciar sesión y obtener un token
router.post('/login', AuthController.login);

export default router;