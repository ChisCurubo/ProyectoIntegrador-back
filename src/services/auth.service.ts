import jwt from 'jsonwebtoken';

export function generarToken(userId: string) {
    const payload = { userId };
    const secret = process.env.JWT_SECRET || 'tu_clave_secreta'; // Asegúrate de tener esto en tu archivo .env
    const options = { expiresIn: '1h' }; // El token expira en una hora

    return jwt.sign(payload, secret, options);
}
