// Interface para AUD_COLILLA_PAGO
export interface AudColillaPago {
    idAudColilla_Pago: number;
    accion: string;
    tabla: string;
    idColilla_Pago: number;
    estadoCP: number;
    fechaGeneracion: Date;
    tipoUsuario: 'Paciente' | 'Operador' | 'Doctor' | 'Administrador';
    item: 'CM' | 'OM' | 'AM' | 'CP' | 'EM' | 'PG';
    descripcion: string;
    cantidad: number;
    valor: number;
    valorNeto: number;
    valorTotal: number;
    descripcionD: string;
    cantidadD: number;
    valorD: number;
    valorNetoD: number;
    valorTotalD: number;
    formaPago: string;
    totalPago: number;
    usuario: string;
    fechaHora: Date;
  }
  
  // Interface para AUD_FACTURA_ELECTRONICA
  export interface AudFacturaElectronica {
    idAudFactura_Electronica: number;
    accion: string;
    tabla: string;
    idFactura_Electronica: number;
    idCita: number;
    estadoFE: number;
    idColilla_Pago: number;
    idAutorizacion_Medica: number;
    idOrden_Medica: number;
    fechaGeneracion: Date;
    direccion: string;
    telefono: string;
    formaPago: 'Banco' | 'Pago Online';
    direccionUsuario: string;
    telefonoUsuario: string;
    item: 'CM' | 'OM' | 'AM' | 'CP' | 'EM';
    descripcion: string;
    cantidad: number;
    valor: number;
    iva: number;
    valorTotal: number;
    valorLetras: string;
    usuario: string;
    fechaHora: Date;
  }
  
  // Interface para AUD_HISTORIA_MEDICA
  export interface AudHistoriaMedica {
    idAudHistoria_Medica: number;
    accion: string;
    tabla: string;
    idHistoria_Medica: number;
    tipoSangre: string;
    genero: string;
    fecha_Nac: Date;
    discapacidad: string;
    fecha_Rev: Date;
    hora_Rev: string;
    motivo: string;
    descripcion_Motivo: string;
    presion_Sangre: string;
    presion_Sangre_Prom: string;
    pulso: string;
    saturacion: string;
    altura: number;
    peso: number;
    perinatales: string;
    patologicos: string;
    quirurgicos: string;
    vacunas: string;
    familiares: string;
    conclusion: string;
    usuario: string;
    fechaHora: Date;
  }
  
  // Interface para AUD_HOJAS_VIDA
  export interface AudHojasVida {
    idAudHoja_Vida: number;
    accion: string;
    tabla: string;
    idHoja_Vida: number;
    direccion: string;
    estadoUsuario: number;
    telefonoUsuario: string;
    idEps: number;
    tipo_documento: 'CC' | 'TI' | 'RC' | 'CE';
    sexo: 'M' | 'F';
    nacionalidad: string;
    pais: string;
    fecha_nacimiento: Date;
    lugar_nacimiento: string;
    alergias: string;
    discapacidad: string;
    contacto_emergencia_nombre: string;
    contacto_emergencia_parentesco: string;
    contacto_emergencia_telefono: string;
    contacto_emergencia_correo: string;
    cargo: string;
    fechaIngreso: Date;
    tipoContrato: 'Indefinido' | 'Fijo' | 'Prestación de servicios';
    salarioBasico: number;
    bonificaciones: number;
    deducciones: number;
    salarioNeto: number;
    fechaPago: Date;
    metodoPago: string;
    vacacionesPendientes: number;
    diasIncapacidad: number;
    historialPagos: string;
    autorizacionesEspeciales: string;
    fechaTerminacion: Date;
    motivoTerminacion: string;
    observaciones: string;
    usuario: string;
    fechaHora: Date;
  }
  
  // Interface para AUD_USUARIOS
  export interface AudUsuarios {
    idAudUsuario: number;
    accion: string;
    tabla: string;
    CC: string;
    nombreUsuario: string;
    apellidoUsuario: string;
    emailUsuario: string;
    pwdUsuario: string;
    idSede: number;
    idRol: number;
    estadoUsuario: number;
    idEspecialidad: number;
    idHoja_Vida: number;
    idTipoPaciente: number;
    usuario: string;
    fechaHora: Date;
  }
  
  // Interface para AUD_SEDES
  export interface AudSedes {
    idAudSede: number;
    accion: string;
    tabla: string;
    idSede: number;
    nombreSede: string;
    especialidadSede: string;
    usuarioSede: string;
    pwdSede: string;
    ipSede: string;
    usuario: string;
    fechaHora: Date;
  }
  
  // Interface para AUTORIZACIONES_MEDICAS
  export interface AutorizacionesMedicas {
    idAutorizacion_Medica: number;
    estadoAM: number;
    autorizado: number;
    idOrden_Medica: number;
  }
  