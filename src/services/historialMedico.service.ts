// services/HistorialClinicoService.ts

import connection from '../providers/database';
import HistorialClinico from '../models/HistorialClinico';
import {Cita} from '../Interfaces/Citas';
import { HistoriaMedica } from '../Interfaces/HistoriaMedica';

class HistorialClinicoService {
    private historiales: HistorialClinico[] = []; // Aquí podrías usar una base de datos en lugar de una lista en memoria

    public async createHistorialClinico(data: Partial<HistorialClinico>): Promise<HistorialClinico> {
        const nuevoHistorial = new HistorialClinico(data);
        this.historiales.push(nuevoHistorial);
        return nuevoHistorial;
    }

    public async getHistorialClinico(id: string): Promise<HistorialClinico | undefined> {
        return this.historiales.find(historial => historial.id === id);
    }

    public async duplicateHistorial(idUser: number): Promise<number> {
        try {
            // Primero, obtenemos la última cita del usuario
            const query = 'SELECT * FROM citas WHERE idUsuarioCC = ? AND estadoCita = 0 ORDER BY dia DESC, hora DESC LIMIT 1;';
            const res: Cita | any = await connection.query(query, [idUser]);
    
            // Verificamos si encontramos una cita
            if (res && res.idHistoria_Medica != null) {
                const idHistoriaMedica = res.idHistoria_Medica;
    
                // Ahora duplicamos el historial médico asociado a esa cita
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
    
                // Devolvemos el último idHistoria_Medica insertado
                return result ? result.insertId || 0 : 0; // Manejar el caso donde insertId podría no existir
            }
            return 0;
        } catch (error) {
            console.error("Error duplicating historial:", error);
            return 0;
        }
    }     
}

export default new HistorialClinicoService;
