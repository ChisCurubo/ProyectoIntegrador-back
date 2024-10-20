import connection from '../providers/database';
import { Cita } from '../interface/Citas';
import { HistoriaClinica } from '../interface/historiaClinica';

import { NotFoundError, DatabaseError, InternalServerError } from '../middlewares/customErrors';

class HistoriaClinicaService {

  public async getHistoriaClinicaByUsuarioCC(idUsuarioCC: string): Promise<HistoriaClinica | null> {
    const query = `
      SELECT HM.* FROM HISTORIA_MEDICA HM
      INNER JOIN CITAS C ON C.idHistoria_Medica = HM.idHistoria_Medica
      WHERE C.idUsuarioCC = ?
      ORDER BY C.dia DESC, C.hora DESC LIMIT 1;
    `;
  
    try {
      const [rows]: [any[], any] = await connection.query(query, [idUsuarioCC]);
      if (rows.length === 0) {
        throw new NotFoundError('No se encontró la historia clínica para el paciente');
      }
      return rows[0]; // Devuelve la primera fila, que es la historia clínica
    } catch (error) {
      throw new DatabaseError('Error al obtener la historia clínica para el paciente');
    }
  }
  
  // Crear una nueva historia clínica
  public async createHistorialClinico(historiaClinica: HistoriaClinica): Promise<HistoriaClinica> {
    const query = `
      INSERT INTO HISTORIA_MEDICA (
        tipoSangre, genero, fecha_Nac, discapacidad, fecha_Rev, hora_Rev, motivo, descripcion_Motivo, 
        presion_Sangre, presion_Sangre_Prom, pulso, saturacion, altura, peso, perinatales, patologicos, 
        quirurgicos, vacunas, familiares, conclusion, diagnostico, tratamiento, firma_digital_doctor
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      historiaClinica.tipoSangre, historiaClinica.genero, historiaClinica.fecha_Nac, historiaClinica.discapacidad,
      historiaClinica.fecha_Rev, historiaClinica.hora_Rev, historiaClinica.motivo, historiaClinica.descripcion_Motivo,
      historiaClinica.presion_Sangre, historiaClinica.presion_Sangre_Prom, historiaClinica.pulso, historiaClinica.saturacion,
      historiaClinica.altura, historiaClinica.peso, historiaClinica.perinatales, historiaClinica.patologicos,
      historiaClinica.quirurgicos, historiaClinica.vacunas, historiaClinica.familiares, historiaClinica.conclusion,
      historiaClinica.diagnostico, historiaClinica.tratamiento, historiaClinica.firma_digital_doctor
    ];

    try {
      const result = await connection.query(query, params);
      if (result && result.length) {
        return historiaClinica;
      } else {
        throw new DatabaseError('Error al crear la historia clínica');
      }
    } catch (error) {
      throw new DatabaseError('Error al crear la historia clínica');
    }
  }

  public async getHistoriaClinicaById(idHistoria: number): Promise<HistoriaClinica | null> {
    const query = 'SELECT * FROM HISTORIA_MEDICA WHERE idHistoria_Medica = ?';
    try {
      const [rows]: any = await connection.query(query, [idHistoria]);
      if (rows.length === 0) {
        console.log(`No se encontró historia clínica con ID: ${idHistoria}`);
        return null;
      }
      return rows[0] as HistoriaClinica;
    } catch (error) {
      console.error('Error al obtener la historia clínica:', error);
      throw new DatabaseError(`Error al obtener la historia clínica: ${(error as Error).message}`);
    }
  }
  

  // Actualizar una historia clínica por ID
  public async updateHistoriaClinicaById(idHistoria: number, historiaClinica: HistoriaClinica): Promise<HistoriaClinica | null> {
    const query = `
      UPDATE HISTORIA_MEDICA SET 
        tipoSangre = ?, genero = ?, fecha_Nac = ?, discapacidad = ?, fecha_Rev = ?, hora_Rev = ?, motivo = ?, 
        descripcion_Motivo = ?, presion_Sangre = ?, presion_Sangre_Prom = ?, pulso = ?, saturacion = ?, altura = ?, 
        peso = ?, perinatales = ?, patologicos = ?, quirurgicos = ?, vacunas = ?, familiares = ?, conclusion = ?, 
        diagnostico = ?, tratamiento = ?, firma_digital_doctor = ? 
      WHERE idHistoria_Medica = ?
    `;

    const params = [
      historiaClinica.tipoSangre, historiaClinica.genero, historiaClinica.fecha_Nac, historiaClinica.discapacidad,
      historiaClinica.fecha_Rev, historiaClinica.hora_Rev, historiaClinica.motivo, historiaClinica.descripcion_Motivo,
      historiaClinica.presion_Sangre, historiaClinica.presion_Sangre_Prom, historiaClinica.pulso, historiaClinica.saturacion,
      historiaClinica.altura, historiaClinica.peso, historiaClinica.perinatales, historiaClinica.patologicos,
      historiaClinica.quirurgicos, historiaClinica.vacunas, historiaClinica.familiares, historiaClinica.conclusion,
      historiaClinica.diagnostico, historiaClinica.tratamiento, historiaClinica.firma_digital_doctor, idHistoria
    ];

    try {
      const [result] = await connection.query(query, params);
      if (!result) {
        throw new NotFoundError('No se encontró la historia clínica para actualizar');
      }
      return { ...historiaClinica, idHistoria_Medica: idHistoria };
    } catch (error) {
      throw new DatabaseError('Error al actualizar la historia clínica');
    }
  }

  public async deleteHistoriaClinicaById(idHistoria: number): Promise<boolean> {
    const query = 'DELETE FROM HISTORIA_MEDICA WHERE idHistoria_Medica = ?';
    try {
      const [result]: any = await connection.query(query, [idHistoria]);
      
      // Verifica si alguna fila fue afectada (lo que indica que la historia clínica fue eliminada)
      if (result.affectedRows === 0) {
        throw new NotFoundError('No se encontró la historia clínica para eliminar');
      } else {
        return result.affectedRows;
      }
    } catch (error) {
      throw new DatabaseError('Error al eliminar la historia clínica');
    }
  }

  // Obtener todas las historias clínicas
  public async getHistoriasClinicas(): Promise<HistoriaClinica[]> {
    const query = 'SELECT * FROM HISTORIA_MEDICA';
    try {
      const [rows] = await connection.query(query);
      return rows as HistoriaClinica[];
    } catch (error) {
      throw new DatabaseError('Error al obtener las historias clínicas');
    }
  }

  public async duplicateHistorial(idUser: number): Promise<number> {
    try {
      // Obtener la última cita del usuario
      const query = 'SELECT * FROM CITAS WHERE idUsuarioCC = ? AND estadoCita = 0 ORDER BY dia DESC, hora DESC LIMIT 1;';
      const [rows]: [any, any] = await connection.query(query, [idUser]);
  
      // Verificar si hay una cita y si tiene un historial médico asociado
      if (rows.length > 0 && rows[0].idHistoria_Medica != null) {
        const idHistoriaMedica = rows[0].idHistoria_Medica;
  
        // Duplicar el historial médico asociado a la cita
        const query2 = `
          INSERT INTO ProyectoIntegrador1.HISTORIA_MEDICA (
              tipoSangre, genero, fecha_Nac, discapacidad, fecha_Rev, hora_Rev, motivo, descripcion_Motivo, 
              presion_Sangre, presion_Sangre_Prom, pulso, saturacion, altura, peso, perinatales, 
              patologicos, quirurgicos, vacunas, familiares, conclusion
          )
          SELECT 
              tipoSangre, genero, fecha_Nac, discapacidad, fecha_Rev, hora_Rev, motivo, descripcion_Motivo, 
              presion_Sangre, presion_Sangre_Prom, pulso, saturacion, altura, peso, perinatales, 
              patologicos, quirurgicos, vacunas, familiares, conclusion
          FROM ProyectoIntegrador1.HISTORIA_MEDICA
          WHERE idHistoria_Medica = ?;
        `;
        const [result]: any = await connection.query(query2, [idHistoriaMedica]);
  
        // Devolver el último idHistoria_Medica insertado
        if (result && result.insertId) {
          return result.insertId;
        } else {
          throw new DatabaseError('Error al duplicar el historial clínico');
        }
      } else {
        throw new NotFoundError('No se encontró un historial médico asociado a la cita del usuario');
      }
    } catch (error) {
      console.error('Error al duplicar el historial clínico:', error);
      throw error instanceof NotFoundError ? error : new InternalServerError('Error interno al duplicar el historial clínico');
    }
  }
  
  
}

export default new HistoriaClinicaService();
