import { format } from "date-fns";
import { Cita, CitaConPacientesYDoctores, CitaDetalladaParaAgendar, CitaHorario, ReagendarCitadetallada } from "../interface/Citas";
import { BadRequestError, DatabaseError, NotFoundError } from "../middlewares/customErrors"; // Incluye DatabaseError
import connection from "../providers/database";

class CitasService {

  public async createCita(fecha: string, hora: string, medico: string, idUsuario: number, historialMedico?: string, idServicio?: number): Promise<any> {
    try {
      const query = `INSERT INTO CITAS (dia, hora, idDocCC, idUsuarioCC${historialMedico ? ", idHistoria_Med" : ""}${idServicio ? ", idServicio" : ""})
                       VALUES (?, ?, ?, ?${historialMedico ? ", ?" : ""}${idServicio ? ", ?" : ""})`;

      const params = [fecha, hora, medico, idUsuario];
      if (historialMedico) {
        params.push(historialMedico);
      }
      if (idServicio) {
        params.push(idServicio);
      }
      const [result]: any = await connection.execute(query, params);

      return { id: result.insertId, message: "Cita creada exitosamente" };
    } catch (error: any) {
      console.error("Error creating cita:", error);
      throw new DatabaseError("Error en la base de datos al crear la cita");
    }
  }


  public async createCitaWithHistorial(fecha: string, hora: string, medico: string, idUsuario: string, historialPasado: number): Promise<any> {
    try {
      const query = `INSERT INTO CITAS (dia, hora, idDocCC, idUsuarioCC, idHistoria_Medica)
                     VALUES (?, ?, ?, ?, ?)`;
      const [result]: any = await connection.execute(query, [fecha, hora, medico, idUsuario, historialPasado]);
      return { id: result.insertId, message: "Cita creada exitosamente con historial" };
    } catch (error: any) {
      console.error("Error creating cita with historial:", error);
      throw new DatabaseError("Error en la base de datos al crear la cita con historial");
    }
  }

  public async createCitaLocal(idDocCC: string, idUsuarioCC: string, idHistoria: number): Promise<any> {
    try {
      const [result] = await connection.execute(
        "INSERT INTO CITAS (dia, hora, idDocCC, idUsuarioCC, estadoCita, idServicio, idHistoria_Medica) VALUES (CURDATE(), LEFT(CURTIME(), 5), ?, ?, 1, 9,?)",
        [idDocCC, idUsuarioCC, idHistoria],
      );

      console.log(`Cita creada para el doctor ${idDocCC} y el usuario ${idUsuarioCC}`);

      return result;
    } catch (error) {
      console.error("Error creating cita:", error);
      throw new DatabaseError("Error en la base de datos al crear la cita");
    }
  }

  // Actualizar fecha y hora de la cita
  public async updateDateCita(fecha: string, hora: string, idCita: number): Promise<boolean> {
    try {
      const query = "UPDATE CITAS SET dia = ?, hora = ? WHERE idCita = ?";
      const [result]: any = await connection.query(query, [fecha, hora, idCita]);
      if (result.affectedRows === 0) {
        throw new NotFoundError("Cita no encontrada");
      }
      return true;
    } catch (error: any) {
      console.error("Error updating cita date:", error);
      if (error instanceof NotFoundError) { throw error; }
      throw new DatabaseError("Error en la base de datos al actualizar la fecha y hora de la cita");
    }
  }

  // Actualizar estado de la cita
  public async updateStatusCita(estado: string, idCita: number): Promise<boolean> {
    try {
      const query = "UPDATE CITAS SET estadoCita = ? WHERE idCita = ?";
      const [result]: any = await connection.query(query, [estado, idCita]);
      if (result.affectedRows === 0) {
        throw new NotFoundError("Cita no encontrada");
      }
      return true;
    } catch (error: any) {
      console.error("Error updating cita status:", error);
      if (error instanceof NotFoundError) { throw error; }
      throw new DatabaseError("Error en la base de datos al actualizar el estado de la cita");
    }
  }

