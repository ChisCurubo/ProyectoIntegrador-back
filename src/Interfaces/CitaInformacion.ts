export interface Citainformacion {
    idCita: number;
    Hora: string; // O Date, dependiendo de cómo manejes las horas
    Día: string; // Podría ser Date o string, según el formato que necesites
    NombrePaciente: string;
    EmailPaciente: string;
    NombreDoctor: string | null; // Puede ser nulo si no hay doctor asignado
    EmailDoctor: string | null; // Puede ser nulo si no hay doctor asignado
}
