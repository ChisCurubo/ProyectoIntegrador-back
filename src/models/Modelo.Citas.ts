// Define una clase llamada Cita que representa una cita médica.
class Cita {
    // Declaración de propiedades públicas de la clase.
    public id: string;  // Identificador único de la cita.
    public nombre: string;  // Nombre de la persona para la cita.
    public fecha: Date;  // Fecha de la cita.
    public motivo: string;  // Motivo de la cita.

    // Constructor de la clase Cita que acepta un objeto parcial de tipo Cita.
    constructor(data: Partial<Cita>) {
        // Asigna un valor a la propiedad id. Si data.id no está definido, genera un ID aleatorio.
        this.id = data.id || Math.random().toString(36).substr(2, 9);
        // Asigna un valor a la propiedad nombre. Si data.nombre no está definido, asigna una cadena vacía.
        this.nombre = data.nombre || '';
        // Asigna un valor a la propiedad fecha. Si data.fecha no está definido, asigna la fecha actual.
        this.fecha = data.fecha || new Date();
        // Asigna un valor a la propiedad motivo. Si data.motivo no está definido, asigna una cadena vacía.
        this.motivo = data.motivo || '';
    }
}

// Exporta la clase Cita para que pueda ser utilizada en otros archivos.
export default Cita;
