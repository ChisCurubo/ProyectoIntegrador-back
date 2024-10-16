import { Request, Response, NextFunction } from 'express';
import { generarToken, singUpSedes, iniciarSesion, validateSedes } from '../services/auth.service';
import { Usuario } from '../interface/User';
import UsuarioService from '../services/usuario.service';
import { BadRequestError, UnauthorizedError, InternalServerError } from '../middlewares/customErrors'; // Ajusta según tus errores personalizados

class AuthController {

    // Método para iniciar sesión y generar el token
    loginfeo(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;

            if (username === 'user' && password === 'password') {
                const token = generarToken('userId123');
                return res.json({ token });
            } else {
                throw new UnauthorizedError('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            next(error); // Pasa el error al middleware de manejo de errores
        }
    }

    // Método para login de sedes
    async inSedes(req: Request, res: Response, next: NextFunction) {
        try {
            const { userSede, pwdSede } = req.body;
            const ipHeader = req.headers['x-forwarded-for'] as string | undefined;
            const ip = ipHeader ? ipHeader.split(',')[0] : req.socket.remoteAddress || 'IP desconocida';

            const aws = await singUpSedes(userSede, pwdSede, ip);
            if (!aws) {
                throw new UnauthorizedError('Credenciales incorrectas');
            }
            res.cookie('token', aws);
            return res.status(200).header('auth-token', aws).json({ aws });
        } catch (error) {
            next(error);
        }
    }

    // Método para iniciar sesión
    async Login(req: Request, res: Response, next: NextFunction) {
        try {
            const { user, pwd } = req.body;
            const ipHeader = req.headers['x-forwarded-for'] as string | undefined;
            const ip = ipHeader ? ipHeader.split(',')[0] : req.socket.remoteAddress || 'IP desconocida';

            const aws = await iniciarSesion(user, pwd, ip);
            if (!aws) {
                throw new UnauthorizedError('Credenciales incorrectas');
            }
            res.cookie('token', aws);
            return res.status(200).header('auth-token', aws).json({ aws });
        } catch (error) {
            next(error);
        }
    }

    // Método para registrar usuario
    async SingUp(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario: Usuario = req.body;
            await UsuarioService.createUserSimple(usuario);
            res.status(200).json({ mensaje: 'Usuario creado exitosamente' });
        } catch (error) {
            next(new InternalServerError('Error al crear el usuario')); // Manejamos el error interno del servidor
        }
    }

    // Método para validar el token
    async validateTokken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }

            const aws = await validateSedes(token);
            if (!aws) {
                throw new UnauthorizedError('Acceso denegado. Por favor, inicie sesión nuevamente');
            }
            return res.status(200).json(aws);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
