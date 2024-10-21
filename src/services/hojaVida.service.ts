
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { HojaVida } from '../interface/hojaVida';
import { generatePDF } from '../libs/HojaVida/GeneratePDF'; // Asegúrate de que la ruta es correcta
import connection from '../providers/database';

export class HojaVidaService {
  public async getHojaVidaById(idHoja_Vida: number): Promise<any> {
    const [rows]: [RowDataPacket[], any] = await connection.query(`
        SELECT HV.*, 
               U.nombreUsuario, 
               U.apellidoUsuario, 
               U.cc,
               HV.direccion, 
               HV.telefonoUsuario, 
               HV.idEps, 
               HV.tipo_documento, 
               HV.sexo, 
               HV.fecha_nacimiento,
               HV.lugar_nacimiento, 
               HV.estadoUsuario, 
               HV.nacionalidad,
               HV.cargo,
               HV.salarioBasico,
               HV.salarioNeto,
               HV.tipoContrato
        FROM HOJAS_VIDA HV 
        INNER JOIN USUARIOS U ON HV.idHoja_Vida = U.idHoja_Vida 
        WHERE HV.idHoja_Vida = ?`, 
        [idHoja_Vida]
    );
    return rows.length ? rows[0] : null;
}


public async getHojaVidaByCC(cc: string): Promise<any> {
  const [rows]: [RowDataPacket[], any] = await connection.query(`
      SELECT HV.*, 
             U.nombreUsuario, 
             U.apellidoUsuario, 
             U.cc, 
             U.emailUsuario, 
             U.idSede, 
             U.idRol
      FROM HOJAS_VIDA HV 
      INNER JOIN USUARIOS U ON HV.idHoja_Vida = U.idHoja_Vida
      WHERE U.cc = ?`, 
      [cc]
  );
  return rows.length ? rows[0] : null;
}

    // Actualizar hoja de vida
    public async updateHojaVida(id: number, data: HojaVida): Promise<ResultSetHeader> {
        const [result] = await connection.query<ResultSetHeader>(`
            UPDATE HOJAS_VIDA SET
                direccion = ?, telefonoUsuario = ?, idEps = ?, tipo_documento = ?, sexo = ?,
                nacionalidad = ?, pais = ?, fecha_nacimiento = ?, lugar_nacimiento = ?,
                estadoUsuario = ? 
            WHERE idHoja_Vida = ?`,
            [
                data.direccion, data.telefonoUsuario, data.idEps, data.tipo_documento, data.sexo,
                data.nacionalidad, data.pais, data.fecha_nacimiento, data.lugar_nacimiento,
                data.estadoUsuario, id
            ]
        );
        return result;
    }

