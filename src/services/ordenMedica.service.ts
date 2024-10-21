import { RowDataPacket } from 'mysql2/promise';
import connection from '../providers/database';

class OrdenMedicaService {

  public async getOrdenMedicaPorCC(cc: string): Promise<any | null> {
    const query = `
    SELECT OM.idOrden_Medica, OM.idCita, OM.estadoOM, OM.fecha, OM.diagnostico, OM.ordenes, OM.recomendaciones
    FROM ORDENES_MEDICAS OM
    INNER JOIN CITAS C ON C.idCita = OM.idCita
    INNER JOIN USUARIOS U ON U.cc = C.idUsuarioCC
    WHERE U.cc = ?
    ORDER BY OM.fecha DESC
    LIMIT 1; -- Devuelve solo la última orden médica
  `;

    try {
      const [rows]: [RowDataPacket[], any] = await connection.query(query, [cc]);
      if (rows.length === 0) {
      }
      return rows[0]; // Devuelve la primera fila, que es la orden médica
    } catch (error) {
    }
  }
  
  // Crear una Orden Médica
  public async createOrdenMedica(data: any): Promise<any> {
    const query = `
      INSERT INTO ORDENES_MEDICAS (idCita, estadoOM, diagnostico, ordenes, recomendaciones) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await connection.query(query, [
      data.idCita,
      data.estadoOM,
      data.diagnostico,
      data.ordenes,
      data.recomendaciones
    ]);
    return { id: (result as any).insertId, ...data };
  }

  // Obtener una Orden Médica por ID
  public async getOrdenMedica(id: string): Promise<any> {
    const query = 'SELECT * FROM ORDENES_MEDICAS WHERE idOrden_Medica = ?';
    const [rows] = await connection.query<RowDataPacket[]>(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Actualizar una Orden Médica por ID
  public async updateOrdenMedica(id: string, data: any): Promise<any> {
    const query = `
      UPDATE ORDENES_MEDICAS 
      SET idCita = ?, estadoOM = ?, diagnostico = ?, ordenes = ?, recomendaciones = ? 
      WHERE idOrden_Medica = ?
    `;
    const [result] = await connection.query(query, [
      data.idCita,
      data.estadoOM,
      data.diagnostico,
      data.ordenes,
      data.recomendaciones,
      id
    ]);
    return (result as any).affectedRows > 0 ? { id, ...data } : null;
  }

  // Eliminar una Orden Médica por ID
  public async deleteOrdenMedica(id: string): Promise<boolean> {
    const query = 'DELETE FROM ORDENES_MEDICAS WHERE idOrden_Medica = ?';
    const [result] = await connection.query(query, [id]);
    return (result as any).affectedRows > 0;
  }
}

export default new OrdenMedicaService();
