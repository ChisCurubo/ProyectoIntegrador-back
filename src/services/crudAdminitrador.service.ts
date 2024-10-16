import bcrypt from 'bcrypt';
import { Cita1 } from '../interface/Citas';
import { Emergencia } from '../interface/Emergencias';
import { Usuario } from '../interface/User';
import connection from '../providers/database';

import {
    AudColillaPago,
    AudFacturaElectronica,
    AudHistoriaMedica,
    AudHojasVida,
    AudSedes,
    AudUsuarios,
    AutorizacionesMedicas
} from '../interface/Auditorias'; // 
import { CitaEmergencia, EmergenciaDetalle } from '../interface/Emergencias';

class AdminService {
  // Crear un nuevo médico o paciente
  public async createUsuario(usuario: Usuario, rol: number): Promise<void> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(usuario.pwdUsuario, saltRounds);
      const query = `INSERT INTO USUARIOS (CC, nombreUsuario, apellidoUsuario, emailUsuario, pwdUsuario, idRol, idSede, estadoUsuario, idEspecialidad, idHoja_Vida, idTipoPaciente)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [
        usuario.CC,
        usuario.nombreUsuario,
        usuario.apellidoUsuario,
        usuario.emailUsuario,
        hashedPassword,
        rol,
        usuario.idSede,
        usuario.estadoUsuario,
        usuario.idEspecialidad,
        usuario.idHoja_Vida,
        usuario.idTipoPaciente,
      ];
      await connection.query(query, params);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new Error('Error al crear el usuario');
    }
  }

  // Actualizar un médico o paciente por CC
  public async updateUsuarioByCC(CC: string, usuario: Usuario): Promise<void> {
    try {
      const query = `UPDATE USUARIOS SET nombreUsuario = ?, apellidoUsuario = ?, emailUsuario = ?, idSede = ?, idEspecialidad = ?, idHoja_Vida = ?, estadoUsuario = ? WHERE CC = ?`;
      const params = [
        usuario.nombreUsuario,
        usuario.apellidoUsuario,
        usuario.emailUsuario,
        usuario.idSede,
        usuario.idEspecialidad,
        usuario.idHoja_Vida,
        usuario.estadoUsuario,
        CC,
      ];
      await connection.query(query, params);
    } catch (error) {
      console.error(`Error al actualizar el usuario con cédula ${CC}:`, error);
      throw new Error(`Error al actualizar el usuario con cédula ${CC}`);
    }
  }

  // Eliminar un usuario por CC
  public async deleteUsuarioByCC(CC: string): Promise<void> {
    try {
      const query = 'DELETE FROM USUARIOS WHERE CC = ?';
      await connection.query(query, [CC]);
      console.log(`Usuario con cédula ${CC} eliminado exitosamente.`);
    } catch (error) {
      console.error(`Error al eliminar el usuario con cédula ${CC}:`, error);
      throw new Error(`Error al eliminar el usuario con cédula ${CC}`);
    }
  }

  // Obtener todas las emergencias
  public async getAllEmergencias(): Promise<Emergencia[]> {
    try {
      const query = 'SELECT * FROM EMERGENCIAS';
      const [rows]: any[] = await connection.query(query);
      return rows as Emergencia[];
    } catch (error) {
      console.error('Error al obtener emergencias:', error);
      throw new Error('Error al obtener emergencias');
    }
  }

  // Obtener una emergencia por ID
  public async getEmergenciaById(idEmergencia: number): Promise<Emergencia | null> {
    try {
      const query = 'SELECT * FROM EMERGENCIAS WHERE idEmergencia = ?';
      const [rows]: any[] = await connection.query(query, [idEmergencia]);
      return rows.length > 0 ? (rows[0] as Emergencia) : null;
    } catch (error) {
      console.error(`Error al obtener la emergencia con ID ${idEmergencia}:`, error);
      throw new Error(`Error al obtener la emergencia con ID ${idEmergencia}`);
    }
  }

  // Actualizar una emergencia por ID
public async updateEmergenciaById(idEmergencia_Cita: number, emergencia: CitaEmergencia): Promise<void> {
    try {
      const query = `UPDATE EMERGENCIAS_CITAS SET idEmergencia = ?, idCita = ?, idServicio = ?, estatusEmergencia_Cita = ? WHERE idEmergencia_Cita = ?`;
      const params = [
        emergencia.idEmergencia,
        emergencia.idCita,
        emergencia.idServicio,
        emergencia.estatusEmergencia_Cita,
        idEmergencia_Cita
      ];
      const [result]: any = await connection.query(query, params);
  
      if (result.affectedRows === 0) {
        throw new Error(`No se encontró ninguna emergencia con ID ${idEmergencia_Cita}`);
      }
    } catch (error) {
      console.error(`Error al actualizar la emergencia con ID ${idEmergencia_Cita}:`, error);
      throw new Error(`Error al actualizar la emergencia con ID ${idEmergencia_Cita}`);
    }
  }

  
  // Crear una nueva emergencia
public async createEmergencia(emergencia: CitaEmergencia): Promise<void> {
    try {
      const query = `INSERT INTO EMERGENCIAS_CITAS (idEmergencia, idCita, idServicio, estatusEmergencia_Cita)
                     VALUES (?, ?, ?, ?)`;
      const params = [
        emergencia.idEmergencia,
        emergencia.idCita,
        emergencia.idServicio,
        emergencia.estatusEmergencia_Cita
      ];
      await connection.query(query, params);
      console.log('Emergencia creada exitosamente.');
    } catch (error) {
      console.error('Error al crear la emergencia:', error);
      throw new Error('Error al crear la emergencia');
    }
  }
  

  // Eliminar una emergencia por ID
  public async deleteEmergenciaById(idEmergencia: number): Promise<void> {
    try {
      const query = 'DELETE FROM EMERGENCIAS_CITAS WHERE idEmergencia = ?';
      await connection.query(query, [idEmergencia]);
      console.log(`Emergencia con ID ${idEmergencia} eliminada exitosamente.`);
    } catch (error) {
      console.error(`Error al eliminar la emergencia con ID ${idEmergencia}:`, error);
      throw new Error(`Error al eliminar la emergencia con ID ${idEmergencia}`);
    }
  }

  // Obtener todas las citas
  public async getAllCitas(): Promise<Cita1[]> {
    try {
      const query = 'SELECT * FROM CITAS';
      const [rows]: any[] = await connection.query(query);
      return rows as Cita1[];
    } catch (error) {
      console.error('Error al obtener citas:', error);
      throw new Error('Error al obtener citas');
    }
  }

  // Obtener una cita por ID
  public async getCitaById(idCita: number): Promise<Cita1 | null> {
    try {
      const query = 'SELECT * FROM CITAS WHERE idCita = ?';
      const [rows]: any[] = await connection.query(query, [idCita]);
      return rows.length > 0 ? (rows[0] as Cita1) : null;
    } catch (error) {
      console.error(`Error al obtener la cita con ID ${idCita}:`, error);
      throw new Error(`Error al obtener la cita con ID ${idCita}`);
    }
  }

 // Crear una nueva cita
public async createCita(cita: Cita1): Promise<void> {
  try {
    const query = `INSERT INTO CITAS (dia, hora, estadoCita, idServicio, idHistoria_Medica, idUsuarioCC, idDocCC)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      cita.dia,
      cita.hora,
      cita.estadoCita,
      cita.idServicio,
      cita.idHistoria_Medica,
      cita.idUsuarioCC,
      cita.idDocCC
    ];
    await connection.query(query, params);
    console.log('Cita creada exitosamente.');
  } catch (error) {
    console.error('Error al crear la cita:', error);
    throw new Error('Error al crear la cita');
  }
}


