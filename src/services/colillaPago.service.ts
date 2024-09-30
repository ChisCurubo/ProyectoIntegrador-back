
import connection from '../providers/database';  
import { ColillaPago } from '../Interfaces/ColillaPago';  
import { buildPDF } from '../libs/Facturacion/colilla';
import { InternalServerError, BadRequestError } from '../middlewares/customErrors';
export class ColillaPagoService {

  // Método para crear una nueva colilla de pago
  public async crearColillaPago(data: ColillaPago): Promise<number> {
    const query = `
      INSERT INTO COLILLA_PAGO (
        estaodoCP, tipoUsuario, item, descripccion, cantidad, valor, 
        descripccionD, cantidadD, valorD, formaPago, totalPago
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      data.estaodoCP, data.tipoUsuario, data.item, data.descripccion,
      data.cantidad, data.valor, data.descripccionD, data.cantidadD,
      data.valorD, data.formaPago, data.totalPago
    ];

    // Ejecutamos la consulta
    const [result]: any = await connection.query(query, values);
    return result.insertId;  // Retornamos el ID generado de la colilla insertada
  }

  // Método para obtener una colilla de pago por su ID
  public async obtenerColillaPorId(id: number): Promise<ColillaPago | null> {
    const query = `SELECT * FROM COLILLA_PAGO WHERE idColilla_Pago = ?;`;

    const [rows]: any = await connection.query(query, [id]);
    if (rows.length > 0) {
      return rows[0] as ColillaPago;  // Si existe, retornamos la colilla encontrada
    }
    return null;  // Si no, retornamos null
  }

  // Método para obtener todas las colillas de pago
  public async obtenerTodasLasColillas(): Promise<ColillaPago[]> {
    const query = `SELECT * FROM COLILLA_PAGO;`;

    const [rows]: any = await connection.query(query);
    return rows as ColillaPago[];  // Retornamos todas las colillas
  }

  // Método para eliminar una colilla de pago por su ID
  public async eliminarColilla(id: number): Promise<void> {
    const query = `DELETE FROM COLILLA_PAGO WHERE idColilla_Pago = ?;`;

    await connection.query(query, [id]);  // Ejecutamos la eliminación
  }

  // Método para actualizar una colilla de pago
  public async actualizarColillaPago(id: number, data: Partial<ColillaPago>): Promise<void> {
    const query = `
      UPDATE COLILLA_PAGO SET
        estaodoCP = ?, tipoUsuario = ?, item = ?, descripccion = ?, cantidad = ?,
        valor = ?, descripccionD = ?, cantidadD = ?, valorD = ?, formaPago = ?, totalPago = ?
      WHERE idColilla_Pago = ?;
    `;

    const values = [
      data.estaodoCP, data.tipoUsuario, data.item, data.descripccion, data.cantidad,
      data.valor, data.descripccionD, data.cantidadD, data.valorD, data.formaPago, 
      data.totalPago, id
    ];

    // Ejecutamos la consulta de actualización
    await connection.query(query, values);
  }


  public async generateElectronicPayStub(
    empleadoData: any,
    services: string[],
    quantities: number[]
): Promise<Buffer> {
    try {
        if (!empleadoData || services.length === 0 || quantities.length === 0) {
            throw new BadRequestError('Datos insuficientes para generar la colilla');
        }

        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];

            buildPDF(
                (chunk) => chunks.push(chunk),
                () => resolve(Buffer.concat(chunks)),
                empleadoData, services, quantities
            );
        });
    } catch (error) {
        console.error('Error generando la colilla:', error);
        throw new InternalServerError('Error interno generando la colilla de pago');
    }
}
}


// Exportamos el servicio para que pueda ser utilizado en otras partes de la aplicación
export default new ColillaPagoService();
