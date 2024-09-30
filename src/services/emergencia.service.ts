// services/emergencia.service.ts

import connection from '../providers/database';
import { RowDataPacket } from 'mysql2/promise';  // Importa RowDataPacket para manejar los resultados de SELECT


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
}

export default new  EmergenciaService;
