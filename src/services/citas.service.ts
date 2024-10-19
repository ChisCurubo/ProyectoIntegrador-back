import { format } from 'date-fns';
import { Cita, CitaConPacientesYDoctores, CitaDetalladaParaAgendar, ReagendarCitadetallada } from '../interface/Citas';
import { DatabaseError, NotFoundError } from '../middlewares/customErrors';
import connection from '../providers/database';
import citasRoutes from '../routes/citas.routes';

class CitasService {

  // Crear una nueva cita
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

  // Crear una cita con historial
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

  // Actualizar fecha y hora de la cita
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
      throw new DatabaseError('Error en la base de datos al actualizar la fecha y hora de la cita');
    }
  }

  // Actualizar estado de la cita
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
      throw new DatabaseError('Error en la base de datos al actualizar el estado de la cita');
    }
  }

  // Actualizar todos los campos de una cita
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
      throw new DatabaseError('Error en la base de datos al actualizar los detalles de la cita');
    }
  }

  // Eliminar una cita por id y usuario
  public async deleteCitasAll(idCita: number, idUsuario: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM CITAS WHERE idCita = ? AND idUsuarioCC = ?';
      const [result]: any = await connection.execute(query, [idCita, idUsuario]);
      if (result.affectedRows === 0) {
        throw new NotFoundError('Cita no encontrada para eliminar');
      }
      return true;
    } catch (error: any) {
      console.error('Error deleting cita:', error);
      throw new DatabaseError('Error en la base de datos al eliminar la cita');
    }
  }

  // Eliminar una cita por id de cita
  public async deleteCitasId(idCita: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM CITAS WHERE idCita = ? ';
      const [result]: any = await connection.execute(query, [idCita]);
      if (result.affectedRows === 0) {
        throw new NotFoundError('Cita no encontrada para eliminar');
      }
      return true;
    } catch (error: any) {
      console.error('Error deleting cita:', error);
      throw new DatabaseError('Error en la base de datos al eliminar la cita');
    }
  }

  // Eliminar todas las citas de un usuario por su id
  public async deleteCitasUsuario(idUsuario: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM CITAS WHERE idUsuarioCC = ?';
      const [result]: any = await connection.execute(query, [idUsuario]);
      if (result.affectedRows === 0) {
        throw new NotFoundError('Cita no encontrada para eliminar');
      }
      return true;
    } catch (error: any) {
      console.error('Error deleting cita:', error);
      throw new DatabaseError('Error en la base de datos al eliminar la cita');
    }
  }

  // Obtener citas por usuario
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
      throw new DatabaseError('Error en la base de datos al obtener citas del usuario');
    }
  }

  // Obtener citas por doctor
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
      throw new DatabaseError('Error en la base de datos al obtener citas del médico');
    }
  }

  // Obtener cita por id de cita
  public async getCitaById(idCita: number): Promise<Cita> {
    try {
      const query = `
        SELECT 
          C.hora, 
          C.dia, 
          C.idCita, 
          paciente.nombreUsuario AS nombrePaciente, 
          doctor.nombreUsuario AS nombreDoctor,
          S.nombreServicio AS nombreServicio, 
          paciente.CC AS cc 
        FROM CITAS AS C
        INNER JOIN USUARIOS AS paciente ON C.idUsuarioCC = paciente.CC
        LEFT JOIN USUARIOS AS doctor ON C.idDocCC = doctor.CC
        LEFT JOIN SERVICIOS AS S ON C.idServicio = S.idServicio
        WHERE C.idCita = ?
      `;
      const [rows]: any = await connection.query(query, [idCita]);
  
      if (rows.length === 0) {
        throw new NotFoundError('Cita no encontrada');
      }
  
      const cita = rows[0];
      cita.dia = format(new Date(cita.dia), 'dd-MM-yyyy');
      return cita as Cita;
    } catch (error: any) {
      console.error('Error al obtener la cita por ID:', error);
      throw new DatabaseError('Error en la base de datos al obtener la cita por ID');
    }
  }

  // Obtener citas con pacientes y doctores
  public async getCitasWithPatientsAndDoctors(): Promise<CitaConPacientesYDoctores[]> {
    try {
      const query = `
        SELECT 
          C.hora AS 'Hora',
          C.dia AS 'Día',
          paciente.nombreUsuario AS NombrePaciente,
          doctor.nombreUsuario AS NombreDoctor
        FROM 
          CITAS AS C
        INNER JOIN 
          USUARIOS AS paciente ON C.idUsuarioCC = paciente.CC
        LEFT JOIN 
          USUARIOS AS doctor ON C.idDocCC = doctor.CC`;

      const [rows]: any = await connection.query(query);

      if (rows.length === 0) {
        throw new NotFoundError('No se encontraron citas.');
      }

      return rows.map((row: any) => ({
        Hora: row.Hora,
        Día: format(new Date(row.Día), 'dd/MM/yyyy'),
        NombrePaciente: row.NombrePaciente,
        NombreDoctor: row.NombreDoctor || null
      })) as CitaConPacientesYDoctores[];
    } catch (error: any) {
      console.error('Error getting citas with patients and doctors:', error);
      throw new DatabaseError('Error en la base de datos al obtener citas con pacientes y doctores');
    }
  }

  // Método detallado para agendar citas
  public async metodoDetalladoParaAgendarCitas(): Promise<CitaDetalladaParaAgendar[]> {
    try {
      const query = `
        SELECT 
          CONCAT(paciente.nombreUsuario, ' ', paciente.apellidoUsuario) AS NombreCompleto,
          paciente.emailUsuario AS CorreoElectronico,
          paciente.CC AS Documento,
          CONCAT(C.dia, ' ', C.hora) AS FechaHora,
          S.nombreServicio AS TipoCita,
          S.precioServicio AS ValorConsulta,
          CONCAT(doctor.nombreUsuario, ' ', doctor.apellidoUsuario) AS Doctor
        FROM 
          CITAS AS C
        INNER JOIN 
          USUARIOS AS paciente ON C.idUsuarioCC = paciente.CC
        LEFT JOIN 
          USUARIOS AS doctor ON C.idDocCC = doctor.CC
        INNER JOIN 
          SERVICIOS AS S ON C.idServicio = S.idServicio`;

      const [rows]: any = await connection.query(query);

      if (rows.length === 0) {
        throw new NotFoundError('No se encontraron citas.');
      }

      return rows.map((row: any) => ({
        NombreCompleto: row.NombreCompleto,
        CorreoElectronico: row.CorreoElectronico,
        Documento: row.Documento,
        FechaHora: row.FechaHora,
        TipoCita: row.TipoCita,
        ValorConsulta: row.ValorConsulta,
        Doctor: row.Doctor || null
      })) as CitaDetalladaParaAgendar[];
    } catch (error: any) {
      console.error('Error retrieving detailed appointment data:', error);
      throw new DatabaseError('Error en la base de datos al obtener los detalles de las citas');
    }
  }

  // Obtener citas detalladas para reagendar por cédula
  public async getCitasDetalladasPorId(idUsuarioCC: string): Promise<ReagendarCitadetallada[]> {
    try {
      const query = `
        SELECT 
          CONCAT(paciente.nombreUsuario, ' ', paciente.apellidoUsuario) AS NombreCompleto,
          paciente.emailUsuario AS CorreoElectronico,
          paciente.CC AS Documento,
          CONCAT(C.dia, ' ', C.hora) AS FechaHora,
          S.nombreServicio AS TipoCita,
          S.precioServicio AS ValorConsulta,
          CONCAT(doctor.nombreUsuario, ' ', doctor.apellidoUsuario) AS Doctor,
          hv.direccion AS Direccion,
          hv.telefonoUsuario AS Telefono
        FROM 
          CITAS AS C
        INNER JOIN 
          USUARIOS AS paciente ON C.idUsuarioCC = paciente.CC
        LEFT JOIN 
          USUARIOS AS doctor ON C.idDocCC = doctor.CC
        INNER JOIN 
          SERVICIOS AS S ON C.idServicio = S.idServicio
        INNER JOIN 
          HOJAS_VIDA AS hv ON paciente.idHoja_Vida = hv.idHoja_Vida
        WHERE 
          paciente.CC = ?`;

      const [rows]: any = await connection.query(query, [idUsuarioCC]);

      if (rows.length === 0) {
        throw new NotFoundError('No se encontraron citas para el paciente especificado.');
      }

      return rows.map((row: any) => ({
        NombreCompleto: row.NombreCompleto,
        CorreoElectronico: row.CorreoElectronico,
        Documento: row.Documento,
        FechaHora: row.FechaHora,
        TipoCita: row.TipoCita,
        ValorConsulta: row.ValorConsulta,
        Doctor: row.Doctor || null,
        Direccion: row.Direccion || null,
        Telefono: row.Telefono || null
      })) as ReagendarCitadetallada[];
    } catch (error: any) {
      console.error('Error retrieving detailed appointment data by patient ID:', error);
      throw new DatabaseError('Error en la base de datos al obtener los detalles de las citas');
    }
  }
}

export default new CitasService();
