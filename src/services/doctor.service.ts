
import { Pool, RowDataPacket } from 'mysql2/promise';
import connection from '../providers/database';
import { ordenMedica } from '../interface/ordenMedica';
import { DatabaseError, NotFoundError } from '../middlewares/customErrors';

import { OrdenMedicaInformacion } from '../interface/ordenMedica'; // Asegúrate de que la ruta sea correcta

class DoctorService {

  // Crear Orden Médica
  public async crearOrdenMedica(orden: ordenMedica): Promise<void> {
    try {
      const query = `
        INSERT INTO ORDENES_MEDICAS (idCita, estadoOM, fecha, diagnostico, ordenes, recomendaciones)
        VALUES (?, ?, NOW(), ?, ?, ?)
      `;
      const [resultado] = await connection.query(query, [orden.idCita, orden.estadoOM, orden.diagnostico, orden.ordenes, orden.recomendaciones]);
      console.log('Orden médica creada con ID:', (resultado as any).insertId);
    } catch (error) {
      console.error('Error en crearOrdenMedica:', error);
      throw new DatabaseError('Error al crear orden médica');
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
      const result = await connection.query(query, params);

      if ((result as any).affectedRows === 0) {
        throw new NotFoundError(`Orden médica con ID ${idOrden} no encontrada`);
      }
    } catch (error) {
      console.error('Error al editar orden médica por ID:', error);
      throw new DatabaseError('Error al editar orden médica');
    }
  }

  // Ver Pacientes que Atenderá
  public async verPacientesQueAtendera(idDoctor: string): Promise<RowDataPacket[]> {
    try {
      const query = `
        SELECT u.* , c*, h*
        FROM USUARIOS u
        JOIN CITAS c ON u.CC = c.idUsuarioCC
        JOIN HOJA_VIDA h ON u.CC = h.idUsuarioCC
        WHERE c.idDocCC = ?
      `;
      const [filas] = await connection.query<RowDataPacket[]>(query, [idDoctor]);
      return filas;
    } catch (error) {
      console.error('Error en verPacientesQueAtendera:', error);
      throw new DatabaseError('Error al obtener pacientes que atenderá el doctor');
    }
  }

  // Pacientes asignados al Doctor
  public async pacientesAsignadosAlDoctor(idDoctor: string): Promise<RowDataPacket[]> {
    try {
      const query = `
        SELECT u.* 
        FROM USUARIOS u
        JOIN CITAS c ON u.CC = c.idUsuarioCC
        WHERE c.idDocCC = ?
      `;
      const [filas] = await connection.query<RowDataPacket[]>(query, [idDoctor]);
      return filas;
    } catch (error) {
      console.error('Error en pacientesAsignadosAlDoctor:', error);
      throw new DatabaseError('Error al obtener pacientes asignados al doctor');
    }
  }

  // Obtener una orden médica por ID de Cita
  public async obtenerOrdenMedicaPorIdCita(idCita: number): Promise<ordenMedica | null> {
    try {
      const query = 'SELECT * FROM ORDENES_MEDICAS WHERE idCita = ?';
      const [rows] = await connection.query<RowDataPacket[]>(query, [idCita]);
      return rows.length > 0 ? rows[0] as ordenMedica : null;
    } catch (error) {
      console.error('Error al obtener orden médica por ID de cita:', error);
      throw new DatabaseError('Error al obtener orden médica por ID de cita');
    }
  }



 

public async buscarOrdenesMedicasInformacionPorCedula(cedula: string): Promise<OrdenMedicaInformacion[]> { 
  try {
      const query = `
          SELECT 
              OM.idOrden_Medica,  -- Agregar la id de la orden
              CONCAT(paciente.nombreUsuario, ' ', paciente.apellidoUsuario) AS nombre,
              paciente.CC AS cc,
              OM.fecha AS fechaOrden,
              CONCAT(doctor.nombreUsuario, ' ', doctor.apellidoUsuario) AS doctorAsignado,
              CASE 
                  WHEN OM.estadoOM = 1 THEN 'Activo'
                  WHEN OM.estadoOM = 0 THEN 'Inactivo'
                  ELSE 'Desconocido'
              END AS estado
          FROM 
              ORDENES_MEDICAS AS OM
          INNER JOIN 
              CITAS AS C ON OM.idCita = C.idCita
          INNER JOIN 
              USUARIOS AS paciente ON C.idUsuarioCC = paciente.CC
          LEFT JOIN 
              USUARIOS AS doctor ON C.idDocCC = doctor.CC
          WHERE 
              paciente.CC = ?;
      `;

      const [filas] = await connection.query<RowDataPacket[]>(query, [cedula]);
      return filas as OrdenMedicaInformacion[]; // Devuelve las filas obtenidas con el tipo específico
  } catch (error) {
      console.error('Error al buscar órdenes médicas por cédula:', error);
      throw new DatabaseError('Error al buscar órdenes médicas por cédula');
  }
}



}

export default new DoctorService();
