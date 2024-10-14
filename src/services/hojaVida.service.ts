import fs from 'fs';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import path from 'path';
import { HojaVida } from '../interface/HojaVida';
import { generatePDF } from '../libs/HojaVida/pdfGenerator';
import { BadRequestError, InternalServerError } from '../middlewares/customErrors';
import connection from '../providers/database';

export class HojaVidaService {
    // Obtener todas las hojas de vida
    public async getAllEmployer(): Promise<HojaVida[]> {
      try {
        const [rows] = await connection.query<RowDataPacket[]>(
          'SELECT * FROM HOJAS_VIDA'
        );
        return rows as HojaVida[];
      } catch (error) {
        console.error('Error en getAll:', error, 'Query:', 'SELECT * FROM HOJAS_VIDA');
        throw new Error('Error retrieving Hoja de Vida Pacientes');
      }
    }
  
    // Obtener una hoja de vida por ID
    public async getByIdEmployer(id: number): Promise<HojaVida | null> {
      try {
        const [rows] = await connection.query<RowDataPacket[]>(
          'SELECT * FROM HOJAS_VIDA WHERE idHoja_Vida = ?',
          [id]
        );
        return rows.length ? (rows[0] as HojaVida) : null;
      } catch (error) {
        console.error('Error en getById:', error);
        throw new Error('Error retrieving Hoja de Vida Paciente by ID');
      }
    }
  
