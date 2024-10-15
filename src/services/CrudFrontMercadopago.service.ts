import { RowDataPacket } from 'mysql2';
import connection from '../providers/database';

import { MercadopagoFront , ColillaPagoEstado } from '../interface/colillaPago';

class MercadoPagoServices {
    // Obtener las colillas de pago activas filtradas solo por cédula de paciente
    public async getColillaPorCC(cc: string): Promise<MercadopagoFront[]> {
        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT 
                    U.nombreUsuario AS Nombre,
                    U.CC,
                    CP.fechaGeneracion AS 'Fecha Colilla',
                    CP.idColilla_Pago AS 'ID Colilla',
                    S.nombreServicio AS 'Nombre del Servicio',
                    CP.valor AS Valor
                FROM 
                    USUARIOS U
                JOIN 
                    CITAS C ON U.CC = C.idUsuarioCC
                JOIN 
                    SERVICIOS S ON C.idServicio = S.idServicio
                JOIN 
                    FACTURA_ELECTRONICA FE ON C.idCita = FE.idCita
                JOIN 
                    COLILLA_PAGO CP ON FE.idColilla_Pago = CP.idColilla_Pago
                WHERE 
                    CP.estaodoCP = 1 AND 
                    U.CC = ?
                ORDER BY 
                    CP.fechaGeneracion DESC;`,
                [cc]
            );
            return rows as MercadopagoFront[];
        } catch (error) {
            console.error('Error en getColillaPorCC:', error);
            throw new Error('Error retrieving payment slips by patient CC');
        }
    }

    // Obtener las colillas de pago activas filtradas solo por ID de colilla
    public async getColillaPorId(idColilla: number): Promise<MercadopagoFront[]> {
        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT 
                    U.nombreUsuario AS Nombre,
                    U.CC,
                    CP.fechaGeneracion AS 'Fecha Colilla',
                    CP.idColilla_Pago AS 'ID Colilla',
                    S.nombreServicio AS 'Nombre del Servicio',
                    CP.valor AS Valor
                FROM 
                    USUARIOS U
                JOIN 
                    CITAS C ON U.CC = C.idUsuarioCC
                JOIN 
                    SERVICIOS S ON C.idServicio = S.idServicio
                JOIN 
                    FACTURA_ELECTRONICA FE ON C.idCita = FE.idCita
                JOIN 
                    COLILLA_PAGO CP ON FE.idColilla_Pago = CP.idColilla_Pago
                WHERE 
                    CP.estaodoCP = 1 AND 
                    CP.idColilla_Pago = ?
                ORDER BY 
                    CP.fechaGeneracion DESC;`,
                [idColilla]
            );
            return rows as MercadopagoFront[];
        } catch (error) {
            console.error('Error en getColillaPorId:', error);
            throw new Error('Error retrieving payment slips by ID');
        }
    }


    // Método para actualizar el estado de una colilla de pago
    public async updateColillaPagoEstado(idColilla: number): Promise<ColillaPagoEstado> {
        try {
            const [result] = await connection.query<RowDataPacket[]>(
                `CALL UpdateColillaPagoEstado(?)`,
                [idColilla]
            );

            // Asumiendo que result contiene un array con los resultados del procedimiento
            if (result.length > 0) {
                return result[0] as ColillaPagoEstado; // Retorna el primer resultado
            } else {
                throw new Error('No se encontraron resultados para el ID de colilla proporcionado.');
            }
        } catch (error) {
            console.error('Error en updateColillaPagoEstado:', error);
            throw new Error('Error updating payment slip status');
        }
    }
}

export default new MercadoPagoServices();