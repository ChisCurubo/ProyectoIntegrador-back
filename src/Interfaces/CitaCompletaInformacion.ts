export interface CitaCompletaInformacion {
    IdCita: number; // ID de la cita
    NombreCompleto: string; // Nombre completo del paciente
    CorreoElectronico: string; // Correo electrónico del paciente
    Documento: string; // Documento del paciente
    FechaHora: string; // Fecha y hora de la cita
    TipoCita: string; // Tipo de cita
    ValorConsulta: number; // Valor de la consulta
    Doctor: string | null; // Nombre del doctor
}
