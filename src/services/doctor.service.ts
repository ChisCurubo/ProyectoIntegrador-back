
import { Pool, RowDataPacket } from 'mysql2/promise';
import connection from '../providers/database';
import { ordenMedica } from '../Interfaces/ordenMedica';

class DoctorService {
  private db: Pool;

  constructor() {
    this.db = connection;
  }

  // Crear Orden Médica
  public async crearOrdenMedica(orden: ordenMedica): Promise<void> {
    try {
      const query = `
        INSERT INTO ORDENES_MEDICAS (idCita, estadoOM, fecha, diagnostico, ordenes, recomendaciones)
        VALUES (?, ?, NOW(), ?, ?, ?)
      `;
      const [resultado] = await this.db.query(query, [orden.idCita, orden.estadoOM, orden.diagnostico, orden.ordenes, orden.recomendaciones]);
      console.log('Orden médica creada con ID:', (resultado as any).insertId);
    } catch (error) {
      console.error('Error en crearOrdenMedica:', error);
      throw new Error('Error al crear orden médica');
    }
  }

  // Actualizar una orden médica por ID
  public async editarOrdenMedica(idOrden: number, orden: ordenMedica): Promise<void> {
    try {
      const query = `
        UPDATE ORDENES_MEDICAS SET
          idCita = ?, estadoOM = ?, fecha = NOW(), diagnostico = ?, ordenes = ?, recomendaciones = ?
        WHERE idOrden_Medica = ?
      `;
      const params = [orden.idCita, orden.estadoOM, orden.diagnostico, orden.ordenes, orden.recomendaciones, idOrden];
      await this.db.query(query, params);
    } catch (error) {
      console.error('Error al editar orden médica por ID:', error);
      throw new Error('Error al editar orden médica');
    }
  }

  
    // Ver Pacientes que Atenderá
    public async verPacientesQueAtendera(idDoctor: string): Promise<any[]> {
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
        console.error('Error en verPacientesQueAtendera:', error);
        throw new Error('Error al obtener pacientes');
      }
    }

    // Pacientes asignados al Doctor
    public async pacientesAsignadosAlDoctor(idDoctor: string): Promise<any[]> {
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
        console.error('Error en pacientesAsignadosAlDoctor:', error);
        throw new Error('Error al obtener pacientes');
      }
    }





  // Obtener una orden médica por ID de Cita
  public async obtenerOrdenMedicaPorIdCita(idCita: number): Promise<any | null> {
    try {
      const query = 'SELECT * FROM ORDENES_MEDICAS WHERE idCita = ?';
      const [rows]: any[] = await this.db.query(query, [idCita]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error al obtener orden médica por ID de cita:', error);
      throw new Error('Error al obtener orden médica');
    }
  }
}

export default new DoctorService();
