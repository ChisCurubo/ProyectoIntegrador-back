// src/Interfaces/CRMInformacion.ts

export interface CRMInformacion {
    totalCitas: number;
    citasRealizadas: number;
    doctorMasSolicitado: string;
    usuariosEnSistema: number;
}

export interface CitasPorEspecialidad {
    medicinaGeneral: number;
    emergencias: number;
    laboratorios: number;
    imagenesDiagnosticas: number;
}
