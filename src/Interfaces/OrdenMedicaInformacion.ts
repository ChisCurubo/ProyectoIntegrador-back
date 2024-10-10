export interface OrdenMedicaInformacion {
    idOrdenMedica: number; // ID de la orden médica
    nombre: string; // Nombre del paciente
    cc: string; // Cédula del paciente
    fechaOrden: string; // Fecha de la orden médica
    doctorAsignado: string; // Nombre del doctor asignado
    estado: string; // Estado de la orden médica (Activo/Inactivo/Desconocido)
}
