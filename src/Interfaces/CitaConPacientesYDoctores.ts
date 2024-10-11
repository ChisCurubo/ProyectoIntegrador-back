export interface CitaConPacientesYDoctores {
    Hora: string;             // Hora de la cita
    Día: string;              // Día de la cita
    NombrePaciente: string;   // Nombre del paciente
    NombreDoctor: string | null; // Nombre del doctor (puede ser nulo si no hay doctor asignado)
  }
  