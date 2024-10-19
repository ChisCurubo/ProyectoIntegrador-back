// interfaces/Usuario.ts

// Interfaz que define la estructura de un Usuario
export interface Usuario {
    CC: string ;                // Número de identificación
    nombreUsuario: string;     // Nombre del usuario
    apellidoUsuario: string;   // Apellido del usuario
    emailUsuario: string;      // Correo electrónico del usuario
    pwdUsuario: string;        // Contraseña del usuario
    idSede: number | null;            // ID de la sede a la que pertenece
    idRol: number;             // ID del rol del usuario
    estadoUsuario: boolean;    // Estado activo/inactivo del usuario
    idEspecialidad: number |null;    // ID de la especialidad del usuario
    idHoja_Vida: number;       // ID de la hoja de vida del usuario
    idTipoPaciente: number | null;    // ID del tipo de paciente
}

// Interfaz que define la estructura de un Usuario
export interface UserQueue {
    CC: string ;                // Número de identificación
    nombreUsuario: string;     // Nombre del usuario
    apellidoUsuario: string;   // Apellido del usuario
    emailUsuario: string;      // Correo electrónico del usuario
    idSede?: number | null;            // ID de la sede a la que pertenece
    idRol: number;             // ID del rol del usuario
    idEspecialidad: number |null;    // ID de la especialidad del usuario
    idHoja_Vida: number;       // ID de la hoja de vida del usuario
}