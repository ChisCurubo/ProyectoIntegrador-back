// services/HistorialClinicoService.ts
import connection from '../providers/database';
import HistorialClinico from '../models/HistorialClinico';
import { Cita } from '../Interfaces/Citas';
import { HistoriaMedica } from '../Interfaces/HistoriaMedica';
import { NotFoundError, DatabaseError, InternalServerError } from '../middlewares/customErrors';

class HistorialClinicoService {
    private historiales: HistorialClinico[] = [];

    public async createHistorialClinico(data: Partial<HistorialClinico>): Promise<HistorialClinico> {
        try {
            const nuevoHistorial = new HistorialClinico(data);
            this.historiales.push(nuevoHistorial);
            return nuevoHistorial;
        } catch (error) {
            console.error('Error al crear el historial clínico:', error);
            throw new InternalServerError('No se pudo crear el historial clínico');
        }
    }

    public async getHistorialClinico(id: string): Promise<HistorialClinico | undefined> {
        try {
            const historial = this.historiales.find(historial => historial.id === id);
            if (!historial) {
                throw new NotFoundError(`Historial clínico con ID ${id} no encontrado`);
            }
            return historial;
        } catch (error) {
            console.error('Error al obtener el historial clínico:', error);
            throw new InternalServerError('Error al obtener el historial clínico');
        }
    }

    public async duplicateHistorial(idUser: number): Promise<number> {
        try {
            // Obtener la última cita del usuario
            const query = 'SELECT * FROM citas WHERE idUsuarioCC = ? AND estadoCita = 0 ORDER BY dia DESC, hora DESC LIMIT 1;';
            const res: Cita | any = await connection.query(query, [idUser]);

            // Verificar si hay una cita y si tiene un historial médico asociado
            if (res && res.idHistoria_Medica != null) {
                const idHistoriaMedica = res.idHistoria_Medica;

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
                const result: any = await connection.query(query2, [idHistoriaMedica]);

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
            throw new InternalServerError('Error interno al duplicar el historial clínico');
        }
    }
}

export default new HistorialClinicoService();
