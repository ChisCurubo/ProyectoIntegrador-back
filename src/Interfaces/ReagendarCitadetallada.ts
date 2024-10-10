export interface ReagendarCitadetallada {
    NombreCompleto: string;         // Nombre completo del paciente
    CorreoElectronico: string;      // Correo electrónico del paciente
    Documento: string;               // Número de documento del paciente (cédula)
    FechaHora: string;              // Fecha y hora de la cita
    TipoCita: string;               // Tipo de cita (servicio)
    ValorConsulta: number;          // Valor de la consulta
    Doctor: string | null;          // Nombre del doctor (puede ser null si no hay doctor asignado)
    Direccion: string | null;       // Dirección del paciente (puede ser null si no hay)
    Telefono: string | null;        // Teléfono del paciente (puede ser null si no hay)
  }
  
  export interface ReagendarCitadetallada {
    NombreCompleto: string;       // Nombre completo del paciente
    CorreoElectronico: string;    // Correo electrónico del paciente
    Documento: string;             // Documento del paciente (número de cédula)
    FechaHora: string;            // Fecha y hora de la cita
    TipoCita: string;             // Tipo de cita (servicio)
    ValorConsulta: number;        // Valor de la consulta
    Doctor: string | null;        // Nombre del doctor (puede ser nulo)
    Direccion: string | null;     // Dirección del paciente (puede ser nulo)
    Telefono: string | null;      // Teléfono del paciente (puede ser nulo)
  }
  