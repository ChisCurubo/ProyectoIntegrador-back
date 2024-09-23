export interface HistoriaMedica {
    idHistoria_Medica: number;
    tipoSangre: string | null;
    genero: 'Hombre' | 'Mujer' | null;
    fecha_Nac: Date | null;
    discapacidad: string | null;
    fecha_Rev: Date | null;
    hora_Rev: string | null;
    motivo: string | null;
    descripcion_Motivo: string | null;
    presion_Sangre: string | null;
    presion_Sangre_Prom: string | null;
    pulso: string | null;
    saturacion: string | null;
    altura: number | null;
    peso: number | null;
    perinatales: string | null;
    patologicos: string | null;
    quirurgicos: string | null;
    vacunas: string | null;
    familiares: string | null;
    conclusion: string | null;
  }