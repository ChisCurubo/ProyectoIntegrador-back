// Interface with all the attributes of the HojaVidaPaciente table
// Interface with all the attributes of the HojaVidaPaciente table
export interface HojaVida {
  cc: any;
  apellidoUsuario: any;
  nombreUsuario: any;
  num_documento: any;
  departamento: any;
  municipio: any;
  estado_usuario: any;
  email: any;
  direccion_departamento: any;
  direccion_ciudad: any;
  direccion_barrio: any;
  direccion_telefono: any;
  emergencia_apellido1: any;
  emergencia_apellido2: any;
  emergencia_nombres: any;
  emergencia_parentesco: any;
  emergencia_telefono: any;
  emergencia_email: any;
  id_empleado: any;
  nombre_completo: any;
  fecha_ingreso: any;
  tipo_contrato: any;
  salario_basico: any;
  salario_neto: any;
  fecha_pago: any;
  metodo_pago: any;
  vacaciones_pendientes: any;
  dias_incapacidad: any;
  historial_pagos: any;
  autorizaciones_especiales: any;
  fecha_terminacion: any;
  motivo_terminacion: any;
  fecha: any;
  ref: any;
  nombres: any;
  segundo_apellido: any;
  primer_apellido: any;

  idHoja_Vida?: number;
  direccion: string;
  estadoUsuario: number;
  telefonoUsuario: string;
  idEps: number;
  tipo_documento: 'CC' | 'TI' | 'RC' | 'CE';
  sexo: 'M' | 'F';
  nacionalidad?: string;
  pais?: string;
  fecha_nacimiento?: string;
  lugar_nacimiento?: string;
  alergias?: string;
  discapacidad?: string;
  contacto_emergencia_nombre?: string;
  contacto_emergencia_parentesco?: string;
  contacto_emergencia_telefono?: string;
  contacto_emergencia_correo?: string;
  cargo: string;
  fechaIngreso: string;
  tipoContrato: 'Indefinido' | 'Fijo' | 'Prestación de servicios';
  salarioBasico: number;
  bonificaciones?: number;
  deducciones?: number;
  salarioNeto?: number;
  fechaPago?: string;
  metodoPago?: string;
  vacacionesPendientes?: number;
  diasIncapacidad?: number;
  historialPagos?: string;
  autorizacionesEspeciales?: string;
  fechaTerminacion?: string;
  motivoTerminacion?: string;
  observaciones?: string;
  logo_url?: string;
}
// src/interfaces/HojaVida.ts
export interface HojaVidafront {
idHoja_Vida: number; // ID de la hoja de vida
Nombre: string; // Nombre del usuario
CC: string; // Cédula del usuario
FechaCreacion: string; // Fecha de creación de la hoja de vida
TipoUsuario: string; // Tipo de usuario
Estado: string; // Estado del usuario (Activo/Inactivo/Desconocido)
}

export interface HojaVidaAdmin {
direccion: string;
estadoUsuario?: number;
telefonoUsuario?: string;
idEps?: number;
tipo_documento: 'CC' | 'TI' | 'RC' | 'CE';
sexo?: 'M' | 'F';
nacionalidad?: string;
pais?: string;
fecha_nacimiento?: Date;
lugar_nacimiento?: string;
alergias?: string;
discapacidad?: string;
contacto_emergencia_nombre?: string;
contacto_emergencia_parentesco?: string;
contacto_emergencia_telefono?: string;
contacto_emergencia_correo?: string;
cargo: string;
fechaIngreso?: Date;
tipoContrato?: 'Indefinido' | 'Fijo' | 'Prestación de servicios';
salarioBasico?: number;
bonificaciones?: number;
deducciones?: number;
fechaPago?: Date;
metodoPago?: string;
vacacionesPendientes?: number;
diasIncapacidad?: number;
historialPagos?: string;
autorizacionesEspeciales?: string;
fechaTerminacion?: Date;
motivoTerminacion?: string;
observaciones?: string;
}