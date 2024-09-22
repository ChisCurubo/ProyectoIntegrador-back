import { Pool, RowDataPacket } from 'mysql2/promise';
import connection from '../providers/database';

class PacientesService {
  private db: Pool;

  constructor() {
    this.db = connection;
  }

  // Obtener Pacientes que Atenderá el Doctor
  public async pacientesQueAtendera(idDoctor: string): Promise<any[]> {
    try {
      const query = `
        SELECT u.* 
        FROM USUARIOS u
        JOIN CITAS c ON u.CC = c.idUsuarioCC
        WHERE c.idDocCC = ?
      `;
      const [filas] = await this.db.query(query, [idDoctor]);
      return (filas as RowDataPacket[]);
    } catch (error) {
      console.error('Error en pacientesQueAtendera:', error);
      throw new Error('Error al obtener pacientes que atenderá el doctor');
    }
  }
}

export default new PacientesService();
