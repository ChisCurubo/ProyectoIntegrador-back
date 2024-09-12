import connection from '../providers/database'; 

export class CitaService {
    // Obtener todas las citas
    public async getAllCitas() {
        const query = 'SELECT * FROM CITAS';
        const [rows] = await connection.execute(query);
        return rows;
    }

    // Insertar una nueva cita
    public async createCita(data: any) {
        const { fecha, hora, medico, idUsuario, historialMedico } = data;
        let query = `INSERT INTO CITAS (fecha, hora, medico, idUsuario${historialMedico ? ', historialMedico' : ''})
                     VALUES (?, ?, ?, ?${historialMedico ? ', ?' : ''})`;
        const [result] = await connection.execute(query, [fecha, hora, medico, idUsuario, historialMedico].filter(Boolean));
        return result;
    }

    public async testConnection() {
        try {
            const [rows] = await connection.query('SELECT 1');
            return rows;
        } catch (error) {
            console.error('Error de conexión:', error);
            throw error;
        }
    }
    
}

export default CitaService;