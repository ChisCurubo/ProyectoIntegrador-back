import { Pool, RowDataPacket } from 'mysql2/promise';
import connection from '../providers/database';
import { BadRequestError, DatabaseError } from '../middlewares/customErrors';
import { Usuario } from '../interfaces/usuario';

class PacientesService {

  // Obtener Pacientes que Atenderá el Doctor
  public async pacientesQueAtendera(idDoctor: string): Promise<Usuario[] | null> {
    if (!idDoctor) {
      throw new BadRequestError('El id del doctor es obligatorio');
    }

    try {
      const query = `
        SELECT u.* 
        FROM USUARIOS u
        JOIN CITAS c ON u.CC = c.idUsuarioCC
        WHERE c.idDocCC = ?
      `;
      const [filas] = await connection.query(query, [idDoctor]);
      if(filas != null) {
        return filas as Usuario[];
      }else{
        return null;
      }
     
    } catch (error) {
      console.error('Error en pacientesQueAtendera:', error);
      throw new DatabaseError('Error al obtener pacientes que atenderá el doctor');
    }
  }
}

export default new PacientesService();
