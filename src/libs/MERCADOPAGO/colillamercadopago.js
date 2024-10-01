export class ColillaPago {
    constructor(
        idColilla_Pago,
        estadoCP,
        fechaGeneracion,
        tipoUsuario,
        item,
        descripccion,
        cantidad,
        valor,
        valorNeto,
        valorTotal,
        descripccionD,
        cantidadD,
        valorD,
        valorNetoD,
        valorTotalD,
        formaPago,
        totalPago
    ) {
        this.idColilla_Pago = idColilla_Pago;         // ID de la colilla de pago
        this.estadoCP = estadoCP;                     // Estado de la colilla
        this.fechaGeneracion = fechaGeneracion;       // Fecha de generación
        this.tipoUsuario = tipoUsuario;               // Tipo de usuario (Paciente, Operador, Doctor, Administrador)
        this.item = item;                             // Tipo de ítem (CM, OM, AM, CP, EM, PG)
        this.descripccion = descripccion;             // Descripción del ítem
        this.cantidad = cantidad;                     // Cantidad de ítems
        this.valor = valor;                           // Valor del ítem
        this.valorNeto = valorNeto;                   // Valor neto
        this.valorTotal = valorTotal;                 // Valor total
        this.descripccionD = descripccionD;           // Descripción adicional
        this.cantidadD = cantidadD;                   // Cantidad adicional
        this.valorD = valorD;                         // Valor adicional
        this.valorNetoD = valorNetoD;                 // Valor neto adicional
        this.valorTotalD = valorTotalD;               // Valor total adicional
        this.formaPago = formaPago;                   // Forma de pago
        this.totalPago = totalPago;                   // Total a pagar
    }
}