// Actualizar una cita por ID
public async updateCitaById(idCita: number, cita: Cita1): Promise<void> {
  try {
    const query = `UPDATE CITAS SET dia = ?, hora = ?, estadoCita = ?, idServicio = ?, idHistoria_Medica = ?, idUsuarioCC = ?, idDocCC = ? WHERE idCita = ?`;
    const params = [
      cita.dia,
      cita.hora,
      cita.estadoCita,
      cita.idServicio,
      cita.idHistoria_Medica,
      cita.idUsuarioCC,
      cita.idDocCC,
      idCita
    ];
    await connection.query(query, params);
    console.log(`Cita con ID ${idCita} actualizada exitosamente.`);
  } catch (error) {
    console.error(`Error al actualizar la cita con ID ${idCita}:`, error);
    throw new Error(`Error al actualizar la cita con ID ${idCita}`);
  }
}


  // Eliminar una cita por ID
  public async deleteCitaById(idCita: number): Promise<void> {
    try {
      const query = 'DELETE FROM CITAS WHERE idCita = ?';
      await connection.query(query, [idCita]);
      console.log(`Cita con ID ${idCita} eliminada exitosamente.`);
    } catch (error) {
      console.error(`Error al eliminar la cita con ID ${idCita}:`, error);
      throw new Error(`Error al eliminar la cita con ID ${idCita}`);
    }
  }

  // Obtener todas las citas de emergencias
  public async getAllCitasEmergencias(): Promise<CitaEmergencia[]> {
    try {
      const query = 'SELECT * FROM CITAS_EMERGENCIAS';
      const [rows]: any[] = await connection.query(query);
      return rows as CitaEmergencia[];
    } catch (error) {
      console.error('Error al obtener citas de emergencias:', error);
      throw new Error('Error al obtener citas de emergencias');
    }
  }

  // Obtener una cita de emergencia por ID
  public async getCitaEmergenciaById(idCitaEmergencia: number): Promise<CitaEmergencia | null> {
    try {
      const query = 'SELECT * FROM CITAS_EMERGENCIAS WHERE idCitaEmergencia = ?';
      const [rows]: any[] = await connection.query(query, [idCitaEmergencia]);
      return rows.length > 0 ? (rows[0] as CitaEmergencia) : null;
    } catch (error) {
      console.error(`Error al obtener la cita de emergencia con ID ${idCitaEmergencia}:`, error);
      throw new Error(`Error al obtener la cita de emergencia con ID ${idCitaEmergencia}`);
    }
  }

 // Ver todas las auditorías de colilla de pago
 public async getAllAudColillaPago(): Promise<AudColillaPago[]> {
  try {
    const [rows] = await connection.query('SELECT * FROM AUD_COLILLA_PAGO');
    return rows as AudColillaPago[];
  } catch (error) {
    console.error('Error al obtener auditorías de colilla de pago:', error);
    throw new Error('Error al obtener auditorías de colilla de pago');
  }
}

