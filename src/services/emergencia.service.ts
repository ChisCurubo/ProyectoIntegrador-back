
import connection from '../providers/database';
import { RowDataPacket } from 'mysql2/promise';  // Importa RowDataPacket para manejar los resultados de SELECT
import { Cita } from '../interfaces/citas'
import { EmergenciaCita } from 'interfaces/emergenciaCita';

class EmergenciaService {
    // Crear una nueva emergencia
    public async createEmergencia(data: any): Promise<any> {
        const query = 'INSERT INTO EMERGENCIAS (estadoEmergencia, horaLlegada, idTipo_Emergencia) VALUES (?, ?, ?)';
        const [result] = await connection.query(query, [data.estadoEmergencia, data.horaLlegada, data.idTipo_Emergencia]);
        return { idEmergencia: (result as any).insertId, ...data };
    }

    // Obtener una emergencia por ID
    public async getEmergenciaById(idEmergencia: number): Promise<any> {
        const query = 'SELECT * FROM EMERGENCIAS WHERE idEmergencia = ?';
        const [rows] = await connection.query<RowDataPacket[]>(query, [idEmergencia]);  // Especificar que el tipo es RowDataPacket[]

        return rows.length > 0 ? rows[0] : null;  // Accede a rows[0] si existe al menos un resultado
    }

    // Actualizar una emergencia por ID
    public async updateEmergencia(idEmergencia: number, data: any): Promise<boolean> {
        const query = 'UPDATE EMERGENCIAS SET estadoEmergencia = ?, horaLlegada = ?, idTipo_Emergencia = ? WHERE idEmergencia = ?';
        const [result] = await connection.query(query, [data.estadoEmergencia, data.horaLlegada, data.idTipo_Emergencia, idEmergencia]);
        return (result as any).affectedRows > 0;
    }

    // Actualizar solo el estado de la emergencia
    public async updateEstadoEmergencia(idEmergencia: number, estadoEmergencia: number): Promise<boolean> {
        const query = 'UPDATE EMERGENCIAS SET estadoEmergencia = ? WHERE idEmergencia = ?';
        const [result] = await connection.query(query, [estadoEmergencia, idEmergencia]);
        return (result as any).affectedRows > 0;
    }

    // Obtener emergencias por prioridad (ordenadas por horaLlegada y tipo de emergencia)
    public async getEmergenciasPorPrioridad(): Promise<any> {
        const query = `
            SELECT e.*, te.tipoEmergencia 
            FROM EMERGENCIAS e 
            JOIN TIPO_EMERGENCIA te ON e.idTipo_Emergencia = te.idTipo_Emergencia
            WHERE e.estadoEmergencia = 1
            ORDER BY e.horaLlegada ASC, te.idTipo_Emergencia ASC
        `;
        const [rows] = await connection.query(query);
        return rows;
    }


    public async createEmergenciaCita(data: EmergenciaCita): Promise<EmergenciaCita | null> {
        const query = `
            INSERT INTO EMERGENCIAS_CITAS (idEmergencia, idCita, idServicio, estatusEmergencia_Cita)
            VALUES (?, ?, ?, ?)
        `;
        try {
            const [result] = await connection.query(query, [
                data.idEmergencia,
                data.idCita,
                data.idServicio,
                data.statusEmergencia_Cita
            ]);
            return { idEmergencia_Cita: (result as any).insertId, ...data };
        } catch (error) {
            console.error('Error al crear emergencia cita:', error);
            throw new Error('No se pudo crear la emergencia cita');
        }
    }

    public async getEmergenciaCitaById(idEmergencia_Cita: number): Promise<EmergenciaCita | null> {
        const query = 'SELECT * FROM EMERGENCIAS_CITAS WHERE idEmergencia_Cita = ?';
        try {
            const [rows]: any = await connection.query(query, [idEmergencia_Cita]);
            if (rows.length === 0) {
                return null
            }
            return rows[0];
        } catch (error) {
            return  null
        }
    }

    // Obtener una emergencia cita por ID de Cita
    public async getCitaById(idCita: number): Promise<EmergenciaCita | null> {
        const query = 'SELECT * FROM EMERGENCIAS_CITAS WHERE idCita = ?';
        try {
            const [rows]: any = await connection.query(query, [idCita]);
            if (rows.length === 0) {
                return null;
            }
            return rows[0];
        } catch (error) {

            return null
        }
    }

    // Obtener todas las emergencias citas
    public async getAllEmergenciasCitas(): Promise<EmergenciaCita[] | null> {
        const query = 'SELECT * FROM EMERGENCIAS_CITAS';
        try {
            const [rows]: any = await connection.query(query);
            return rows;
        } catch (error) {
            return null
        }
    }

    // Actualizar una emergencia cita por ID
    public async updateEmergenciaCita(idEmergencia_Cita: number, data: EmergenciaCita): Promise<boolean> {
        const query = `
            UPDATE EMERGENCIAS_CITAS 
            SET idEmergencia = ?, idCita = ?, idServicio = ?, estatusEmergencia_Cita = ? 
            WHERE idEmergencia_Cita = ?
        `;
        try {
            const [result] = await connection.query(query, [
                data.idEmergencia,
                data.idCita,
                data.idServicio,
                data.statusEmergencia_Cita,
                idEmergencia_Cita
            ]);
            return (result as any).affectedRows > 0; // Retorna true si se actualizó
        } catch (error) {
            console.error('Error al actualizar emergencia cita:', error);
            throw new Error('No se pudo actualizar la emergencia cita');
        }
    }

    // Eliminar una emergencia cita por ID
    public async deleteEmergenciaCita(idEmergencia_Cita: number): Promise<boolean> {
        const query = 'DELETE FROM EMERGENCIAS_CITAS WHERE idEmergencia_Cita = ?';
        try {
            const [result] = await connection.query(query, [idEmergencia_Cita]);
            return (result as any).affectedRows > 0; // Retorna true si se eliminó
        } catch (error) {
            console.error('Error al eliminar emergencia cita:', error);
            throw new Error('No se pudo eliminar la emergencia cita');
        }
    }
}
export default new EmergenciaService();

