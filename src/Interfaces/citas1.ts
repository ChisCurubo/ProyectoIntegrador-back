// Interfaz que define la estructura de una Cita
export interface Cita {
    idCita: number;
    dia: Date;
    hora: string;
    estadoCita: number;
    idServicio: number;
    idHistoria_Medica: number;
    idUsuarioCC: string;
    idDocCC: string;
  }
  