
export interface Cita {
    idCita: number; // Identificador único de la cita
    dia: Date, // Fecha de creación de la cita (en formato 'YYYY-MM-DD')
    hora: string, // Hora establecida para la cita (formato HH:MM)
    estadoCita?: 0 | 1; // Estado de la cita (0: Vigente, 1: No vigente)
    idServicio?: number; // Identificador único del servicio relacionado a la cita
    idHistoriaMedica?: number; // Identificador único de la historia médica
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
  