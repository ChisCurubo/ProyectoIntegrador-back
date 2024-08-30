import PDFDocument from "pdfkit-table";

function numberToWords(number: number): string {
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

export async function generarFacturaelectronica(pacienteData: any, services: string[], quantities: number[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers: any[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        doc.on('error', reject);

        doc.image('images/logovm.jpeg', 40, 50, {
            fit: [180, 300],
            align: 'center',
            valign: 'center'
        });

        doc.image('images/qr.png', 450, 50, {
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

        if (pacienteData) {
            doc.fontSize(8).text(`PACIENTE: ${pacienteData.paciente || ''}`, 40, 250);
            doc.fontSize(8).text(`CC: ${pacienteData.cc || ''}`, 40, 265);
            doc.fontSize(8).text(`TELEFONO: ${pacienteData.telefono || ''}`, 40, 280);
            doc.fontSize(8).text(`CIUDAD: ${pacienteData.ciudad || ''}`, 320, 250);
            doc.fontSize(8).text(`DIRECCION: ${pacienteData.direccion || ''}`, 320, 265);
        } else {
            doc.fontSize(8).text('Datos del paciente no proporcionados.', 40, 250);
        }

        const tableArray = {
            headers: ["ITEM", "CODIGO", "NOMBRE", "CANTIDAD", "VALOR UNITARIO", "%IMP"],
            rows: services.map((service, index) => {
              const [price, name] = service.split(',');
              const quantity = quantities[index] || 1;
              return [
                (index + 1).toString(),
                (index + 1).toString(),
                name,
                quantity.toString(),
                price.toString(),
                '0'
              ];
            }),
          };          
          
        doc.table(tableArray, {
            width: 500,
            x: 40,
            y: 305,
            columnSpacing: 10,
        });

        const totalAmount = services.reduce((sum, service, index) => {
            const [price] = service.split(',');
            const quantity = quantities[index] || 1;
            return sum + parseFloat(price) * quantity;
        }, 0);

        const totalInWords = numberToWords(Math.floor(totalAmount));
        const yPositionAfterTable = doc.y;
        doc.fontSize(8).text(`VALOR TOTAL: $${totalAmount.toFixed(2)}`, 40, yPositionAfterTable + 10);
        doc.fontSize(8).text(`SON: ${totalInWords} pesos`, { align: 'left' });

        doc.end();
    });
}
