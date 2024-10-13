
export interface Cita {
    length: number;
    idCita: number; // Identificador único de la cita
    dia: string; // Fecha de creación de la cita (en formato 'YYYY-MM-DD')
    hora: string; // Hora establecida para la cita (formato HH:MM)
    estadoCita: 0 | 1; // Estado de la cita (0: Vigente, 1: No vigente)
    idServicio: number; // Identificador único del servicio relacionado a la cita
    idHistoriaMedica: number; // Identificador único de la historia médica
    idUsuarioCC: string; // Identificador único del usuario (tipo string porque es VARCHAR(12))
    idDocCC: string; // Identificador único del doctor (tipo string porque es VARCHAR(12))
  }
  // Interfaz que define la estructura de un Usuario
export interface Cita1 {
  CC: string;                // Número de identificación
 
}
export interface CitaHorario {
  hora: string,                
 
}
export interface CitaDetalladaParaAgendar {
  NombreCompleto: string;
  CorreoElectronico: string;
  Documento: string;
  FechaHora: string;
  TipoCita: string;
  ValorConsulta: number;
  Doctor: string | null;
}

export interface ReagendarCitadetallada {
  NombreCompleto: string;         // Nombre completo del paciente
  CorreoElectronico: string;      // Correo electrónico del paciente
  Documento: string;               // Número de documento del paciente (cédula)
  FechaHora: string;              // Fecha y hora de la cita
  TipoCita: string;               // Tipo de cita (servicio)
  ValorConsulta: number;          // Valor de la consulta
  Doctor: string | null;          // Nombre del doctor (puede ser null si no hay doctor asignado)
  Direccion: string | null;       // Dirección del paciente (puede ser null si no hay)
  Telefono: string | null;        // Teléfono del paciente (puede ser null si no hay)
}

export interface ReagendarCitadetallada {
  NombreCompleto: string;       // Nombre completo del paciente
  CorreoElectronico: string;    // Correo electrónico del paciente
  Documento: string;             // Documento del paciente (número de cédula)
  FechaHora: string;            // Fecha y hora de la cita
  TipoCita: string;             // Tipo de cita (servicio)
  ValorConsulta: number;        // Valor de la consulta
  Doctor: string | null;        // Nombre del doctor (puede ser nulo)
  Direccion: string | null;     // Dirección del paciente (puede ser nulo)
  Telefono: string | null;      // Teléfono del paciente (puede ser nulo)
}

export interface CitaConPacientesYDoctores {
  Hora: string;             // Hora de la cita
  Día: string;              // Día de la cita
  NombrePaciente: string;   // Nombre del paciente
  NombreDoctor: string | null; // Nombre del doctor (puede ser nulo si no hay doctor asignado)
}

export interface CitaCompletaInformacion {
  IdCita: number; // ID de la cita
  NombreCompleto: string; // Nombre completo del paciente
  CorreoElectronico: string; // Correo electrónico del paciente
  Documento: string; // Documento del paciente
  FechaHora: string; // Fecha y hora de la cita
  TipoCita: string; // Tipo de cita
  ValorConsulta: number; // Valor de la consulta
  Doctor: string | null; // Nombre del doctor
}
export interface Citainformacion {
  idCita: number;
  Hora: string; // O Date, dependiendo de cómo manejes las horas
  Día: string; // Podría ser Date o string, según el formato que necesites
  NombrePaciente: string;
  EmailPaciente: string;
  NombreDoctor: string | null; // Puede ser nulo si no hay doctor asignado
  EmailDoctor: string | null; // Puede ser nulo si no hay doctor asignado
}

// Interfaz que define la estructura de una Cita
export interface Cita1 {
  idCita: number;
  dia: Date;
  hora: string;
  estadoCita: number;
  idServicio: number;
  idHistoria_Medica: number;
  idUsuarioCC: string;
  idDocCC: string;
}