// Ver todas las auditorías de factura electrónica
public async getAllAudFacturaElectronica(): Promise<AudFacturaElectronica[]> {
  try {
    const [rows] = await connection.query('SELECT * FROM AUD_FACTURA_ELECTRONICA');
    return rows as AudFacturaElectronica[];
  } catch (error) {
    console.error('Error al obtener auditorías de factura electrónica:', error);
    throw new Error('Error al obtener auditorías de factura electrónica');
  }
}

// Ver todas las auditorías de historia médica
public async getAllAudHistoriaMedica(): Promise<AudHistoriaMedica[]> {
  try {
    const [rows] = await connection.query('SELECT * FROM AUD_HISTORIA_MEDICA');
    return rows as AudHistoriaMedica[];
  } catch (error) {
    console.error('Error al obtener auditorías de historia médica:', error);
    throw new Error('Error al obtener auditorías de historia médica');
  }
}

// Ver todas las auditorías de hojas de vida
public async getAllAudHojasVida(): Promise<AudHojasVida[]> {
  try {
    const [rows] = await connection.query('SELECT * FROM AUD_HOJAS_VIDA');
    return rows as AudHojasVida[];
  } catch (error) {
    console.error('Error al obtener auditorías de hojas de vida:', error);
    throw new Error('Error al obtener auditorías de hojas de vida');
  }
}

// Ver todas las auditorías de usuarios
public async getAllAudUsuarios(): Promise<AudUsuarios[]> {
  try {
    const [rows] = await connection.query('SELECT * FROM AUD_USUARIOS');
    return rows as AudUsuarios[];
  } catch (error) {
    console.error('Error al obtener auditorías de usuarios:', error);
    throw new Error('Error al obtener auditorías de usuarios');
  }
}

// Ver todas las auditorías de sedes
public async getAllAudSedes(): Promise<AudSedes[]> {
  try {
    const [rows] = await connection.query('SELECT * FROM AUD_SEDES');
    return rows as AudSedes[];
  } catch (error) {
    console.error('Error al obtener auditorías de sedes:', error);
    throw new Error('Error al obtener auditorías de sedes');
  }
}

// Ver todas las autorizaciones médicas
public async getAllAutorizacionesMedicas(): Promise<AutorizacionesMedicas[]> {
  try {
    const [rows] = await connection.query('SELECT * FROM AUTORIZACIONES_MEDICAS');
    return rows as AutorizacionesMedicas[];
  } catch (error) {
    console.error('Error al obtener autorizaciones médicas:', error);
    throw new Error('Error al obtener autorizaciones médicas');
  }
}

// Método para obtener emergencias con detalles
public async getEmergenciasConDetalles(): Promise<EmergenciaDetalle[]> {
  try {
    const query = `
      SELECT 
        U.nombreUsuario AS Nombre,
        U.CC AS CC,
        E.horaLlegada AS 'Hora de Llegada',
        E.idTipo_Emergencia AS 'Nivel de Emergencia',
        CASE 
          WHEN E.estadoEmergencia = 1 THEN 'Activa'
          WHEN E.estadoEmergencia = 0 THEN 'Inactiva'
          ELSE 'Desconocido'
        END AS Estado,
        D.nombreUsuario AS 'Doctor Asignado'
      FROM 
        EMERGENCIAS E
      JOIN 
        EMERGENCIAS_CITAS EC ON E.idEmergencia = EC.idEmergencia
      JOIN 
        CITAS C ON EC.idCita = C.idCita
      JOIN 
        USUARIOS U ON C.idUsuarioCC = U.CC
      LEFT JOIN 
        USUARIOS D ON C.idDocCC = D.CC
    `;
    
    const [rows]: [EmergenciaDetalle[], any] = await connection.query(query) as [EmergenciaDetalle[], any];
    return rows;
  } catch (error) {
    console.error('Error al obtener emergencias con detalles:', error);
    throw new Error('Error al obtener emergencias con detalles');
  }
}

}


export default new AdminService();