      // Generar el PDF de la hoja de vida
  public async generatePDF(hojaVida: HojaVida): Promise<Buffer> {
    const template = `
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hoja de Vida del Usuario</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .page {
                width: 210mm;
                margin: 0 auto;
                padding: 15mm;
                box-sizing: border-box;
                background-color: #fff;
                border: 1px solid #000;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header img {
                width: 100px;
            }
            .header h3 {
                margin: 10px 0;
                color: #019BE2;
            }
            .section-title {
                font-size: 12pt;
                text-transform: uppercase;
                background-color: #019BE2;
                color: white;
                padding: 5px;
                margin-top: 15px;
            }
            .data-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            .data-table th, .data-table td {
                border: 1px solid #000;
                padding: 8px;
                font-size: 10pt;
                text-align: left;
            }
            .data-table th {
                background-color: #f0f0f0;
                font-weight: bold;
                width: 25%;
            }
            .signature {
                margin-top: 20px;
                font-size: 10pt;
            }
            .signature div {
                display: inline-block;
                width: 200px;
                text-align: center;
            }
            .signature div span {
                display: block;
                border-top: 1px solid #000;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <div class="page" id="content">
            <!-- Encabezado -->
            <div class="header">
                <img src="/img/LogoVitamed-06.png" />
                <h3>FORMATO ÚNICO HOJA DE VIDA</h3>
                <p>ID EPS: ${hojaVida.idEps} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; REF: ${hojaVida.ref} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Fecha: ${hojaVida.fecha}</p>
            </div>

            <!-- Datos Personales -->
            <div class="section-title">Datos Personales</div>
            <table class="data-table">
                <tr>
                    <th>Apellidos</th><td colspan="3">${hojaVida.apellidoUsuario}</td>
                </tr>
                <tr>
                    <th>Nombres</th><td colspan="3">${hojaVida.nombreUsuario}</td>
                </tr>
                <tr>
                    <th>Número de Documento</th><td>${hojaVida.cc}</td>
                    <th>Tipo de Documento</th><td>${hojaVida.tipo_documento}</td>
                </tr>
                <tr>
                    <th>Sexo</th><td>${hojaVida.sexo}</td>
                    <th>Fecha de Nacimiento</th><td>${hojaVida.fecha_nacimiento}</td>
                </tr>
                <tr>
                    <th>Lugar de Nacimiento</th><td>${hojaVida.lugar_nacimiento}</td>
                    <th>Nacionalidad</th><td>${hojaVida.nacionalidad}</td>
                </tr>
                <tr>
                    <th>Estado del Usuario</th><td colspan="3">${hojaVida.estado_usuario}</td>
                </tr>
            </table>

            <!-- Información de Contacto -->
            <div class="section-title">Información de Contacto</div>
            <table class="data-table">
                <tr>
                    <th>Teléfono</th><td colspan="3">${hojaVida.telefonoUsuario}</td>
                </tr>
                <tr>
                    <th>Correo Electrónico</th><td colspan="3">${hojaVida.email}</td>
                </tr>
            </table>

            <!-- Dirección de Residencia -->
            <div class="section-title">Dirección de Residencia</div>
            <table class="data-table">
                <tr>
                    <th>Departamento</th><td>${hojaVida.direccion}</td>
                </tr>
            </table>

            <!-- Datos de Contacto de Emergencia -->
            <div class="section-title">Datos de Contacto de Emergencia</div>
            <table class="data-table">
                <tr>
                    <th>Nombres</th><td colspan="3">${hojaVida.contacto_emergencia_nombre}</td>
                </tr>
                <tr>
                    <th>Parentesco</th><td>${hojaVida.contacto_emergencia_parentesco}</td>
                    <th>Teléfono</th><td>${hojaVida.contacto_emergencia_telefono}</td>
                </tr>
                <tr>
                    <th>Correo Electrónico</th><td colspan="3">${hojaVida.contacto_emergencia_correo}</td>
                </tr>
            </table>

            <!-- Información Administrativa -->
            <div class="section-title">Información Administrativa</div>
            <table class="data-table">
                <tr>
                    <th>ID de Empleado</th><td>${hojaVida.id_empleado}</td>
                    <th>Nombre Completo</th><td>${hojaVida.nombre_completo}</td>
                </tr>
                <tr>
                    <th>Cargo</th><td>${hojaVida.cargo}</td>
                    <th>Fecha de Ingreso</th><td>${hojaVida.fecha_ingreso}</td>
                </tr>
                <tr>
                    <th>Tipo de Contrato</th><td>${hojaVida.tipo_contrato}</td>
                    <th>Salario Básico</th><td>${hojaVida.salarioBasico}</td>
                </tr>
                <tr>
                    <th>Bonificaciones</th><td>${hojaVida.bonificaciones}</td>
                    <th>Deducciones</th><td>${hojaVida.deducciones}</td>
                </tr>
                <tr>
                    <th>Salario Neto</th><td>${hojaVida.salario_neto}</td>
                    <th>Fecha de Pago</th><td>${hojaVida.fecha_pago}</td>
                </tr>
                <tr>
                    <th>Método de Pago</th><td>${hojaVida.metodo_pago}</td>
                    <th>Vacaciones Pendientes</th><td>${hojaVida.vacaciones_pendientes}</td>
                </tr>
                <tr>
                    <th>Días de Incapacidad</th><td>${hojaVida.dias_incapacidad}</td>
                    <th>Historial de Pagos</th><td>${hojaVida.historial_pagos}</td>
                </tr>
                <tr>
                    <th>Autorizaciones Especiales</th><td colspan="3">${hojaVida.autorizaciones_especiales}</td>
                </tr>
                <tr>
                    <th>Fecha de Terminación</th><td>${hojaVida.fecha_terminacion}</td>
                    <th>Motivo de Terminación</th><td>${hojaVida.motivo_terminacion}</td>
                </tr>
                <tr>
                    <th>Observaciones</th><td colspan="3">${hojaVida.observaciones}</td>
                </tr>
            </table>

            <!-- Firma -->
            <div class="signature" style="margin-top: 100px;">
                <div>
                    <span>Firma del Paciente</span>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    return await generatePDF(template, hojaVida);
  }
}
