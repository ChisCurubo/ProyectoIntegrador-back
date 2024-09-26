import connection from '../providers/database';
import { NotFoundError, BadRequestError, DatabaseError } from '../middlewares/customErrors'; // Incluye DatabaseError

class CitasService {

  public async createCita(fecha: string, hora: string, medico: string, idUsuario: number, historialMedico?: string): Promise<any> {
    try {
      let query = `INSERT INTO CITAS (fecha, hora, medico, idUsuario${historialMedico ? ', historialMedico' : ''})
                   VALUES (?, ?, ?, ?${historialMedico ? ', ?' : ''})`;
      const [result]: any = await connection.execute(query, [fecha, hora, medico, idUsuario, historialMedico].filter(Boolean));
      return result;
    } catch (error: any) {
      console.error('Error creating cita:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        // Manejar error de duplicado (por ejemplo, si ya existe una cita en la misma fecha/hora)
        throw new DatabaseError('Ya existe una cita en esa fecha y hora');
      }
      throw error;
    }
  }

  public async createCitaWithHistorial(fecha: string, hora: string, medico: string, idUsuario: number, historialPasado: number): Promise<any> {
    try {
      const query = `INSERT INTO CITAS (fecha, hora, medico, idUsuario, historialMedico)
                     VALUES (?, ?, ?, ?, ?)`;
      const [result]: any = await connection.execute(query, [fecha, hora, medico, idUsuario, historialPasado]);
      return result;
    } catch (error: any) {
      console.error('Error creating cita with historial:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        // Manejar error de referencia (por ejemplo, si el ID de usuario o médico no existe)
        throw new DatabaseError('El usuario o historial médico no existe');
      }
      throw error;
    }
  }

  public async updateDateCita(fecha: string, hora: string, idCita: number): Promise<boolean> {
    try {
      const query = 'UPDATE CITAS SET fecha = ?, hora = ? WHERE idCita = ?';
      const [result]: any = await connection.execute(query, [fecha, hora, idCita]);
      if (result.affectedRows === 0) {
        throw new NotFoundError('Cita no encontrada');
      }
      return result.affectedRows > 0;
    } catch (error: any) {
      console.error('Error updating cita date:', error);
      if (error.code) {
        throw new DatabaseError('Error en la base de datos al actualizar la fecha y hora de la cita');
      }
      throw error;
    }
  }

  public async updateStatusCita(estado: string, idCita: number): Promise<boolean> {
    try {
      const query = 'UPDATE CITAS SET estado = ? WHERE idCita = ?';
      const [result]: any = await connection.execute(query, [estado, idCita]);
      if (result.affectedRows === 0) {
        throw new NotFoundError('Cita no encontrada');
      }
      return result.affectedRows > 0;
    } catch (error: any) {
      console.error('Error updating cita status:', error);
      if (error.code) {
        throw new DatabaseError('Error en la base de datos al actualizar el estado de la cita');
      }
      throw error;
    }
  }

  public async updateCitasAll(fecha: string, hora: string, medico: string, estado: string, idCita: number, idUsuario: number): Promise<boolean> {
    try {
      const query = `UPDATE CITAS SET fecha = ?, hora = ?, medico = ?, estado = ? 
                     WHERE idCita = ? OR idUsuario = ?`;
      const [result]: any = await connection.execute(query, [fecha, hora, medico, estado, idCita, idUsuario]);
      if (result.affectedRows === 0) {
        throw new NotFoundError('Cita no encontrada');
      }
      return result.affectedRows > 0;
    } catch (error: any) {
      console.error('Error updating cita details:', error);
      if (error.code) {
        throw new DatabaseError('Error en la base de datos al actualizar los detalles de la cita');
      }
      throw error;
    }
  }

  public async deleteCitas(idCita: number, idUsuario: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM CITAS WHERE idCita = ? AND idUsuario = ?';
      const [result]: any = await connection.execute(query, [idCita, idUsuario]);
      if (result.affectedRows === 0) {
        throw new NotFoundError('Cita no encontrada para eliminar');
      }
      return result.affectedRows > 0;
    } catch (error: any) {
      console.error('Error deleting cita:', error);
      if (error.code) {
        throw new DatabaseError('Error en la base de datos al eliminar la cita');
      }
      throw error;
    }
  }

  public async getCitasByUser(idUsuario: number): Promise<any[]> {
    try {
      const query = 'SELECT hora, fecha, medico, idCita FROM CITAS WHERE idUsuario = ?';
      const [rows]: any = await connection.execute(query, [idUsuario]);
      if (rows.length === 0) {
        throw new NotFoundError('No se encontraron citas para este usuario');
      }
      return rows;
    } catch (error: any) {
      console.error('Error getting citas by user:', error);
      if (error.code) {
        throw new DatabaseError('Error en la base de datos al obtener citas del usuario');
      }
      throw error;
    }
  }

  public async getCitasByDoctor(idUsuario: number): Promise<any[]> {
    try {
      const query = 'SELECT hora, fecha, medico, idCita FROM CITAS WHERE idMedico = ?';
      const [rows]: any = await connection.execute(query, [idUsuario]);
      if (rows.length === 0) {
        throw new NotFoundError('No se encontraron citas para este médico');
      }
      return rows;
    } catch (error: any) {
      console.error('Error getting citas by doctor:', error);
      if (error.code) {
        throw new DatabaseError('Error en la base de datos al obtener citas del médico');
      }
      throw error;
    }
  }

  public async getCitaById(idCita: number): Promise<any[]> {
    try {
      const query = 'SELECT hora, fecha, medico FROM CITAS WHERE idCita = ?';
      const [rows]: any = await connection.execute(query, [idCita]);
      if (rows.length === 0) {
        throw new NotFoundError('Cita no encontrada por ID');
      }
      return rows;
    } catch (error: any) {
      console.error('Error getting cita by id:', error);
      if (error.code) {
        throw new DatabaseError('Error en la base de datos al obtener la cita por ID');
      }
      throw error;
    }
  }
}

export default new CitasService();
