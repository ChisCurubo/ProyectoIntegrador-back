import { Request, Response } from 'express';
import { generarToken } from '../services/auth.service'; // Ajusta la ruta según donde esté el servicio

class AuthController {
    // Método para iniciar sesión y generar el token
    login(req: Request, res: Response) {
        const { username, password } = req.body;

        // Aquí harías la verificación del usuario (esto es solo un ejemplo, necesitarías usar tu base de datos)
        if (username === 'user' && password === 'password') {
            // Generar token usando el servicio
            const token = generarToken('userId123'); // Aquí pondrías el ID del usuario real

            return res.json({ token });
        } else {
            return res.status(403).json({ message: 'Usuario o contraseña incorrectos' });
        }
    }
}

export default new AuthController();