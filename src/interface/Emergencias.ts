// Interfaz que define la estructura de una Emergencia
export interface Emergencia {
    idEmergencia: number;
    estadoEmergencia: number;
    horaLlegada: Date;
    idTipo_Emergencia: number;
  }
  
  
export interface EmergenciaDetalle {
  Nombre: string;
  CC: string;
  HoraDeLlegada: string;          // Cambiado de 'Hora de Llegada' a HoraDeLlegada
  NivelDeEmergencia: number;      // Cambiado de 'Nivel de Emergencia' a NivelDeEmergencia
  Estado: string;
  DoctorAsignado: string | null;   // Cambiado de 'Doctor Asignado' a DoctorAsignado
}


// Interfaz que define la estructura de una Emergencia asociada a una cita
export interface CitaEmergencia  {
  idEmergencia_Cita?: number;
  idEmergencia: number;
  idCita: number;
  idServicio: number;
  estatusEmergencia_Cita: number;
}

export interface Eme {
  idEmergencia: number;          // ID de la emergencia
  estadoEmergencia: number;      // Estado de la emergencia (1 = activo, etc.)
  horaLlegada: string;           // Hora de llegada en formato de fecha (YYYY-MM-DD HH:mm:ss)
  idTipo_Emergencia: number;     // ID del tipo de emergencia
  ccPatient: string;             // Cédula del paciente (puede incluir valores numéricos o cadenas mixtas)
}

export interface EmergenciaCita {
  idEmergencia_Cita?: number;
  idEmergencia: number;
  idCita: number;
  idServicio: number;
  statusEmergencia_Cita: string;
}