    // Crear una nueva hoja de vida
    public async createEmployer(data: HojaVida): Promise<ResultSetHeader> {
      try {
        const [result] = await connection.query<ResultSetHeader>(
          `INSERT INTO HOJAS_VIDA 
          (direccion, estadoUsuario, telefonoUsuario, idEps, tipo_documento, sexo, nacionalidad, pais, 
          fecha_nacimiento, lugar_nacimiento, alergias, discapacidad, contacto_emergencia_nombre, 
          contacto_emergencia_parentesco, contacto_emergencia_telefono, contacto_emergencia_correo, 
          cargo, fechaIngreso, tipoContrato, salarioBasico, bonificaciones, deducciones, fechaPago, 
          metodoPago, vacacionesPendientes, diasIncapacidad, historialPagos, autorizacionesEspeciales, 
          fechaTerminacion, motivoTerminacion, observaciones) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.direccion, data.estadoUsuario, data.telefonoUsuario, data.idEps, data.tipo_documento,
            data.sexo, data.nacionalidad, data.pais, data.fecha_nacimiento, data.lugar_nacimiento,
            data.alergias, data.discapacidad, data.contacto_emergencia_nombre, data.contacto_emergencia_parentesco,
            data.contacto_emergencia_telefono, data.contacto_emergencia_correo, data.cargo, data.fechaIngreso,
            data.tipoContrato, data.salarioBasico, data.bonificaciones, data.deducciones, data.fechaPago,
            data.metodoPago, data.vacacionesPendientes, data.diasIncapacidad, data.historialPagos,
            data.autorizacionesEspeciales, data.fechaTerminacion, data.motivoTerminacion, data.observaciones
          ]
        );
        return result;
      } catch (error) {
        console.error('Error en create:', error);
        throw new Error('Error creating Hoja de Vida Paciente');
      }
    }
  
    // Actualizar una hoja de vida
    public async updateEmployer(id: number, data: HojaVida): Promise<ResultSetHeader> {
      try {
        const [result] = await connection.query<ResultSetHeader>(
          `UPDATE HOJAS_VIDA SET direccion = ?, estadoUsuario = ?, telefonoUsuario = ?, idEps = ?, 
          tipo_documento = ?, sexo = ?, nacionalidad = ?, pais = ?, fecha_nacimiento = ?, lugar_nacimiento = ?, 
          alergias = ?, discapacidad = ?, contacto_emergencia_nombre = ?, contacto_emergencia_parentesco = ?, 
          contacto_emergencia_telefono = ?, contacto_emergencia_correo = ?, cargo = ?, fechaIngreso = ?, 
          tipoContrato = ?, salarioBasico = ?, bonificaciones = ?, deducciones = ?, fechaPago = ?, metodoPago = ?, 
          vacacionesPendientes = ?, diasIncapacidad = ?, historialPagos = ?, autorizacionesEspeciales = ?, 
          fechaTerminacion = ?, motivoTerminacion = ?, observaciones = ? WHERE idHoja_Vida = ?`,
          [
            data.direccion, data.estadoUsuario, data.telefonoUsuario, data.idEps, data.tipo_documento,
            data.sexo, data.nacionalidad, data.pais, data.fecha_nacimiento, data.lugar_nacimiento, 
            data.alergias, data.discapacidad, data.contacto_emergencia_nombre, data.contacto_emergencia_parentesco,
            data.contacto_emergencia_telefono, data.contacto_emergencia_correo, data.cargo, data.fechaIngreso,
            data.tipoContrato, data.salarioBasico, data.bonificaciones, data.deducciones, data.fechaPago,
            data.metodoPago, data.vacacionesPendientes, data.diasIncapacidad, data.historialPagos,
            data.autorizacionesEspeciales, data.fechaTerminacion, data.motivoTerminacion, data.observaciones,
            id
          ]
        );
        return result;
      } catch (error) {
        console.error('Error en update:', error);
        throw new Error('Error updating Hoja de Vida Paciente');
      }
    }
  
    // Eliminar una hoja de vida por ID
    public async deleteEmployer(id: number): Promise<ResultSetHeader> {
      try {
        const [result] = await connection.query<ResultSetHeader>(
          'DELETE FROM HOJAS_VIDA WHERE idHoja_Vida = ?',
          [id]
        );
        return result;
      } catch (error) {
        console.error('Error en delete:', error);
        throw new Error('Error deleting Hoja de Vida Paciente');
      }
    }

    /**
     * Hacer vistaaaaaaaaaaaaa
     * @returns 
     */
    public async getAllPatient(): Promise<HojaVida[]> {
      try {
        const [rows] = await connection.query<RowDataPacket[]>(
          'SELECT * FROM HOJAS_VIDA'
        );
        return rows as HojaVida[];
      } catch (error) {
        console.error('Error en getAll:', error, 'Query:', 'SELECT * FROM HOJAS_VIDA');
        throw new Error('Error retrieving Hoja de Vida Pacientes');
      }
    }
  
    // Obtener una hoja de vida por ID
    public async getByIdPatient (id: number): Promise<HojaVida | null> {
      try {
        const [rows] = await connection.query<RowDataPacket[]>(
          'SELECT * FROM HOJAS_VIDA WHERE idHoja_Vida = ?',
          [id]
        );
        return rows.length ? (rows[0] as HojaVida) : null;
      } catch (error) {
        console.error('Error en getById:', error);
        throw new Error('Error retrieving Hoja de Vida Paciente by ID');
      }
    }
  
    // Crear una nueva hoja de vida
    public async createPatient(data: HojaVida): Promise<ResultSetHeader> {
      try {
        const [result] = await connection.query<ResultSetHeader>(
          `INSERT INTO HOJAS_VIDA 
          (direccion, estadoUsuario, telefonoUsuario, idEps, tipo_documento, sexo, nacionalidad, pais, 
          fecha_nacimiento, lugar_nacimiento, alergias, discapacidad, contacto_emergencia_nombre, 
          contacto_emergencia_parentesco, contacto_emergencia_telefono, contacto_emergencia_correo) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.direccion, data.estadoUsuario, data.telefonoUsuario, data.idEps, data.tipo_documento,
            data.sexo, data.nacionalidad, data.pais, data.fecha_nacimiento, data.lugar_nacimiento,
            data.alergias, data.discapacidad, data.contacto_emergencia_nombre, data.contacto_emergencia_parentesco,
            data.contacto_emergencia_telefono, data.contacto_emergencia_correo
          ]
        );
        return result;
      } catch (error) {
        console.error('Error en create:', error);
        throw new Error('Error creating Hoja de Vida Paciente');
      }
    }
  
    // Actualizar una hoja de vida
    public async updatePatient (id: number, data: HojaVida): Promise<ResultSetHeader> {
      try {
        const [result] = await connection.query<ResultSetHeader>(
          `UPDATE HOJAS_VIDA SET direccion = ?, estadoUsuario = ?, telefonoUsuario = ?, idEps = ?, 
          tipo_documento = ?, sexo = ?, nacionalidad = ?, pais = ?, fecha_nacimiento = ?, lugar_nacimiento = ?, 
          alergias = ?, discapacidad = ?, contacto_emergencia_nombre = ?, contacto_emergencia_parentesco = ?, 
          contacto_emergencia_telefono = ?, contacto_emergencia_correo = ? WHERE idHoja_Vida = ?`,
          [
            data.direccion, data.estadoUsuario, data.telefonoUsuario, data.idEps, data.tipo_documento,
            data.sexo, data.nacionalidad, data.pais, data.fecha_nacimiento, data.lugar_nacimiento, 
            data.alergias, data.discapacidad, data.contacto_emergencia_nombre, data.contacto_emergencia_parentesco,
            data.contacto_emergencia_telefono, data.contacto_emergencia_correo,
            id
          ]
        );
        return result;
      } catch (error) {
        console.error('Error en update:', error);
        throw new Error('Error updating Hoja de Vida Paciente');
      }
    }
  
    // Eliminar una hoja de vida por ID
    public async deletePatient (id: number): Promise<ResultSetHeader> {
      try {
        const [result] = await connection.query<ResultSetHeader>(
          'DELETE FROM HOJAS_VIDA WHERE idHoja_Vida = ?',
          [id]
        );
        return result;
      } catch (error) {
        console.error('Error en delete:', error);
        throw new Error('Error deleting Hoja de Vida Paciente');
      }
    }

    /**
     * Genera el PDF de la Hoja de Vida de un empleado por ID.
     * @param id ID de la Hoja de Vida.
     * @returns Buffer del PDF generado.
     */
    async generarHojaVidaPDF(id: number): Promise<Buffer> {
      try {
          const hojaVida = await this.getByIdEmployer(id);

          if (!hojaVida) {
              throw new BadRequestError('Hoja de Vida no encontrada.');
          }

          // Ruta a la plantilla HTML
          const templatePath = path.join(__dirname, '../templates/hojaVidaEmpleado.html');
          const template = fs.readFileSync(templatePath, 'utf-8');

          // Datos adicionales
          const baseUrl = `${process.env.BASE_URL || 'http://localhost:3002'}`;
          hojaVida.logo_url = `${baseUrl}/public/images/logo.jpeg`;

          // Generar el PDF
          const pdfBuffer = await generatePDF(template, hojaVida);

          return pdfBuffer;
      } catch (error) {
          console.error('Error generando el PDF de Hoja de Vida:', error);
          throw new InternalServerError('Error interno generando el PDF de Hoja de Vida');
      }
  }
}
  export default new HojaVidaService();
  