  // Actualizar todos los campos de una cita
  public async updateCitasAll(fecha: string, hora: string, medico: string, estado: string, idCita: number, idUsuario: number): Promise<boolean> {
    try {
      const query = `UPDATE CITAS SET dia = ?, hora = ?, idDocCC = ?, estadoCita = ?
                       WHERE idCita = ? AND idUsuarioCC = ?`;
      const [result]: any = await connection.query(query, [fecha, hora, medico, estado, idCita, idUsuario]);
      if (result.affectedRows === 0) {
        throw new NotFoundError("Cita no encontrada");
      }
      return true;
    } catch (error: any) {
      console.error("Error updating cita details:", error);
      if (error instanceof NotFoundError) { throw error; }
      throw new DatabaseError("Error en la base de datos al actualizar los detalles de la cita");
    }
  }

  // Eliminar una cita por id y usuario
  public async deleteCitasAll(idCita: number, idUsuario: number): Promise<boolean> {
    try {
      const query = "DELETE FROM CITAS WHERE idCita = ? AND idUsuarioCC = ?";
      const [result]: any = await connection.execute(query, [idCita, idUsuario]);
      if (result.affectedRows === 0) {
        throw new NotFoundError("Cita no encontrada para eliminar");
      }
      return true;
    } catch (error: any) {
      console.error("Error deleting cita:", error);
      if (error instanceof NotFoundError) { throw error; }
      throw new DatabaseError("Error en la base de datos al eliminar la cita");
    }
  }

  // Eliminar una cita por id de cita
  public async deleteCitasId(idCita: number): Promise<boolean> {
    try {
      const query = "DELETE FROM CITAS WHERE idCita = ? ";
      const [result]: any = await connection.execute(query, [idCita]);
      if (result.affectedRows === 0) {
        throw new NotFoundError("Cita no encontrada para eliminar");
      }
      return true;
    } catch (error: any) {
      console.error("Error deleting cita:", error);
      if (error instanceof NotFoundError) { throw error; }
      throw new DatabaseError("Error en la base de datos al eliminar la cita");
    }
  }

  // Eliminar todas las citas de un usuario por su id
  public async deleteCitasUsuario(idUsuario: number): Promise<boolean> {
    try {
      const query = "DELETE FROM CITAS WHERE idUsuarioCC = ?";
      const [result]: any = await connection.execute(query, [idUsuario]);
      if (result.affectedRows === 0) {
        throw new NotFoundError("Cita no encontrada para eliminar");
      }
      return true;
    } catch (error: any) {
      console.error("Error deleting cita:", error);
      if (error instanceof NotFoundError) { throw error; }
      throw new DatabaseError("Error en la base de datos al eliminar la cita");
    }
  }

  // Obtener citas por usuario
  public async getCitasByUser(idUsuario: number): Promise<any[]> {
    try {
      const query = "SELECT * FROM CITAS WHERE idUsuarioCC = ?";
      const [rows]: any = await connection.query(query, [idUsuario]);
      if (rows.length === 0) {
        throw new NotFoundError("No se encontraron citas para este usuario");
      }
      return rows.map((row: any) => ({
        ...row,
        dia: format(new Date(row.dia), "dd/MM/yyyy"),
      }));
    } catch (error: any) {
      console.error("Error getting citas by user:", error);
      if (error instanceof NotFoundError) { throw error; }
      throw new DatabaseError("Error en la base de datos al obtener citas del usuario");
    }
  }

  // Obtener citas por doctor
  public async getCitasByDoctor(idDoctor: number): Promise<any[]> {
    try {
      const query = "SELECT hora, dia, idUsuarioCC, idCita FROM CITAS WHERE idDocCC = ?";
      const [rows]: any = await connection.query(query, [idDoctor]);
      if (rows.length === 0) {
        throw new NotFoundError("No se encontraron citas para este médico");
      }
      return rows.map((row: any) => ({
        ...row,
        dia: format(new Date(row.dia), "dd/MM/yyyy"),
      }));
    } catch (error: any) {
      console.error("Error getting citas by doctor:", error);
      if (error instanceof NotFoundError) { throw error; }
      throw new DatabaseError("Error en la base de datos al obtener citas del médico");
    }
  }

