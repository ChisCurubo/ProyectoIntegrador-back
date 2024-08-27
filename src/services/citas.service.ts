
import connection from '../providers/database';
import Cita from '../models/Modelo.Citas';



class CitaService {
    
    private citas: Cita[];

    // Constructor de la clase CitaService. Inicializa el array citas como un array vacío.

    constructor() {
        this.citas = [];
    }

    // Método público que retorna todas las citas almacenadas en el array citas.

    public getAllCitas(): Cita[] {
        return this.citas;
    }

    public testConnection = async ():  Promise<void> => {
        try {
            const [rows]:any[] = await connection.query('SELECT 1 + 1 AS result');
            console.log('Connection successful:', rows[0].result);
            console.log('Connection successful:', rows[0].result === 2);
        } catch (error: any) {
            console.error('Connection failed:', error.message);
        } 
    };

    // Método público que crea una nueva cita.
    // Recibe como parámetro citaData, que es un objeto parcial de tipo Cita.

    public createCita(citaData: Partial<Cita>): Cita {

        // Crea una nueva instancia de Cita usando los datos proporcionados en citaData.

        const cita = new Cita(citaData);
        // Agrega la nueva cita al array citas.

        this.citas.push(cita);

        // Retorna la nueva cita creada.
        
        return cita;
    }
}

// Exporta la clase CitaService para que pueda ser utilizada en otros archivos.
export default CitaService;
