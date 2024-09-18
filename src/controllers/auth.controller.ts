import { Request, Response } from 'express';
import { generarToken, singUpSedes, iniciarSesion } from '../services/auth.service'; // Ajusta la ruta según donde esté el servicio

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

    /**
     * Se necesitara usuario y contrasña ( esta ultima ya debe estar encriptada con hash de bycript)
     * la ip se captura enn el metodo
     * @param req 
     * @param res 
     * @returns 
     */
    async inSedes(req: Request, res: Response){
        const {userSede, pwdSede}= req.body
        const ipHeader = req.headers['x-forwarded-for'] as string | undefined;
        const ip = ipHeader ? ipHeader.split(',')[0] : req.socket.remoteAddress || 'IP desconocida';
        const aws = await singUpSedes(userSede, pwdSede, ip);
        if (!aws) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        res.cookie('token', aws);
        return res.status(200).header('auth-token',aws).json({ aws});
    }
    
    async iniciarSesion(req: Request, res: Response){
        const {user, pwd}= req.body
        const ipHeader = req.headers['x-forwarded-for'] as string | undefined;
        const ip = ipHeader ? ipHeader.split(',')[0] : req.socket.remoteAddress || 'IP desconocida';
        console.log(ip)
        const aws = await  iniciarSesion(user, pwd, ip);
        if (!aws) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        res.cookie('token', aws);
        return res.status(200).header('auth-token',aws).json({ aws});
    }
}

export default new AuthController();