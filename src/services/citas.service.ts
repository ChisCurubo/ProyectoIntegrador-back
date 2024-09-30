import connection from '../providers/database';
import { NotFoundError, BadRequestError, DatabaseError } from '../middlewares/customErrors'; // Incluye DatabaseError
import { Cita } from '../Interfaces/Citas';

import { format } from 'date-fns';

class CitasService {

    public async createCita(fecha: string, hora: string, medico: string, idUsuario: number, historialMedico?: string): Promise<any> {
      try {
        const query = `INSERT INTO CITAS (dia, hora, idDocCC, idUsuarioCC${historialMedico ? ', historialMedico' : ''})
                       VALUES (?, ?, ?, ?${historialMedico ? ', ?' : ''})`;
        const params = [fecha, hora, medico, idUsuario, historialMedico].filter(Boolean);
        const [result]: any = await connection.execute(query, params);
        return { id: result.insertId, message: 'Cita creada exitosamente' };
      } catch (error: any) {
        console.error('Error creating cita:', error);
        throw new DatabaseError('Error en la base de datos al crear la cita');
      }
    }
  
    public async createCitaWithHistorial(fecha: string, hora: string, medico: string, idUsuario: number, historialPasado: number): Promise<any> {
      try {
        const query = `INSERT INTO CITAS (dia, hora, idDocCC, idUsuarioCC, idHistoria_Medica)
                       VALUES (?, ?, ?, ?, ?)`;
        const [result]: any = await connection.execute(query, [fecha, hora, medico, idUsuario, historialPasado]);
        return { id: result.insertId, message: 'Cita creada exitosamente con historial' };
      } catch (error: any) {
        console.error('Error creating cita with historial:', error);
        throw new DatabaseError('Error en la base de datos al crear la cita con historial');
      }
    }
  
    public async updateDateCita(fecha: string, hora: string, idCita: number): Promise<boolean> {
      try {
        const query = 'UPDATE CITAS SET dia = ?, hora = ? WHERE idCita = ?';
        const [result]: any = await connection.query(query, [fecha, hora, idCita]);
        if (result.affectedRows === 0) {
          throw new NotFoundError('Cita no encontrada');
        }
        return true;
      } catch (error: any) {
        console.error('Error updating cita date:', error);
        if (error instanceof NotFoundError) throw error;
        throw new DatabaseError('Error en la base de datos al actualizar la fecha y hora de la cita');
      }
    }
  
    public async updateStatusCita(estado: string, idCita: number): Promise<boolean> {
      try {
        const query = 'UPDATE CITAS SET estadoCita = ? WHERE idCita = ?';
        const [result]: any = await connection.query(query, [estado, idCita]);
        if (result.affectedRows === 0) {
          throw new NotFoundError('Cita no encontrada');
        }
        return true;
      } catch (error: any) {
        console.error('Error updating cita status:', error);
        if (error instanceof NotFoundError) throw error;
        throw new DatabaseError('Error en la base de datos al actualizar el estado de la cita');
      }
    }
  
    public async updateCitasAll(fecha: string, hora: string, medico: string, estado: string, idCita: number, idUsuario: number): Promise<boolean> {
      try {
        const query = `UPDATE CITAS SET dia = ?, hora = ?, idDocCC = ?, estadoCita = ? 
                       WHERE idCita = ? AND idUsuarioCC = ?`;
        const [result]: any = await connection.query(query, [fecha, hora, medico, estado, idCita, idUsuario]);
        if (result.affectedRows === 0) {
          throw new NotFoundError('Cita no encontrada');
        }
        return true;
      } catch (error: any) {
        console.error('Error updating cita details:', error);
        if (error instanceof NotFoundError) throw error;
        throw new DatabaseError('Error en la base de datos al actualizar los detalles de la cita');
      }
    }
  
    public async deleteCitas(idCita: number, idUsuario: number): Promise<boolean> {
      try {
        const query = 'DELETE FROM CITAS WHERE idCita = ? AND idUsuarioCC = ?';
        const [result]: any = await connection.execute(query, [idCita, idUsuario]);
        if (result.affectedRows === 0) {
          throw new NotFoundError('Cita no encontrada para eliminar');
        }
        return true;
      } catch (error: any) {
        console.error('Error deleting cita:', error);
        if (error instanceof NotFoundError) throw error;
        throw new DatabaseError('Error en la base de datos al eliminar la cita');
      }
    }
  
    public async getCitasByUser(idUsuario: number): Promise<any[]> {
      try {
        const query = 'SELECT hora, dia, idDocCC, idCita FROM CITAS WHERE idUsuarioCC = ?';
        const [rows]: any = await connection.query(query, [idUsuario]);
        if (rows.length === 0) {
          throw new NotFoundError('No se encontraron citas para este usuario');
        }
        return rows.map((row: any) => ({
          ...row,
          dia: format(new Date(row.dia), 'dd/MM/yyyy')
        }));
      } catch (error: any) {
        console.error('Error getting citas by user:', error);
        if (error instanceof NotFoundError) throw error;
        throw new DatabaseError('Error en la base de datos al obtener citas del usuario');
      }
    }
  
    public async getCitasByDoctor(idDoctor: number): Promise<any[]> {
      try {
        const query = 'SELECT hora, dia, idUsuarioCC, idCita FROM CITAS WHERE idDocCC = ?';
        const [rows]: any = await connection.query(query, [idDoctor]);
        if (rows.length === 0) {
          throw new NotFoundError('No se encontraron citas para este médico');
        }
        return rows.map((row: any) => ({
          ...row,
          dia: format(new Date(row.dia), 'dd/MM/yyyy')
        }));
      } catch (error: any) {
        console.error('Error getting citas by doctor:', error);
        if (error instanceof NotFoundError) throw error;
        throw new DatabaseError('Error en la base de datos al obtener citas del médico');
      }
    }


  public async getCitaById(idCita: number): Promise<Cita> {
    try {
      const query = 'SELECT hora, dia, idDocCC FROM CITAS WHERE idCita = ?';
      const [rows]: any = await connection.query(query, [idCita]);
      
      if (rows.length === 0) {
        throw new NotFoundError('Cita no encontrada por ID');
      }
      
      // Formatear la fecha
      const cita = rows[0] ;
      cita.dia = format(new Date(cita.dia), 'dd-MM-yyyy');
      
      return cita as Cita;
    } catch (error: any) {
      console.error('Error getting cita by id:', error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Error en la base de datos al obtener la cita por ID');
    }
  }
}
export default new CitasService();
