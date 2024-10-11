// src/Interfaces/EmergenciaDetalle.ts

export interface EmergenciaDetalle {
    Nombre: string;
    CC: string;
    HoraDeLlegada: string;          // Cambiado de 'Hora de Llegada' a HoraDeLlegada
    NivelDeEmergencia: number;      // Cambiado de 'Nivel de Emergencia' a NivelDeEmergencia
    Estado: string;
    DoctorAsignado: string | null;   // Cambiado de 'Doctor Asignado' a DoctorAsignado
}