  public async getCitaById(idCita: number): Promise<Cita> {
    try {
      const query = "SELECT hora, dia, idDocCC FROM CITAS WHERE idCita = ?";
      const [rows]: any = await connection.query(query, [idCita]);
  
      if (rows.length === 0) {
        throw new NotFoundError("Cita no encontrada por ID");
      }
  
      const cita = rows[0];
      cita.dia = format(new Date(cita.dia), "dd-MM-yyyy");

      return cita as Cita;
    } catch (error: any) {
      console.error("Error getting cita by id:", error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error en la base de datos al obtener la cita por ID");
    }
  }

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
        throw new NotFoundError("No se encontraron citas.");
      }

      return rows.map((row: any) => ({
        Hora: row.Hora,
        Día: format(new Date(row.Día), "dd/MM/yyyy"), // Formatear la fecha si es necesario
        NombrePaciente: row.NombrePaciente,
        NombreDoctor: row.NombreDoctor || null, // Asignar null si no hay doctor
      })) as CitaConPacientesYDoctores[];
    } catch (error: any) {
      console.error("Error getting citas with patients and doctors:", error);
      throw new DatabaseError("Error en la base de datos al obtener citas con pacientes y doctores");
    }
  }

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
              SERVICIOS AS S ON C.idServicio = S.idServicio;
        `;
      const [rows]: any = await connection.query(query);

      if (rows.length === 0) {
        throw new NotFoundError("No se encontraron citas.");
      }

      return rows.map((row: any) => ({
        NombreCompleto: row.NombreCompleto,
        CorreoElectronico: row.CorreoElectronico,
        Documento: row.Documento,
        FechaHora: row.FechaHora,
        TipoCita: row.TipoCita,
        ValorConsulta: row.ValorConsulta,
        Doctor: row.Doctor || null, // Asignar null si no hay doctor
      })) as CitaDetalladaParaAgendar[];
    } catch (error: any) {
      console.error("Error retrieving detailed appointment data:", error);
      throw new DatabaseError("Error en la base de datos al obtener los detalles de las citas");
    }
  }

  public async getCitasWithPatientsAndDoctorsByCC(cedula: string): Promise<CitaConPacientesYDoctores[]> {
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
                  USUARIOS AS doctor ON C.idDocCC = doctor.CC
              WHERE
                  paciente.CC = ?`; // Filtrar por cédula del paciente

      const [rows]: any = await connection.query(query, [cedula]);

      // Comprobación de resultados
      if (rows.length === 0) {
        throw new NotFoundError("No se encontraron citas para la cédula proporcionada.");
      }

      // Mapear las filas a la interfaz
      return rows.map((row: any) => ({
        Hora: row.Hora,
        Día: format(new Date(row.Día), "dd/MM/yyyy"), // Formatear la fecha si es necesario
        NombrePaciente: row.NombrePaciente,
        NombreDoctor: row.NombreDoctor || null, // Asignar null si no hay doctor
      })) as CitaConPacientesYDoctores[];
    } catch (error: any) {
      console.error("Error getting citas with patients and doctors by CC:", error);
      throw new DatabaseError("Error en la base de datos al obtener citas con pacientes y doctores por cédula");
    }
  }

  public async getCitasDetalladasParaAgendarByCC(cedula: string): Promise<CitaDetalladaParaAgendar[]> {
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
              SERVICIOS AS S ON C.idServicio = S.idServicio
          WHERE
              paciente.CC = ?;`; // Filtrar por cédula del paciente

      const [rows]: any = await connection.query(query, [cedula]);
      if (rows.length === 0) {
        throw new NotFoundError("No se encontraron citas para la cédula proporcionada.");
      }

      return rows.map((row: any) => ({
        NombreCompleto: row.NombreCompleto,
        CorreoElectronico: row.CorreoElectronico,
        Documento: row.Documento,
        FechaHora: row.FechaHora,
        TipoCita: row.TipoCita,
        ValorConsulta: row.ValorConsulta,
        Doctor: row.Doctor || null, // Asignar null si no hay doctor
      })) as CitaDetalladaParaAgendar[];
    } catch (error: any) {
      console.error("Error retrieving detailed appointment data by CC:", error);
      throw new DatabaseError("Error en la base de datos al obtener los detalles de las citas por cédula");
    }
  }
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
          paciente.CC = ?;
    `;

      const [rows]: any = await connection.query(query, [idUsuarioCC]);

      if (rows.length === 0) {
        throw new NotFoundError("No se encontraron citas para el paciente especificado.");
      }

      return rows.map((row: any) => ({
        NombreCompleto: row.NombreCompleto,
        CorreoElectronico: row.CorreoElectronico,
        Documento: row.Documento,
        FechaHora: row.FechaHora,
        TipoCita: row.TipoCita,
        ValorConsulta: row.ValorConsulta,
        Doctor: row.Doctor || null,
        Direccion: row.Direccion || null, // Asegúrate de que esto esté presente
        Telefono: row.Telefono || null,      // Asegúrate de que esto esté presente
      })) as ReagendarCitadetallada[];
    } catch (error: any) {
      console.error("Error retrieving detailed appointment data by patient ID:", error);
      throw new DatabaseError("Error en la base de datos al obtener los detalles de las citas");
    }
  }

  public async viewSchedule(ccDoc: string, dia: Date): Promise<string[]> {
    try {
      // Asegúrate de formatear el valor de la fecha si es necesario
      // const formattedDate = format(dia, 'yyyy-MM-dd');

      // Consulta SQL que obtiene las horas disponibles
      const queryStr = `
      WITH RECURSIVE available_hours AS (
        SELECT CAST('06:00:00' AS TIME) AS hora
        UNION ALL
        SELECT ADDTIME(hora, '00:30:00')
        FROM available_hours
        WHERE hora < '18:00:00'
      )
      SELECT hora
      FROM available_hours
      WHERE hora NOT IN (
        SELECT hora
        FROM CITAS
        WHERE dia = ? AND idDocCC = ? AND estadoCita = 1
      );
    `;

      // Ejecuta la consulta y obtiene el resultado
      const [result]: any = await connection.query(queryStr, [dia, ccDoc]);

      if (result.length === 0) {
        throw new Error("No se encontraron horas disponibles para el día seleccionado");
      }

      return result.map((row: CitaHorario) => row.hora); // Devuelve un array de horas disponibles

    } catch (error) {
      console.error("Error al obtener horas disponibles:", error);
      throw new Error("Error al obtener el horario disponible");
    }
  }

  public async deleteCitaById(idCita: number): Promise<boolean> {
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();

      const [result]: any = await conn.query("DELETE FROM CITAS WHERE idCita = ?", [idCita]);

      if (result.affectedRows === 0) {
        await conn.rollback();
        throw new NotFoundError("Cita no encontrada para eliminar");
      }

      await conn.commit();
      return true;
    } catch (error: any) {
      await conn.rollback();
      console.error("Error deleting cita by ID:", error);
      if (error instanceof NotFoundError) { throw error; }
      throw new DatabaseError("Error en la base de datos al eliminar la cita por ID: " + error.message);
    } finally {
      conn.release();
    }
  }

  public async updateCita(id: string, nuevaFecha: string, nuevaHora: string): Promise<boolean> {
    try {
      const query = 'UPDATE CITAS SET dia = ? , hora = ? WHERE IdCita = ?';
      await connection.execute(query, [nuevaFecha, nuevaHora, id]);

      return true;
    } catch (error: any) {
      console.error("Error updating cita:", error);
      if (error instanceof NotFoundError) { throw error; }
      throw new DatabaseError("Error en la base de datos al actualizar la cita");
    }
  }

}

export default new CitasService();
