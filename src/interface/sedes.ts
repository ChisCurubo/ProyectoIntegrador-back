
export interface Sede {
    idSede: number;                // Identificador único de la sede
    nombreSede: string;            // Nombre de la sede
    especialidadSede: string;      // Especialidad de la sede
    usuarioSede: string | null;   // Nombre de usuario de la sede (puede ser nulo)
    pwdSede: string | null;       // Contraseña de la sede (puede ser nulo)
}

export interface SedeLogIn {
    idSede?: number;                // Identificador único de la sede
    nombreSede?: string;            // Nombre de la sede
    especialidadSede?: string;      // Especialidad de la sede
    usuarioSede?: string | null;   // Nombre de usuario de la sede (puede ser nulo)
    pwdSede?: string | null;       // Contraseña de la sede (puede ser nulo)
    ipSede?: string | null;
}