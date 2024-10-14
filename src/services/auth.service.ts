import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Importa bcrypt
import connection from '../providers/database';
import { Sede, SedeLogIn } from '../interface/sedes';
import { Usuario } from '../interface/User';
import { InternalServerError, UnauthorizedError } from '../middlewares/customErrors';
const tokenKey = 'vitamed'

export function generarToken(userId: string) {
    const payload = { userId };
    const secret = process.env.TOKEN_SECRET || tokenKey; // Asegúrate de tener esto en tu archivo .env
    const options = { expiresIn: '1h' }; // El token expira en una hora

    return jwt.sign(payload, secret, options);
}

// Definir la función para generar el token
export function generarTokenSede(sede: SedeLogIn, ip: string): string {
    const payload = {
        idSede: sede.idSede,
        nombreSede: sede.nombreSede,
        usuarioSede: sede.usuarioSede,
        pwdSede: sede.pwdSede, // Asegúrate de no enviar la contraseña en producción o usar otras medidas de seguridad
        ip,
    };
    const secret = process.env.TOKEN_SECRET || tokenKey; // Usa una clave segura
    const options = { expiresIn: '1h' }; // El token expira en 1 hora

    return jwt.sign(payload, secret, options);
}

// Definir la función para generar el token
export function generarTokenUsuario(user: Usuario, ip: string): string {
    const payload = {
        CC: user.CC,              // Número de identificación
        idSede: user.idSede,          // ID de la sede a la que pertenece
        idRol: user.idRol,            // ID del rol del usuario     
        idHoja_Vida: user.idHoja_Vida,     // ID de la hoja de vida del usuario
        idTipoPaciente: user.idTipoPaciente,  // ID del tipo de paciente
        ipUsario: ip               // ip´de onde se conecta
    };
    const secret = process.env.TOKEN_SECRET || tokenKey; // Usa una clave segura
    const options = { expiresIn: '1h' }; // El token expira en 1 hora

    return jwt.sign(payload, secret, options);
}

/**
 * 
 * @param user 
 * @param pwd Debe ser encriptada con bycript
 * @param ip 
 * @returns 
 */
export async function singUpSedes(user: string, pwd: string, ip: string): Promise<string | null> {
    const query = 'SELECT idSede, nombreSede, usuarioSede, pwdSede FROM SEDES WHERE usuarioSede=?';
    try {
        const [rows]: any = await connection.query(query, user);
        if (rows.length > 0) {
            //const isMatch = await bcrypt.compare(pwd, rows[0].pwdSede);
            if (pwd === rows[0].pwd) {
                const obj: SedeLogIn = rows[0] as SedeLogIn;
                const token = await generarTokenSede(obj, ip);
                return token;
            } else {
                return null;  // Contraseña incorrecta
            }
        } else {
            return null;  // Usuario no encontrado
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw new InternalServerError('Error interno en la base de datos');
    }
}

/**
 * Metodo que valida el token de las sedes
 * @param user 
 * @returns 
 */
export async function validateSedes(token: string): Promise<SedeLogIn | Usuario | null> {
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET || tokenKey) as SedeLogIn | Usuario;
        console.log('Token decodificado:', decoded);
        return decoded;
    } catch (err) {
        console.error('Error al decodificar el token:', err);
        return null;  // Token inválido o expirado
    }
}

    /**
     * Iniciar sesion como usuario de la sede
     * @param email 
     * @param contraseña 
     * @param ip 
     * @returns 
     */
    export async function iniciarSesion(email: string, contra: string, ip: string): Promise<string | null> {
        const query = 'SELECT * FROM USUARIOS WHERE emailUsuario = ?';
        try {
            const [rows]: any[] = await connection.query(query, [email]);
            if (rows.length > 0) {
                const usuario = rows[0] as Usuario;
                const isMatch = await bcrypt.compare(contra, usuario.pwdUsuario);
                if (isMatch) {
                    const token = await generarTokenUsuario(usuario, ip);
                    return token;
                } else {
                    return null;  // Contraseña incorrecta
                }
            } else {
                return null;  // Usuario no encontrado
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw new InternalServerError('Error interno al iniciar sesión');
        }
    }
