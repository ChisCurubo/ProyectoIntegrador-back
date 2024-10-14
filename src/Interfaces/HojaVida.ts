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