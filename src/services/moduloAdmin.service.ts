import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {CitasPorEspecialidad, CRMInformacion, ResumenFinanciero, serviceType, specialityType} from "../interface/admin";
import {CitaCompletaInformacion, Citainformacion} from "../interface/Citas";
import { ColillaPagoInformacion } from "../interface/colillaPago";
import { DoctorInformacion } from "../interface/doctor";
import { EmergenciaDetalle} from "../interface/Emergencias";
import { FacturaInformacion } from "../interface/factura";
import { HojaVidaAdmin, HojaVidafront } from "../interface/hojaVida";
import { ordenMedica } from "../interface/ordenMedica";
import { OrdenMedicaInformacion } from "../interface/ordenMedica";
import { DatabaseError, NotFoundError } from "../middlewares/customErrors";
import connection from "../providers/database";

class moduloAdmin {

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
            console.error("Error al buscar órdenes médicas por cédula:", error);
            throw new DatabaseError("Error al buscar órdenes médicas por cédula");
        }
    }

    // Método para obtener la hoja de vida por cédula
    public async obtenerHojaVidaPorCedula(CC: string): Promise<HojaVidafront | null> {
        const query = `
            SELECT
                CONCAT(u.nombreUsuario, ' ', u.apellidoUsuario) AS Nombre,
                u.CC,
                hv.fechaIngreso AS 'Fecha Creación',
                r.nombreRol AS 'Tipo Usuario',
                CASE
                    WHEN hv.estadoUsuario = 1 THEN 'Activo'
                    WHEN hv.estadoUsuario = 0 THEN 'Inactivo'
                    ELSE 'Desconocido'
                END AS Estado,
                hv.idHoja_Vida
            FROM
                USUARIOS AS u
            INNER JOIN
                HOJAS_VIDA AS hv ON u.idHoja_Vida = hv.idHoja_Vida
            INNER JOIN
                ROLES AS r ON u.idRol = r.idRol
            WHERE
                u.CC = ?;
        `;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(query, [CC]);

            if (rows.length === 0) {
                return null; // No se encontró la hoja de vida
            }

            return rows[0] as HojaVidafront; // Devuelve la hoja de vida encontrada
        } catch (error) {
            console.error("Error al obtener la hoja de vida por cédula:", error);
            throw new DatabaseError("Error al obtener la hoja de vida por cédula");
        }
    }

    public async obtenerColillasPorCedula(CC: string): Promise<ColillaPagoInformacion[]> {
        const query = `
            SELECT
                CONCAT(u.nombreUsuario, ' ', u.apellidoUsuario) AS Nombre,
                u.CC,
                cp.fechaGeneracion AS 'Fecha Colilla',
                cp.idColilla_Pago AS 'ID Colilla',
                CASE
                    WHEN cp.estaodoCP = 1 THEN 'Activo'
                    WHEN cp.estaodoCP = 0 THEN 'Inactivo'
                    ELSE 'Desconocido'
                END AS Estado
            FROM
                COLILLA_PAGO AS cp
            INNER JOIN
                FACTURA_ELECTRONICA AS fe ON cp.idColilla_Pago = fe.idColilla_Pago
            INNER JOIN
                CITAS AS c ON fe.idCita = c.idCita
            INNER JOIN
                USUARIOS AS u ON c.idUsuarioCC = u.CC
            WHERE
                u.CC = ?;
        `;

        try {
            const [filas] = await connection.query<RowDataPacket[]>(query, [CC]);
            return filas as ColillaPagoInformacion[]; // Devuelve las filas obtenidas con el tipo específico
        } catch (error) {
            console.error("Error al obtener colillas por cédula:", error);
            throw new DatabaseError("Error al obtener colillas por cédula");
        }

    }
    public  async obtenerFacturasPorCedula(cedula: string): Promise<FacturaInformacion[]> {
        const query = `
            SELECT
                CONCAT(u.nombreUsuario, ' ', u.apellidoUsuario) AS Nombre,
                u.CC,
                cp.fechaGeneracion AS 'Fecha de Pago',
                fe.idFactura_Electronica AS 'ID Factura',
                fe.idCita AS 'ID Cita'
            FROM
                COLILLA_PAGO AS cp
            INNER JOIN
                FACTURA_ELECTRONICA AS fe ON cp.idColilla_Pago = fe.idColilla_Pago
            INNER JOIN
                CITAS AS c ON fe.idCita = c.idCita
            INNER JOIN
                USUARIOS AS u ON c.idUsuarioCC = u.CC
            WHERE
                u.CC = ?; -- Filtrar por cédula
        `;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(query, [cedula]);
            return rows as FacturaInformacion[]; // Devuelve las filas obtenidas con el tipo específico
        } catch (error) {
            console.error("Error al obtener facturas por cédula:", error);
            throw new DatabaseError("Error al obtener facturas por cédula");
        }
    }

    public async obtenerTodasLasEmergencias(): Promise<EmergenciaDetalle[]> {
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
                USUARIOS D ON C.idDocCC = D.CC;
        `;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(query);
            return rows as EmergenciaDetalle[]; // Devuelve las filas obtenidas con el tipo específico
        } catch (error) {
            console.error("Error al obtener todas las emergencias:", error);
            throw new DatabaseError("Error al obtener todas las emergencias");
        }
    }

    public async obtenerDoctorPorCedula(cedula: string): Promise<DoctorInformacion[]> {
        const query = `
            SELECT
                CONCAT(u.nombreUsuario, ' ', u.apellidoUsuario) AS NombreCompleto,
                u.emailUsuario AS CorreoElectronico,
                u.CC AS Documento,
                u.CC AS idDoctor, -- Asumiendo que el CC es el identificador del doctor
                e.nombreEspecialidad AS Especialidad
            FROM
                USUARIOS AS u
            INNER JOIN
                ESPECIALIDADES AS e ON u.idEspecialidad = e.idEspecialidad
            WHERE
                u.idRol = 3 AND u.CC = ?; -- Filtrar por cédula del doctor
        `;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(query, [cedula]);
            return rows as DoctorInformacion[];
        } catch (error) {
            console.error("Error al obtener doctor por cédula:", error);
            throw new DatabaseError("Error al obtener doctor por cédula");
        }
    }

    public async obtenerCitasPorCedula(cedula: string): Promise<Citainformacion[]> {
        const query = `
            SELECT
                C.idCita AS 'idCita', -- ID de la cita
                C.hora AS 'Hora', -- Hora de la cita
                C.dia AS 'Día', -- Día de la cita
                paciente.nombreUsuario AS NombrePaciente, -- Nombre del paciente
                paciente.emailUsuario AS EmailPaciente, -- Correo electrónico del paciente
                doctor.nombreUsuario AS NombreDoctor, -- Nombre del doctor (puede ser null)
                doctor.emailUsuario AS EmailDoctor -- Correo electrónico del doctor (puede ser null)
            FROM
                CITAS AS C
            INNER JOIN
                USUARIOS AS paciente ON C.idUsuarioCC = paciente.CC -- Unir con la tabla de pacientes
            LEFT JOIN
                USUARIOS AS doctor ON C.idDocCC = doctor.CC -- Unir con la tabla de doctores
            WHERE
                paciente.CC = ?; -- Filtrar por cédula del paciente
        `;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(query, [cedula]);
            return rows as Citainformacion[]; // Devuelve las filas obtenidas con el tipo específico
        } catch (error) {
            console.error("Error al obtener citas por cédula:", error);
            throw new DatabaseError("Error al obtener citas por cédula");
        }
    }

    public async obtenerCitasCompletasPorCedula(cedula: string): Promise<CitaCompletaInformacion[]> {
        const query = `
            SELECT
                C.idCita AS IdCita, -- ID de la cita
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
                paciente.CC = ?; -- Filtrar por cédula
        `;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(query, [cedula]);
            return rows as CitaCompletaInformacion[]; // Devuelve las filas obtenidas con el tipo específico
        } catch (error) {
            console.error("Error al obtener citas completas por cédula:", error);
            throw new DatabaseError("Error al obtener citas completas por cédula");
        }
    }

    public async crearHojaVida(hojaVida: HojaVidaAdmin): Promise<number> {
        const query = `
            INSERT INTO HOJAS_VIDA (
                direccion, estadoUsuario, telefonoUsuario, idEps,
                tipo_documento, sexo, nacionalidad, pais,
                fecha_nacimiento, lugar_nacimiento, alergias,
                discapacidad, contacto_emergencia_nombre,
                contacto_emergencia_parentesco, contacto_emergencia_telefono,
                contacto_emergencia_correo, cargo, fechaIngreso,
                tipoContrato, salarioBasico, bonificaciones,
                deducciones, fechaPago, vacacionesPendientes,
                diasIncapacidad, historialPagos,
                autorizacionesEspeciales, fechaTerminacion,
                motivoTerminacion, observaciones
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        try {
            const [result] = await connection.query<ResultSetHeader>(query, [
                hojaVida.direccion,
                hojaVida.estadoUsuario,
                hojaVida.telefonoUsuario,
                hojaVida.idEps,
                hojaVida.tipo_documento,
                hojaVida.sexo,
                hojaVida.nacionalidad,
                hojaVida.pais,
                hojaVida.fecha_nacimiento,
                hojaVida.lugar_nacimiento,
                hojaVida.alergias,
                hojaVida.discapacidad,
                hojaVida.contacto_emergencia_nombre,
                hojaVida.contacto_emergencia_parentesco,
                hojaVida.contacto_emergencia_telefono,
                hojaVida.contacto_emergencia_correo,
                hojaVida.cargo,
                hojaVida.fechaIngreso,
                hojaVida.tipoContrato,
                hojaVida.salarioBasico,
                hojaVida.bonificaciones,
                hojaVida.deducciones,
                hojaVida.fechaPago,
                hojaVida.vacacionesPendientes,
                hojaVida.diasIncapacidad,
                hojaVida.historialPagos,
                hojaVida.autorizacionesEspeciales,
                hojaVida.fechaTerminacion,
                hojaVida.motivoTerminacion,
                hojaVida.observaciones,
            ]);

            return result.insertId;
        } catch (error) {
            console.error("Error al crear la hoja de vida:", error);
            throw new Error(`Error al crear la hoja de vida: ${error instanceof Error ? error.message : "Unknown error"}`);
        }

    }

    public async obtenerResumenFinanciero(): Promise<ResumenFinanciero> {
        try {
            console.log("Iniciando obtenerResumenFinanciero");
            const [results] = await connection.query<RowDataPacket[][]>(`
                CALL generar_resumen_financiero(MONTH(CURRENT_DATE()), YEAR(CURRENT_DATE()));
            `);

            console.log("Resultado completo de la consulta:", JSON.stringify(results, null, 2));

            if (!results || !Array.isArray(results) || results.length === 0) {
                console.error("No se encontraron resultados");
                throw new Error("No se encontraron resultados");
            }

            const firstResultSet = results[0];

            if (!Array.isArray(firstResultSet) || firstResultSet.length === 0) {
                console.error("El conjunto de resultados está vacío");
                throw new Error("El conjunto de resultados está vacío");
            }

            const resumen = firstResultSet[0];
            console.log("Resumen extraído:", JSON.stringify(resumen, null, 2));

            // Función auxiliar para parsear valores monetarios
            const parseMonetaryValue = (value: string): number => {
                return parseFloat(value.replace(/[$,]/g, "")) || 0;
            };

            // Función auxiliar para parsear porcentajes
            const parsePercentage = (value: string): number => {
                return parseFloat(value.replace("%", "")) || 0;
            };

            return {
                ingresosMensuales: parseMonetaryValue(resumen["Ingresos Mensuales"]),
                gastosOperativos: parseMonetaryValue(resumen["Gastos Operativos"]),
                margenOperativo: parsePercentage(resumen["Margen Operativo"]),
                presupuestoRestante: parseMonetaryValue(resumen["Presupuesto Restante"]),
            };
        } catch (error) {
            console.error("Error al obtener el resumen financiero:", error);
            throw new DatabaseError("Error al obtener el resumen financiero");
        }
    }

    public  async obtenerResumenCRM(): Promise<CRMInformacion> {
        try {
            const [result] = await connection.query<RowDataPacket[]>(`
                SELECT
                    CRM_TotalCitas() AS TotalCitas,
                    CRM_CitasRealizadas() AS CitasRealizadas,
                    CRM_DoctorMasSolicitado() AS DoctorMasSolicitado,
                    CRM_UsuariosEnSistema() AS UsuariosEnSistema;
            `);

            if (!result[0]) {
                throw new Error("No se obtuvieron resultados del resumen CRM");
            }

            const resumen = result[0];
            return {
                totalCitas: resumen.TotalCitas,
                citasRealizadas: resumen.CitasRealizadas,
                doctorMasSolicitado: resumen.DoctorMasSolicitado,
                usuariosEnSistema: resumen.UsuariosEnSistema,
            };
        } catch (error) {
            console.error("Error al obtener el resumen CRM:", error);
            throw new Error("Error al obtener el resumen CRM");
        }
    }

    // Obtener el número de citas por especialidad
    public  async obtenerCitasPorEspecialidad(): Promise<CitasPorEspecialidad> {
        try {
            const [result] = await connection.query<RowDataPacket[]>(`
                SELECT
                    CRM_CitasPorEspecialidad('Medicina General') AS MedicinaGeneral,
                    CRM_CitasPorEspecialidad('Emergencias') AS Emergencias,
                    CRM_CitasPorEspecialidad('Laboratorios') AS Laboratorios,
                    CRM_CitasPorEspecialidad('Imágenes Diagnósticas') AS ImagenesDiagnosticas;
            `);

            if (!result[0]) {
                throw new Error("No se obtuvieron resultados de citas por especialidad");
            }

            const especialidades = result[0];
            return {
                medicinaGeneral: especialidades.MedicinaGeneral,
                emergencias: especialidades.Emergencias,
                laboratorios: especialidades.Laboratorios,
                imagenesDiagnosticas: especialidades.ImagenesDiagnosticas,
            };
        } catch (error) {
            console.error("Error al obtener citas por especialidad:", error);
            throw new Error("Error al obtener citas por especialidad");
        }
    }

    public async getSpecialties(): Promise<specialityType[]> {
        try {
            const [result] = await connection.query<RowDataPacket[]>(`
            SELECT
                idEspecialidad,
                nombreEspecialidad,
                idSede
            FROM
                ESPECIALIDADES
            WHERE
                idSede = 1;
        `);
            if (result.length === 0) {
                throw new Error("No se obtuvieron resultados de especialidades para la sede 1");
            }
            return result.map(especialidad => ({
                idEspecialidad: especialidad.idEspecialidad,
                nombreEspecialidad: especialidad.nombreEspecialidad,
                idSede: especialidad.idSede,
            }));
        } catch (error) {
            console.error("Error al obtener las especialidades:", error);
            throw new DatabaseError("Error al obtener las especialidades");
        }
    }

    public async getServicesBySpecialties(): Promise<serviceType[]> {
        try {
            const [result] = await connection.query<RowDataPacket[]>(`
            SELECT
                *
            FROM
                SERVICIOS
            WHERE
                idEspecialidad IN (1, 2, 3, 4, 45);
        `);

            if (result.length === 0) {
                throw new Error("No se obtuvieron resultados de servicios para las especialidades especificadas");
            }

            return result.map(servicio => ({
                idServicio: servicio.idServicio,
                nombreServicio: servicio.nombreServicio,
                precioServicio: servicio.precioServicio,
                idEspecialidad: servicio.idEspecialidad,
            }));
        } catch (error) {
            console.error("Error al obtener los servicios:", error);
            throw new DatabaseError("Error al obtener los servicios");
        }
    }
}
export default new moduloAdmin();
