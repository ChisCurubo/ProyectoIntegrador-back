// src/Interfaces/HistoriaClinica.ts

export interface HistoriaClinica {
    idHistoria_Medica?: number;
    tipoSangre: string;
    genero: string;
    fecha_Nac: Date;
    discapacidad: string;
    fecha_Rev: Date;
    hora_Rev: string;
    motivo: string;
    descripcion_Motivo: string;
    presion_Sangre: string;
    presion_Sangre_Prom: string;
    pulso: string;
    saturacion: string;
    altura: number;
    peso: number;
    perinatales: string;
    patologicos: string;
    quirurgicos: string;
    vacunas: string;
    familiares: string;
    conclusion: string;
    diagnostico: string;
    tratamiento: string;
    firma_digital_doctor: string;
  }
  