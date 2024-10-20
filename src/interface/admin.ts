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
// src/interfaces/ResumenFinanciero.ts
export interface ResumenFinanciero {
    ingresosMensuales: number;
    gastosOperativos: number;
    margenOperativo: number;
    presupuestoRestante: number;
  }
export interface specialityType {
  idEspecialidad: number;
  nombreEspecialidad: string;
  idSede: number;
}
export interface serviceType {
    idServicio: number;
    nombreServicio: string;
    precioServicio: number;
    idEspecialidad: number;
}
