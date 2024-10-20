import PDFDocument from "pdfkit-table";
import path from 'path';

interface PacienteData {
  paciente: string;
  cc: string;
  cargo: string;
  salario: string;
}

// Función para convertir números a palabras
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

// Función para generar el PDF de la colilla de pago
export function buildPDF(
  dataCallback: (chunk: any) => void,
  endCallback: () => void,
  pacienteData: PacienteData,
  services: string[],
  quantities: number[]
) {
  const doc = new PDFDocument({ size: [595, 421] }); // Tamaño personalizado: mitad de A4
  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  const imagePath = path.join(__dirname, '../../img/Logovm.jpeg');
  doc.image(imagePath, 30, -70, {
      fit: [180, 300],
      align: 'center',
      valign: 'center'
  });

  // Título y detalles de la colilla
  doc
    .fontSize(20)
    .text('VITAMED IPS', 240, 30);

  doc
    .fontSize(8)
    .text('Periodo de pago: 20/10/2024', 200, 70);

  doc
    .fontSize(8)
    .text('Fecha de generación: 20/10/2024 ', 200, 100);

  doc
    .fontSize(8)
    .text('Fecha de emisión: 20/10/2024 ', 200, 115);

  doc
    .fontSize(8)
    .text(`Nombre: Juan pérez`, 400, 70);

  doc
    .fontSize(8)
    .text(`Número de cc: 1117246578`, 400, 85);

  doc
    .fontSize(8)
    .text(`Cargo: Doctor`, 400, 100);

  doc
    .fontSize(8)
    .text(`Salario básico: 2,300,500`, 400, 115);

  // Rectángulos para los ingresos y deducciones
  doc.rect(30, 140, 260, 20).stroke();
  doc.fontSize(8).text('Ingresos: ', 140, 147);

  doc.rect(300, 140, 260, 20).stroke();
  doc.fontSize(8).text('Deducciones: ', 400, 147);

  // Tabla de ingresos
  const ingresosTable = {
    headers: [
      { label: "Concepto", property: 'concepto', width: 60 },
      { label: "Cantidad", property: 'cantidad', width: 100 },
      { label: "Valor", property: 'valor', width: 100 }
    ],
    datas: services.map((service, index) => ({
      concepto: service,
      cantidad: quantities[index].toString(), // Convertir cantidad a string
      valor: `$${quantities[index] * parseFloat(service.split(',')[1])}`
    }))
  };

  doc.table(ingresosTable, {
    x: 30,
    y: 180,
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
    prepareRow: () => doc.font("Helvetica").fontSize(8),
  });

  doc.moveDown(1);

  // Tabla de deducciones
  const deduccionesTable = {
    headers: [
      { label: "Concepto", property: 'concepto', width: 60 },
      { label: "Cantidad", property: 'cantidad', width: 100 },
      { label: "Valor", property: 'valor', width: 100 }
    ],
    datas: services.map((service, index) => ({
      concepto: service,
      cantidad: quantities[index].toString(), // Convertir cantidad a string
      valor: `$${quantities[index] * parseFloat(service.split(',')[1])}`
    }))
  };

  doc.table(deduccionesTable, {
    x: 300,
    y: 180,
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
    prepareRow: () => doc.font("Helvetica").fontSize(8),
  });

  doc.moveDown(1);

  // Cálculo del total
  const totalAmount = services.reduce((sum, service, index) => {
    const price = parseFloat(service.split(',')[1]);
    const quantity = quantities[index] || 1;
    return sum + price * quantity;
  }, 0);

  // Convertir el total a palabras
  const totalInWords = numberToWords(Math.floor(totalAmount));

  // Detalles finales
  doc.fontSize(8).text(`Total ingresos: $ 200000`, 30, 300);
  doc.fontSize(8).text('Total deducciones: $0', 350, 300);

  doc.rect(30, 330, 200, 40).stroke();
  doc.fontSize(8).text('Medio de pago: BANCOLOMBIA', 32, 332);

  doc.rect(320, 330, 200, 40).stroke();
  doc.fontSize(8).text('Neto a pagar: ', 322, 332);
  doc.fontSize(8).text(`Total en palabras: ${totalInWords}`, 322, 350);

  // Finaliza el documento
  doc.end();
}
