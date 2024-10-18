export interface DoctorInformacion {
    NombreCompleto: string;
    CorreoElectronico: string;
    Documento: string;
    idDoctor: string; // O el tipo que corresponda
    Especialidad: string;
}

export interface Doctor {
    CC: string;
    nombreUsuario: string;
    apellidoUsuario: string;
    idEspecialidad: number;
}