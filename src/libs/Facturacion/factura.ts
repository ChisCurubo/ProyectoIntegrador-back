import PDFDocument from "pdfkit-table";
import { Service } from '../../services/facturacion.service'; // Asegúrate de importar la interfaz
import path from 'path';

export function numberToWords(number: number): string {
    const units = [
        'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
        'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete',
        'dieciocho', 'diecinueve', 'veinte'
    ];

    const tens = [
        'veinti', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'
    ];

    const hundreds = [
        'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos',
        'setecientos', 'ochocientos', 'novecientos'
    ];

    const thousand = 'mil';

    if (number === 0) return units[0];
    if (number < 21) return units[number];
    if (number < 100) return tens[Math.floor(number / 10) - 2] + (number % 10 === 0 ? '' : ' y ' + units[number % 10]);
    if (number < 1000) return hundreds[Math.floor(number / 100) - 1] + (number % 100 === 0 ? '' : ' ' + numberToWords(number % 100));
    if (number === 1000) return thousand;
    if (number < 2000) return thousand + ' ' + numberToWords(number % 1000);
    if (number < 1000000) {
        const thousandsPart = Math.floor(number / 1000);
        const remainderPart = number % 1000;
        return (thousandsPart === 1 ? thousand : numberToWords(thousandsPart) + ' mil') +
            (remainderPart === 0 ? '' : ' ' + numberToWords(remainderPart));
    }
    return 'Número fuera de rango';
}

export async function generarFacturaelectronica(
  pacienteData: any,
  services: Service[], 
  quantities: number[]
): Promise<Buffer> {
  console.log('Datos del paciente en generarFacturaelectronica:', pacienteData); // Log de pacienteData
  console.log('Servicios recibidos:', services); // Agregar este log
  console.log('Cantidades recibidas:', quantities); // Agregar este log
  
  return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
      });
      doc.on('error', reject);

      const imagePath = path.join(__dirname, '../../img/Logovm.jpeg');
      doc.image(imagePath, 30, -70, {
          fit: [180, 300],
          align: 'center',
          valign: 'center'
      });

      const qrPath = path.join(__dirname, '../../img/qr.png'); // Ruta absoluta para qr.png
      doc.image(qrPath, 450, 50, {
          fit: [90, 90],
          align: 'center',
          valign: 'center'
      });

      doc.fontSize(8).text('VITAMED IPS SALUD INTEGRAL S.A', 240, 60);
      doc.fontSize(8).text('Factura Electrónica de Venta', 240, 75);
      doc.fontSize(8).text('Factura No: ', 240, 90);
      doc.fontSize(8).text('Fecha Generación: ', 240, 105);
      doc.fontSize(8).text('Fecha Vencimiento: ', 240, 120);
      doc.fontSize(8).text('DIRECCION:  ', 40, 170);
      doc.fontSize(8).text('TELEFONO:  ', 40, 185);
      doc.fontSize(8).text('FORMA DE PAGO:  ', 40, 200);
      doc.fontSize(8).text('NIT:  ', 320, 170);
      doc.fontSize(8).text('DATOS DEL PACIENTE.  ', 40, 230);

      // Verificar si pacienteData tiene los campos esperados
      if (pacienteData) {
          doc.fontSize(8).text(`PACIENTE: ${pacienteData.paciente || ''}`, 40, 250);
          doc.fontSize(8).text(`CC: ${pacienteData.CC || ''}`, 40, 265);
          doc.fontSize(8).text(`TELEFONO: ${pacienteData.telefono || ''}`, 40, 280);
          doc.fontSize(8).text(`CIUDAD: ${pacienteData.ciudad || ''}`, 320, 250);
          doc.fontSize(8).text(`DIRECCION: ${pacienteData.direccion || ''}`, 320, 265);
      } else {
          console.error('Datos del paciente no proporcionados'); // Log de error
          doc.fontSize(8).text('Datos del paciente no proporcionados.', 40, 250);
      }


    // Ajustar la posición Y y X para la tabla
    const tableStartX = 40; // Cambia este valor para mover la tabla en el eje X
    const tableStartY = 300; // Cambia este valor para mover la tabla en el eje Y
    doc.y = tableStartY; // Ajuste de la posición Y

    const tableArray = {
        headers: ["ITEM", "CODIGO", "NOMBRE", "CANTIDAD", "VALOR UNITARIO", "%IMP"],
        rows: services.map((service, index) => {
            const quantity = quantities[index] || 1; 
            if (!service || typeof service.precioServicio !== 'number') {
                console.error(`Servicio inválido en el índice ${index}`);
                return [index + 1, '', 'Servicio no disponible', quantity.toString(), '0', '0'].map(String);
            }
            return [
                (index + 1).toString(),
                (index + 1).toString(),
                service.nombreServicio, 
                quantity.toString(),
                service.precioServicio.toFixed(2), 
                '0'
            ].map(String);
        }),
    };

    // Crear tabla en el PDF
    doc.table(tableArray, {
        width: 500, // Ajusta el ancho de la tabla según sea necesario
        x: tableStartX // Ajuste de la posición X
    });
    // Calcular el valor total
    const totalAmount = services.reduce((sum, service, index) => {
        const quantity = quantities[index] || 1;
        return sum + (service.precioServicio || 0) * quantity; 
    }, 0);

    // Mostrar total
    const yPositionAfterTable = doc.y;
    doc.fontSize(8).text(`VALOR TOTAL: $${totalAmount.toFixed(2)}`, 40, yPositionAfterTable + 10);
    
    // Convertir el total a palabras
    const totalInWords = numberToWords(Math.floor(totalAmount));
    doc.fontSize(8).text(`SON: ${totalInWords} pesos`, { align: 'left' });

    doc.end();
});
}