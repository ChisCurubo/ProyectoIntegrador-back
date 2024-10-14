// Interface with all the attributes of the HojaVidaPaciente table
// Interface with all the attributes of the HojaVidaPaciente table
export interface HojaVida {

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