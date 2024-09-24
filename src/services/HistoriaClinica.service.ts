import{ HistoriaClinica } from '../Interfaces/HistoriaClinica'; 
import connection from '../providers/database';

class HistoriaClinicaService {

  // Crear una nueva historia clínica
  public async crearHistoriaClinica(historiaClinica: HistoriaClinica): Promise<void> {
    const query = `INSERT INTO HISTORIA_MEDICA (
      tipoSangre, genero, fecha_Nac, discapacidad, fecha_Rev, hora_Rev, motivo, descripcion_Motivo, 
      presion_Sangre, presion_Sangre_Prom, pulso, saturacion, altura, peso, perinatales, patologicos, 
      quirurgicos, vacunas, familiares, conclusion, diagnostico, tratamiento, firma_digital_doctor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      historiaClinica.tipoSangre,
      historiaClinica.genero,
      historiaClinica.fecha_Nac,
      historiaClinica.discapacidad,
      historiaClinica.fecha_Rev,
      historiaClinica.hora_Rev,
      historiaClinica.motivo,
      historiaClinica.descripcion_Motivo,
      historiaClinica.presion_Sangre,
      historiaClinica.presion_Sangre_Prom,
      historiaClinica.pulso,
      historiaClinica.saturacion,
      historiaClinica.altura,
      historiaClinica.peso,
      historiaClinica.perinatales,
      historiaClinica.patologicos,
      historiaClinica.quirurgicos,
      historiaClinica.vacunas,
      historiaClinica.familiares,
      historiaClinica.conclusion,
      historiaClinica.diagnostico,
      historiaClinica.tratamiento,
      historiaClinica.firma_digital_doctor
    ];
    
    await connection.query(query, params);
  }

  // Obtener una historia clínica por ID
  public async obtenerHistoriaClinicaPorId(idHistoria: number): Promise<HistoriaClinica | null> {
    const query = 'SELECT * FROM HISTORIA_MEDICA WHERE idHistoria_Medica = ?';
    const [rows]: any[] = await connection.query(query, [idHistoria]);
    return rows.length > 0 ? rows[0] as HistoriaClinica : null;
  }

  // Actualizar una historia clínica por ID
  public async actualizarHistoriaClinicaPorId(idHistoria: number, historiaClinica: HistoriaClinica): Promise<void> {
    const query = `UPDATE HISTORIA_MEDICA SET
      tipoSangre = ?, genero = ?, fecha_Nac = ?, discapacidad = ?, fecha_Rev = ?, hora_Rev = ?, motivo = ?, descripcion_Motivo = ?, 
      presion_Sangre = ?, presion_Sangre_Prom = ?, pulso = ?, saturacion = ?, altura = ?, peso = ?, perinatales = ?, patologicos = ?, 
      quirurgicos = ?, vacunas = ?, familiares = ?, conclusion = ?, diagnostico = ?, tratamiento = ?, firma_digital_doctor = ?
      WHERE idHistoria_Medica = ?`;
    
    const params = [
      historiaClinica.tipoSangre,
      historiaClinica.genero,
      historiaClinica.fecha_Nac,
      historiaClinica.discapacidad,
      historiaClinica.fecha_Rev,
      historiaClinica.hora_Rev,
      historiaClinica.motivo,
      historiaClinica.descripcion_Motivo,
      historiaClinica.presion_Sangre,
      historiaClinica.presion_Sangre_Prom,
      historiaClinica.pulso,
      historiaClinica.saturacion,
      historiaClinica.altura,
      historiaClinica.peso,
      historiaClinica.perinatales,
      historiaClinica.patologicos,
      historiaClinica.quirurgicos,
      historiaClinica.vacunas,
      historiaClinica.familiares,
      historiaClinica.conclusion,
      historiaClinica.diagnostico,
      historiaClinica.tratamiento,
      historiaClinica.firma_digital_doctor,
      idHistoria
    ];
    
    await connection.query(query, params);
  }

  // Eliminar una historia clínica por ID
  public async eliminarHistoriaClinicaPorId(idHistoria: number): Promise<void> {
    const query = 'DELETE FROM HISTORIA_MEDICA WHERE idHistoria_Medica = ?';
    await connection.query(query, [idHistoria]);
  }

  // Obtener todas las historias clínicas
  public async obtenerHistoriasClinicas(): Promise<HistoriaClinica[]> {
    const query = 'SELECT * FROM HISTORIA_MEDICA';
    const [rows]: any[] = await connection.query(query);
    return rows as HistoriaClinica[];
  }
}

export default new HistoriaClinicaService();
